'use server'

import { imageUrl } from '@src/lib/imageUrl'
import stripe from '@src/lib/stripe'
import 'server-only'

export type WorkshopBookingMetadata = {
  orderNumber: string
  customerName: string
  customerEmail: string
  clerkUserId: string
  workshopId: string
}

export async function bookWorkshopSession(
  workshop: {
    _id: string
    title: string | null
    price: number | null
    image: object | null
  },
  metadata: WorkshopBookingMetadata,
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
    metadata,
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
            description: `Workshop booking — 1 spot`,
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
