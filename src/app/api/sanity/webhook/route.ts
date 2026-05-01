import { SendEmailCommand } from '@aws-sdk/client-sesv2'
import { render } from '@react-email/render'
import { backendClient } from '@sanity/lib/backendClient'
import { getPresignedDownloadUrl } from '@src/lib/s3-client'
import { ORDER_FROM_EMAIL, sesv2 } from '@src/lib/ses-client'
import stripe from '@src/lib/stripe'
import { headers } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import type { Metadata } from '../../../../../actions/createCheckoutSession'
import OrderConfirmationEmail, {
  type OrderProduct,
} from '../../../../../emails/order-confirmation'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe webhook secret is not set' },
      { status: 400 },
    )
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('webhook signature verification failed:', err)
    return NextResponse.json(
      { error: `Webhook error: ${err}` },
      { status: 400 },
    )
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata ?? {}

    if (meta.checkoutType === 'workshop') {
      // Increment spot counter in Sanity
      try {
        await backendClient
          .patch(meta.workshopId)
          .inc({ currentSignUps: 1 })
          .commit()
        console.info(
          'Incremented currentSignUps for workshop:',
          meta.workshopId,
        )
      } catch (err) {
        console.error('Error incrementing workshop sign-ups:', err)
        return NextResponse.json(
          { error: 'Error updating workshop sign-ups' },
          { status: 500 },
        )
      }
    } else {
      try {
        const order = await createOrderInSanity(session)
        console.info('Order created in Sanity:', order)
        await sendOrderConfirmationEmail(session, order.sanityProductIds)
      } catch (err) {
        console.error('Error processing order:', err)
        return NextResponse.json(
          { error: 'Error processing order' },
          { status: 500 },
        )
      }
    }
  }
  return NextResponse.json({ recieved: true })
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session

  const { orderNumber, customerName, customerEmail, clerkUserId } =
    metadata as Metadata

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    { expand: ['data.price.product'] },
  )

  // TEMPORARY DEBUG LOG
  console.info(
    'line items debug:',
    JSON.stringify(
      lineItemsWithProduct.data.map((item) => {
        const product = item.price?.product
        const isDeleted =
          typeof product === 'object' &&
          product !== null &&
          'deleted' in product
        return {
          priceProductType: typeof product,
          metadata:
            !isDeleted && typeof product === 'object' && product !== null
              ? (product as Stripe.Product).metadata
              : null,
          resolvedRef: !isDeleted
            ? (product as Stripe.Product)?.metadata?.id
            : null,
        }
      }),
      null,
      2,
    ),
  )

  const sanityProducts = lineItemsWithProduct.data.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: 'reference',
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item.quantity || 0,
  }))

  const order = await backendClient.create({
    _type: 'order',
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName,
    stripeCustomerId: customer,
    clerkUserId,
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0,
    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: 'paid',
    orderDate: new Date().toISOString(),
  })

  return {
    ...order,
    sanityProductIds: sanityProducts
      .map((p) => ({ id: p.product._ref, quantity: p.quantity }))
      .filter((p) => p.id),
  }
}

async function sendOrderConfirmationEmail(
  session: Stripe.Checkout.Session,
  sanityProductIds: { id: string; quantity: number }[],
) {
  const { metadata, amount_total, currency } = session
  const { orderNumber, customerName, customerEmail } = metadata as Metadata

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  // Fetch full product details from Sanity
  const productDetails = await backendClient.fetch<
    {
      _id: string
      name: string
      price: number
      productType: 'digital' | 'physical_course' | 'physical'
      s3Key?: string
      courseDate?: string
      courseLocation?: string
    }[]
  >(
    `*[_type == "product" && _id in $ids]{ _id, name, price, productType, s3Key, courseDate, courseLocation }`,
    { ids: sanityProductIds.map((p) => p.id) },
  )

  // TEMPORARY DEBUG LOG
  console.info(
    'product fetch ids:',
    sanityProductIds.map((p) => p.id),
  )
  console.info('product fetch results:', JSON.stringify(productDetails))

  const products: OrderProduct[] = []
  for (const { id, quantity } of sanityProductIds) {
    const detail = productDetails.find((p) => p._id === id)
    if (!detail) continue

    let downloadUrl: string | undefined
    if (detail.productType === 'digital' && detail.s3Key) {
      downloadUrl = await getPresignedDownloadUrl(detail.s3Key)
    }

    products.push({
      name: detail.name,
      quantity,
      price: detail.price,
      productType: detail.productType ?? 'physical',
      downloadUrl,
      courseDate: detail.courseDate,
      courseLocation: detail.courseLocation,
    })
  }

  const html = await render(
    OrderConfirmationEmail({
      customerName,
      orderNumber,
      orderDate: new Date().toISOString(),
      totalPrice: amount_total ? amount_total / 100 : 0,
      currency: currency ?? 'dkk',
      products,
      ordersPageUrl: `${baseUrl}/app/orders`,
    }),
  )

  await sesv2.send(
    new SendEmailCommand({
      FromEmailAddress: ORDER_FROM_EMAIL,
      Destination: { ToAddresses: [customerEmail] },
      Content: {
        Simple: {
          Subject: { Data: `Order confirmed — ${orderNumber}` },
          Body: { Html: { Data: html } },
        },
      },
    }),
  )
}
