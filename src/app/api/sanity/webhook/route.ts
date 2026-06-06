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
import AdminOrderNotification, {
  type AdminOrderProduct,
} from '../../../../../emails/admin-order-notification'
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

    try {
      const order = await createOrderInSanity(session)

      const meta = session.metadata ?? {}
      if (meta.workshopIds) {
        const workshopIds = meta.workshopIds.split(',').filter(Boolean)
        for (const workshopId of workshopIds) {
          await backendClient
            .patch(workshopId)
            .inc({ currentSignUps: 1 })
            .commit()
        }
      }

      await sendOrderConfirmationEmail(session, order.sanityProductIds)
      try {
        await sendAdminOrderNotification(session, order)
      } catch (err) {
        console.error('Error sending admin notification:', err)
      }
    } catch (err) {
      console.error('Error processing order:', err)
      return NextResponse.json(
        { error: 'Error processing order' },
        { status: 500 },
      )
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
    metadata as Metadata & { clerkUserId?: string }

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
  )

  const workshopIds =
    (metadata?.workshopIds as string)?.split(',').filter(Boolean) ?? []
  const productIds =
    (metadata?.productIds as string)?.split(',').filter(Boolean) ?? []

  const sanityProducts = productIds.map((id, index) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: 'reference',
      _ref: id,
    },
    quantity: lineItemsWithProduct.data[index]?.quantity || 1,
  }))

  const workshopReferences = workshopIds.map((id) => ({
    _type: 'reference' as const,
    _ref: id,
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
    workshops: workshopReferences.length > 0 ? workshopReferences : undefined,
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

  const details = await backendClient.fetch<
    {
      _id: string
      _type: string
      name?: string
      title?: string
      price: number
      productType?: 'digital' | 'physical_course' | 'physical'
      s3Key?: string
      courseDate?: string
      courseLocation?: string
      date?: string
      location?: string
      duration?: string
      slug?: { current: string }
    }[]
  >(
    `*[_id in $ids]{ _id, _type, name, title, price, productType, s3Key, courseDate, courseLocation, date, location, duration, slug }`,
    { ids: sanityProductIds.map((p) => p.id) },
  )

  const products: OrderProduct[] = []
  for (const { id, quantity } of sanityProductIds) {
    const detail = details.find((p) => p._id === id)
    if (!detail) continue

    const isWorkshop = detail._type === 'workshop'

    let downloadUrl: string | undefined
    if (!isWorkshop && detail.productType === 'digital' && detail.s3Key) {
      downloadUrl = await getPresignedDownloadUrl(detail.s3Key)
    }

    products.push({
      name: isWorkshop
        ? (detail.title ?? 'Workshop')
        : (detail.name ?? 'Product'),
      quantity,
      price: detail.price,
      productType: isWorkshop
        ? 'physical_course'
        : (detail.productType ?? 'physical'),
      downloadUrl,
      courseDate: isWorkshop ? detail.date : detail.courseDate,
      courseLocation: isWorkshop ? detail.location : detail.courseLocation,
      courseDuration: isWorkshop ? detail.duration : undefined,
      productUrl: detail.slug?.current
        ? `${baseUrl}${isWorkshop ? '/workshops' : '/product'}/${detail.slug.current}`
        : undefined,
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
          Subject: { Data: `Order confirmed - ${orderNumber}` },
          Body: { Html: { Data: html } },
        },
      },
    }),
  )
}

async function sendAdminOrderNotification(
  session: Stripe.Checkout.Session,
  order: any,
) {
  const { metadata, amount_total, currency, total_details } = session
  const { orderNumber, customerName, customerEmail } = metadata as Metadata
  const amountDiscount = total_details?.amount_discount
    ? total_details.amount_discount / 100
    : 0

  const details = await backendClient.fetch<
    {
      _id: string
      _type: string
      name?: string
      title?: string
      price: number
      productType?: 'digital' | 'physical_course' | 'physical'
      courseDate?: string
      courseLocation?: string
      date?: string
      location?: string
      duration?: string
    }[]
  >(
    `*[_id in $ids]{ _id, _type, name, title, price, productType, courseDate, courseLocation, date, location, duration }`,
    { ids: order.sanityProductIds.map((p: any) => p.id) },
  )

  const products: AdminOrderProduct[] = []
  for (const { id, quantity } of order.sanityProductIds) {
    const detail = details.find((p) => p._id === id)
    if (!detail) continue

    const isWorkshop = detail._type === 'workshop'

    products.push({
      name: isWorkshop
        ? (detail.title ?? 'Workshop')
        : (detail.name ?? 'Product'),
      quantity,
      price: detail.price,
      productType: isWorkshop
        ? 'physical_course'
        : (detail.productType ?? 'physical'),
      courseDate: isWorkshop ? detail.date : detail.courseDate,
      courseLocation: isWorkshop ? detail.location : detail.courseLocation,
      courseDuration: isWorkshop ? detail.duration : undefined,
    })
  }

  const sanityOrderUrl = `https://sanity.io/manage/personal/desk/orders;${order._id}`

  const html = await render(
    AdminOrderNotification({
      customerName,
      customerEmail,
      orderNumber,
      orderDate: new Date().toISOString(),
      totalPrice: amount_total ? amount_total / 100 : 0,
      amountDiscount,
      currency: currency ?? 'dkk',
      products,
      sanityOrderUrl,
    }),
  )

  const adminEmail = process.env.ADMIN_ORDER_EMAIL || 'info@intetkon.com'

  await sesv2.send(
    new SendEmailCommand({
      FromEmailAddress: ORDER_FROM_EMAIL,
      Destination: { ToAddresses: [adminEmail] },
      Content: {
        Simple: {
          Subject: { Data: `New order - ${orderNumber}` },
          Body: { Html: { Data: html } },
        },
      },
    }),
  )
}
