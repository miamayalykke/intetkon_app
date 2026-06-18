'use server'

import stripe from '@src/lib/stripe'
import 'server-only'
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

    const lineItems = await Promise.all(
      items.map(async (item) => {
        const stripeProductId = (item.data as any).stripeProductId

        if (!stripeProductId) {
          throw new Error(
            `Product "${item.itemType === 'product' ? (item.data as any).name : (item.data as any).title}" is missing Stripe ID. Please sync products first.`,
          )
        }

        const prices = await stripe.prices.list({
          product: stripeProductId,
          active: true,
          limit: 1,
        })

        if (!prices.data.length) {
          throw new Error(
            `No price found for product "${item.itemType === 'product' ? (item.data as any).name : (item.data as any).title}". Please sync products first.`,
          )
        }

        return {
          price: prices.data[0].id,
          quantity: item.quantity,
        }
      }),
    )

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
