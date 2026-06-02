'use server'

import { imageUrl } from '@src/lib/imageUrl'
import stripe from '@src/lib/stripe'
import 'server-only'
import type { CartItem } from '../store/store'

export type Metadata = {
  orderNumber: string
  customerName: string
  customerEmail: string
  clerkUserId: string
  workshopIds?: string
}

export async function createCheckoutSession(
  items: CartItem[],
  metadata: Metadata,
  promoCodeId?: string,
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

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : 'always',
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata: { ...metadata, ...(workshopIds ? { workshopIds } : {}) },
      mode: 'payment',
      payment_method_configuration: 'pmc_1SDjXTJoZ0voIfvhegmhzz3s',
      ...(promoCodeId
        ? { discounts: [{ promotion_code: promoCodeId }] }
        : { allow_promotion_codes: true }),
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${baseUrl}/basket`,
      line_items: items.map((item) => {
        const name =
          item.itemType === 'product'
            ? (item.data.name ?? 'Unnamed Product')
            : (item.data.title ?? 'Workshop')
        const description =
          item.itemType === 'product'
            ? `Product ID: ${item.data._id}`
            : `Workshop - ${item.data.date ? new Date(item.data.date).toLocaleDateString('da-DK') : ''}`

        return {
          price_data: {
            currency: 'dkk',
            unit_amount: Math.round((item.data.price ?? 1) * 100),
            product_data: {
              name,
              description,
              metadata: { id: item.data._id },
              images: item.data.image
                ? [imageUrl(item.data.image).url()]
                : undefined,
            },
          },
          quantity: item.quantity,
        }
      }),
    })
    return session.url
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}
