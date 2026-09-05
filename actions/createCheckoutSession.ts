'use server'

import 'server-only'
import { auth } from '@clerk/nextjs/server'
import { backendClient } from '@sanity/lib/backendClient'
import stripe from '@src/lib/stripe'
import type Stripe from 'stripe'
import type { CartItem } from '../store/store'
import { type ItemForValidation, validatePromoCode } from './validatePromoCode'

type LocalizedString = Array<{ language?: string; value?: string }>

type CanonicalCartDoc = {
  _id: string
  _type: 'product' | 'workshop'
  _rev: string
  price?: number
  productType?: 'digital' | 'physical'
  stock?: number
  date?: string
  maxAllocation?: number
  currentSignUps?: number
  stripeProductId?: string
  name?: LocalizedString | string
  title?: LocalizedString | string
  categoryIds?: string[]
}

type CanonicalCartItem = {
  doc: CanonicalCartDoc
  quantity: number
}

export type Metadata = {
  orderNumber: string
  customerName: string
  customerEmail: string
  clerkUserId: string
  locale: string
  workshopIds?: string
  productIds?: string
}

function getLocalizedName(
  value: LocalizedString | string | undefined,
  locale: string,
): string {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''

  return (
    value.find((entry) => entry.language === locale)?.value ??
    value.find((entry) => entry.language === 'en')?.value ??
    ''
  )
}

export async function createCheckoutSession(
  items: CartItem[],
  metadata: Metadata,
  promoCode?: string,
  locale = 'en',
) {
  try {
    const normalizedLocale = locale === 'da' ? 'da' : 'en'
    const { userId } = await auth()

    if (!items.length) throw new Error('Your basket is empty')

    const requestedQuantities = new Map<string, number>()
    for (const item of items) {
      const id = item.data?._id
      const quantity = Number(item.quantity)
      if (
        typeof id !== 'string' ||
        !id ||
        !Number.isSafeInteger(quantity) ||
        quantity <= 0
      ) {
        throw new Error('Your basket contains an invalid item')
      }
      requestedQuantities.set(id, (requestedQuantities.get(id) ?? 0) + quantity)
    }

    const itemIds = [...requestedQuantities.keys()]
    const canonicalDocs = await backendClient.fetch<CanonicalCartDoc[]>(
      `*[
        _id in $ids &&
        !(_id in path("drafts.**")) &&
        _type in ["product", "workshop"]
      ]{
        _id,
        _type,
        _rev,
        price,
        productType,
        stock,
        date,
        maxAllocation,
        currentSignUps,
        stripeProductId,
        name,
        title,
        "categoryIds": categories[]._ref
      }`,
      { ids: itemIds },
    )
    const canonicalById = new Map(canonicalDocs.map((doc) => [doc._id, doc]))
    const canonicalItems: CanonicalCartItem[] = itemIds.map((id) => {
      const doc = canonicalById.get(id)
      if (!doc) throw new Error(`Item is no longer available: ${id}`)

      const quantity = requestedQuantities.get(id) ?? 0
      if (!Number.isFinite(doc.price) || (doc.price ?? -1) < 0) {
        throw new Error(`Item has an invalid price: ${id}`)
      }

      if (doc._type === 'workshop') {
        if (!doc.date || new Date(doc.date).getTime() <= Date.now()) {
          throw new Error('This workshop is no longer available')
        }
        const remaining = (doc.maxAllocation ?? 0) - (doc.currentSignUps ?? 0)
        if (quantity > remaining) {
          throw new Error(
            remaining > 0
              ? `Only ${remaining} workshop spot${remaining === 1 ? '' : 's'} remain`
              : 'This workshop is sold out',
          )
        }
      } else if (
        doc.productType === 'physical' &&
        doc.stock != null &&
        quantity > doc.stock
      ) {
        throw new Error(
          doc.stock > 0
            ? `Only ${doc.stock} item${doc.stock === 1 ? '' : 's'} remain in stock`
            : 'This item is sold out',
        )
      }

      return { doc, quantity }
    })

    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    })

    let customerId: string | undefined
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    if (!baseUrl) throw new Error('NEXT_PUBLIC_BASE_URL is not set')

    const workshopIds = canonicalItems
      .filter(({ doc }) => doc._type === 'workshop')
      .map(({ doc }) => doc._id)
      .join(',')

    const productIds = canonicalItems
      .filter(({ doc }) => doc._type === 'product')
      .map(({ doc }) => doc._id)
      .join(',')

    // Re-validate the promo server-side so the discount amount can't be
    // tampered with from the client
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined
    if (promoCode) {
      const itemsForValidation: ItemForValidation[] = canonicalItems.map(
        ({ doc, quantity }) => ({
          id: doc._id,
          itemType: doc._type,
          quantity,
          price: doc.price ?? 0,
          categoryIds: doc._type === 'product' ? (doc.categoryIds ?? []) : [],
        }),
      )

      const missingStripeProduct = canonicalItems.find(
        ({ doc }) => !doc.stripeProductId,
      )
      if (missingStripeProduct) {
        throw new Error(
          'One of the items is still being prepared for checkout. Please try again shortly.',
        )
      }

      const promo = await validatePromoCode(promoCode, itemsForValidation)
      if (!promo.valid) {
        throw new Error(`Promo code is no longer valid: ${promo.message}`)
      }

      discounts = [{ promotion_code: promo.stripePromoCodeId }]
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      canonicalItems.map(({ doc, quantity }) => {
        const localized = getLocalizedName(
          doc._type === 'product' ? doc.name : doc.title,
          normalizedLocale,
        )
        const displayName =
          doc._type === 'workshop' && doc.date
            ? `${localized} - ${new Date(doc.date).toLocaleDateString('da-DK')}`
            : localized

        return {
          price_data: {
            currency: 'dkk',
            unit_amount: Math.round((doc.price ?? 0) * 100),
            ...(doc.stripeProductId
              ? { product: doc.stripeProductId }
              : {
                  product_data: {
                    name: displayName || 'Product',
                    metadata: {
                      sanityId: doc._id,
                      sanityType: doc._type,
                    },
                  },
                }),
          },
          quantity,
        }
      })

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : 'always',
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata: {
        ...metadata,
        clerkUserId: userId ?? '',
        locale: normalizedLocale,
        ...(workshopIds ? { workshopIds } : {}),
        ...(productIds ? { productIds } : {}),
      },
      locale: normalizedLocale,
      mode: 'payment',
      payment_method_configuration: 'pmc_1SDjXTJoZ0voIfvhegmhzz3s',
      ...(discounts ? { discounts } : {}),
      success_url: `${baseUrl}/${normalizedLocale}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${baseUrl}/${normalizedLocale}/basket`,
      line_items: lineItems,
    })
    return session.url
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}
