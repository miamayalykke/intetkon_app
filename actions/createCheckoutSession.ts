'use server'

import 'server-only'
import { backendClient } from '@sanity/lib/backendClient'
import stripe from '@src/lib/stripe'
import type Stripe from 'stripe'
import type { CartItem } from '../store/store'
import { type ItemForValidation, validatePromoCode } from './validatePromoCode'

type CanonicalPriceDoc = { _id: string; price?: number }

export type Metadata = {
  orderNumber: string
  customerName: string
  customerEmail: string
  clerkUserId: string
  locale: string
  workshopIds?: string
  productIds?: string
}

export async function createCheckoutSession(
  items: CartItem[],
  metadata: Metadata,
  promoCode?: string,
  locale = 'en',
) {
  try {
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    })

    let customerId: string | undefined
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    const workshopIds = items
      .filter((item) => item.itemType === 'workshop')
      .map((item) => item.data._id)
      .join(',')

    const productIds = items
      .filter((item) => item.itemType === 'product')
      .map((item) => item.data._id)
      .join(',')

    // Prices arrive on `item.data` from the client-persisted basket
    // (localStorage) and can be tampered with. Re-fetch the canonical price
    // for every item from Sanity by _id and use that for anything
    // money-related instead of trusting the client value.
    const itemIds = items.map((item) => item.data._id)
    const canonicalDocs = itemIds.length
      ? await backendClient.fetch<CanonicalPriceDoc[]>(
          `*[_id in $ids]{ _id, price }`,
          { ids: itemIds },
        )
      : []
    const canonicalPriceById = new Map(
      canonicalDocs.map((doc) => [doc._id, doc.price ?? 0]),
    )
    for (const item of items) {
      if (!canonicalPriceById.has(item.data._id)) {
        throw new Error(
          `Item is no longer available: ${item.data._id}`,
        )
      }
    }
    const getCanonicalPrice = (id: string) => canonicalPriceById.get(id) ?? 0

    // Re-validate the promo server-side so the discount amount can't be
    // tampered with from the client
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined
    if (promoCode) {
      const itemsForValidation: ItemForValidation[] = items.map((item) => ({
        id: item.data._id,
        itemType: item.itemType,
        quantity: item.quantity,
        price: getCanonicalPrice(item.data._id),
        categoryIds:
          item.itemType === 'product'
            ? (
                (item.data as { categories?: { _ref?: string }[] })
                  .categories ?? []
              )
                .map((c) => c?._ref ?? '')
                .filter(Boolean)
            : [],
      }))

      const promo = await validatePromoCode(promoCode, itemsForValidation)
      if (!promo.valid) {
        throw new Error(`Promo code is no longer valid: ${promo.message}`)
      }

      if (promo.appliesTo === 'matchingItems') {
        const amountOff = Math.round(promo.discountValue * 100)
        if (amountOff > 0) {
          const coupon = await stripe.coupons.create({
            amount_off: amountOff,
            currency: 'dkk',
            duration: 'once',
            name: promoCode.toUpperCase().slice(0, 40),
          })
          discounts = [{ coupon: coupon.id }]
        }
      } else {
        discounts = [{ promotion_code: promo.stripePromoCodeId }]
      }
    }

    const lineItems = items.map((item) => {
      try {
        const rawField =
          item.itemType === 'product'
            ? (item.data as any).name
            : (item.data as any).title

        let localized = ''
        if (Array.isArray(rawField)) {
          const localeMatch = rawField.find((f: any) => f?.language === locale)
          const enMatch = rawField.find((f: any) => f?.language === 'en')
          localized = localeMatch?.value ?? enMatch?.value ?? ''
        } else if (typeof rawField === 'string') {
          localized = rawField
        }

        const displayName =
          item.itemType === 'workshop' && (item.data as any).date
            ? `${localized} - ${new Date((item.data as any).date).toLocaleDateString('da-DK')}`
            : localized

        return {
          price_data: {
            currency: 'dkk',
            product_data: { name: displayName || 'Product' },
            unit_amount: Math.round(getCanonicalPrice(item.data._id) * 100),
          },
          quantity: item.quantity,
        }
      } catch (error) {
        console.error('Error processing line item:', error, item)
        throw new Error(
          `Failed to process item: ${error instanceof Error ? error.message : 'Unknown error'}`,
        )
      }
    })

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : 'always',
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata: {
        ...metadata,
        ...(workshopIds ? { workshopIds } : {}),
        ...(productIds ? { productIds } : {}),
      },
      locale: (locale === 'da' ? 'da' : 'en') as any,
      mode: 'payment',
      payment_method_configuration: 'pmc_1SDjXTJoZ0voIfvhegmhzz3s',
      ...(discounts ? { discounts } : { allow_promotion_codes: true }),
      success_url: `${baseUrl}/${locale}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${baseUrl}/${locale}/basket`,
      line_items: lineItems,
    })
    return session.url
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}
