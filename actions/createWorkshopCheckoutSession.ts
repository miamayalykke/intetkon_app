'use server'

import { imageUrl } from '@src/lib/imageUrl'
import stripe from '@src/lib/stripe'
import 'server-only'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export type WorkshopCheckoutMetadata = {
  checkoutType: 'workshop'
  orderNumber: string
  customerName: string
  customerEmail: string
  clerkUserId: string
  workshopId: string
  workshopTitle: string
  workshopDate: string
  workshopLocation: string
  workshopDuration: string
  workshopSlug: string
}

export async function createWorkshopCheckoutSession(
  workshop: {
    _id: string
    title: string | null
    price: number | null
    slug: { current: string } | null
    image?: SanityImageSource
    date?: string | null
    location?: string | null
    duration?: string | null
  },
  metadata: WorkshopCheckoutMetadata,
) {
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

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    customer_creation: customerId ? undefined : 'always',
    customer_email: !customerId ? metadata.customerEmail : undefined,
    metadata: metadata as unknown as Record<string, string>,
    mode: 'payment',
    allow_promotion_codes: true,
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
    cancel_url: `${baseUrl}/workshops`,
    line_items: [
      {
        price_data: {
          currency: 'dkk',
          unit_amount: Math.round((workshop.price ?? 0) * 100),
          product_data: {
            name: workshop.title ?? 'Workshop',
            description: `Workshop — ${metadata.workshopDate}`,
            metadata: { workshopId: workshop._id },
            images: workshop.image
              ? [imageUrl(workshop.image).url()]
              : undefined,
          },
        },
        quantity: 1,
      },
    ],
  })

  return session.url
}
