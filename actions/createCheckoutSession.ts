'use server'

import 'server-only'
import stripe from '@src/lib/stripe'
import type { CartItem } from '../store/store'

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
  promoCodeId?: string,
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

    const lineItems = items.map((item) => {
      const rawField =
        item.itemType === 'product'
          ? (item.data as any).name
          : (item.data as any).title

      const localized = Array.isArray(rawField)
        ? (rawField.find((f: any) => f.language === locale)?.value ??
          rawField.find((f: any) => f.language === 'en')?.value ??
          '')
        : (rawField ?? '')

      const displayName =
        item.itemType === 'workshop' && (item.data as any).date
          ? `${localized} - ${new Date((item.data as any).date).toLocaleDateString('da-DK')}`
          : localized

      return {
        price_data: {
          currency: 'dkk',
          product_data: { name: displayName },
          unit_amount: Math.round((item.data.price ?? 0) * 100),
        },
        quantity: item.quantity,
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
      ...(promoCodeId
        ? { discounts: [{ promotion_code: promoCodeId }] }
        : { allow_promotion_codes: true }),
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
