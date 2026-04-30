'use server'

import { imageUrl } from '@src/lib/imageUrl'
import stripe from '@src/lib/stripe'
import 'server-only'
import type { BasketItem } from '../store/store'
import type { AppliedPromotion } from './evaluatePromotions'

export type Metadata = {
  orderNumber: string
  customerName: string
  customerEmail: string
  clerkUserId: string
  // JSON.stringify(string[]) — promotion _ids applied at checkout
  appliedPromotionIds?: string
  // The coupon code entered by the customer (for display in order history)
  couponCode?: string
}

export type GroupedBasketItem = {
  product: BasketItem['product']
  quantity: number
}

export async function createCheckoutSession(
  items: GroupedBasketItem[],
  metadata: Metadata,
  appliedPromotions: AppliedPromotion[] = [],
) {
  try {
    const itemsWithoutPrice = items.filter((item) => !item.product.price)
    if (itemsWithoutPrice.length > 0) {
      throw new Error('Some items do not have a price')
    }

    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    })

    let customerId: string | undefined
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    }

    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? `https://${process.env.VERCEL_URL}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}`

    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`
    const cancelUrl = `${baseUrl}/basket`

    // Product line items
    const productLineItems = items.map((item) => {
      const unitAmount = Math.round((item.product.price ?? 1) * 100)
      const stripeProductId = item.product.stripeProductId

      if (stripeProductId) {
        return {
          price_data: {
            currency: 'dkk',
            unit_amount: unitAmount,
            product: stripeProductId,
          },
          quantity: item.quantity,
        }
      }

      return {
        price_data: {
          currency: 'dkk',
          unit_amount: unitAmount,
          product_data: {
            name: item.product.name || 'Unnamed Product',
            description: `Product ID: ${item.product._id}`,
            metadata: { id: item.product._id },
            images: item.product.image ? [imageUrl(item.product.image).url()] : undefined,
          },
        },
        quantity: item.quantity,
      }
    })

    // Discount line items — one negative entry per applied promotion.
    // This replaces the Stripe PromotionCode approach, giving full control
    // over which discounts apply and how they are calculated.
    const discountLineItems = appliedPromotions
      .filter((p) => p.discountAmountDKK > 0)
      .map((p) => ({
        price_data: {
          currency: 'dkk',
          product_data: {
            name: `Discount: ${p.title}`,
          },
          unit_amount: -Math.round(p.discountAmountDKK * 100),
        },
        quantity: 1,
      }))

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : 'always',
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [...productLineItems, ...discountLineItems],
    })

    return session.url
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}
