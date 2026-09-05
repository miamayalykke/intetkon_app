import { SendEmailCommand } from '@aws-sdk/client-sesv2'

function formatEndTime(endDate: string | undefined | null): string {
  if (!endDate) return ''
  const { format: dateFnsFormat } = require('date-fns')
  const { toZonedTime } = require('date-fns-tz')
  return dateFnsFormat(
    toZonedTime(new Date(endDate), 'Europe/Copenhagen'),
    'HH:mm',
  )
}

import { render } from '@react-email/render'
import { backendClient } from '@sanity/lib/backendClient'
import { blockContentToHtml } from '@src/lib/blockContentToHtml'

import { ORDER_FROM_EMAIL, sesv2 } from '@src/lib/ses-client'
import stripe from '@src/lib/stripe'
import { revalidatePath } from 'next/cache'
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
import WorkshopAdditionalInfoEmail from '../../../../../emails/workshop-additional-info'
import WorkshopConfirmationEmail from '../../../../../emails/workshop-confirmation'

type PurchasedItem = {
  id: string
  type: 'product' | 'workshop'
  quantity: number
  _rev: string
  productType?: 'digital' | 'physical'
  stock?: number
  maxAllocation?: number
  currentSignUps?: number
}

type PurchasedDocument = Omit<PurchasedItem, 'id' | 'type' | 'quantity'> & {
  _id: string
  _type: 'product' | 'workshop'
}

type CreatedOrder = Record<string, any> & {
  wasCreated: boolean
  sanityProductIds: Array<{ id: string; quantity: number }>
}

function orderDocumentId(sessionId: string): string {
  return `order.${sessionId.replace(/[^a-zA-Z0-9_-]/g, '-')}`
}

async function getPurchasedItems(
  session: Stripe.Checkout.Session,
): Promise<PurchasedItem[]> {
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
    expand: ['data.price.product'],
  })
  const quantities = new Map<string, number>()

  for (const lineItem of lineItems.data) {
    const product = lineItem.price?.product
    const metadata =
      product && typeof product !== 'string' && !product.deleted
        ? product.metadata
        : undefined
    const sanityId = metadata?.sanityId
    if (sanityId) {
      quantities.set(
        sanityId,
        (quantities.get(sanityId) ?? 0) + (lineItem.quantity ?? 1),
      )
    }
  }

  // Compatibility for Checkout sessions created before line items carried the
  // Sanity ID on their Stripe Product.
  if (quantities.size === 0) {
    const metadata = session.metadata ?? {}
    for (const id of (metadata.productIds ?? '').split(',').filter(Boolean)) {
      quantities.set(id, (quantities.get(id) ?? 0) + 1)
    }
    for (const id of (metadata.workshopIds ?? '').split(',').filter(Boolean)) {
      quantities.set(id, (quantities.get(id) ?? 0) + 1)
    }
  }

  const ids = [...quantities.keys()]
  if (ids.length === 0) return []

  const docs = await backendClient.fetch<PurchasedDocument[]>(
    `*[
      _id in $ids &&
      !(_id in path("drafts.**")) &&
      _type in ["product", "workshop"]
    ]{
      _id,
      _type,
      _rev,
      productType,
      stock,
      maxAllocation,
      currentSignUps
    }`,
    { ids },
  )

  if (docs.length !== ids.length) {
    throw new Error('One or more purchased items no longer exist')
  }

  return docs.map((doc) => ({
    id: doc._id,
    type: doc._type,
    quantity: quantities.get(doc._id) ?? 1,
    _rev: doc._rev,
    productType: doc.productType,
    stock: doc.stock,
    maxAllocation: doc.maxAllocation,
    currentSignUps: doc.currentSignUps,
  }))
}

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
      const meta = session.metadata ?? {}
      const purchasedItems = meta.privateEventSlotId
        ? []
        : await getPurchasedItems(session)
      const order = await createOrderInSanity(session, purchasedItems)

      if (meta.privateEventSlotId) {
        // Private atelier booking: mark the slot as booked and send
        // dedicated confirmation/notification emails
        const bookingCompleted = await handlePrivateEventBooking(session)
        if (!bookingCompleted) {
          return NextResponse.json({ received: true, duplicate: true })
        }
      } else {
        if (!order.wasCreated) {
          return NextResponse.json({ received: true, duplicate: true })
        }

        const workshopIds = purchasedItems
          .filter((item) => item.type === 'workshop')
          .map((item) => item.id)
        const productIds = purchasedItems
          .filter((item) => item.type === 'product')
          .map((item) => item.id)
        const locale = meta.locale ?? 'en'

        try {
          if (workshopIds.length > 0 && productIds.length === 0) {
            await sendWorkshopConfirmationEmails(session, workshopIds, locale)
          } else {
            await sendOrderConfirmationEmail(
              session,
              order.sanityProductIds,
              locale,
            )
          }
        } catch (err) {
          console.error('Error sending customer order confirmation:', err)
        }

        try {
          await sendAdminOrderNotification(session, order)
        } catch (err) {
          console.error('Error sending admin notification:', err)
        }
      }
    } catch (err) {
      console.error('Error processing order:', err)
      return NextResponse.json(
        { error: 'Error processing order' },
        { status: 500 },
      )
    }
  }

  if (event.type === 'checkout.session.expired') {
    await releasePrivateEventReservation(
      event.data.object as Stripe.Checkout.Session,
    )
  }

  return NextResponse.json({ received: true })
}

async function releasePrivateEventReservation(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const meta = session.metadata ?? {}
  const slotId = meta.privateEventSlotId
  const reservationId = meta.privateEventReservationId
  if (!slotId || !reservationId) return

  const slot = await backendClient.fetch<{
    _rev: string
    status?: string
    reservationId?: string
  } | null>(
    `*[_id == $id][0]{
      _rev,
      status,
      "reservationId": reservation.id
    }`,
    { id: slotId },
  )

  if (slot?.status !== 'reserved' || slot.reservationId !== reservationId) {
    return
  }

  await backendClient
    .patch(slotId)
    .ifRevisionId(slot._rev)
    .set({ status: 'available' })
    .unset(['reservation'])
    .commit()
  revalidatePath('/en/book-atelieret')
  revalidatePath('/da/book-atelieret')
}

async function handlePrivateEventBooking(
  session: Stripe.Checkout.Session,
): Promise<boolean> {
  const meta = session.metadata ?? {}
  const slotId = meta.privateEventSlotId
  if (!slotId) return false

  const locale = meta.locale === 'da' ? 'da' : 'en'
  const customerName = meta.customerName ?? ''
  const customerEmail =
    meta.customerEmail || session.customer_details?.email || ''
  const reservationId = meta.privateEventReservationId
  const totalDkk = session.amount_total ? session.amount_total / 100 : 0

  const slot = await backendClient.fetch<{
    _rev: string
    date?: string
    status?: string
    reservationId?: string
    bookedOrderNumber?: string
  } | null>(
    `*[_type == "privateEventSlot" && _id == $id][0]{
      _rev,
      date,
      status,
      "reservationId": reservation.id,
      "bookedOrderNumber": booking.orderNumber
    }`,
    { id: slotId },
  )

  if (slot?.status === 'booked') {
    if (slot.bookedOrderNumber === meta.orderNumber) return false
    throw new Error(`Private event slot ${slotId} is already booked`)
  }

  const isLegacyCheckout = !reservationId && slot?.status === 'available'
  const ownsReservation =
    reservationId &&
    slot?.status === 'reserved' &&
    slot.reservationId === reservationId
  if (!slot || (!isLegacyCheckout && !ownsReservation)) {
    throw new Error(`Private event reservation for slot ${slotId} is invalid`)
  }

  await backendClient
    .patch(slotId)
    .ifRevisionId(slot._rev)
    .set({
      status: 'booked',
      booking: {
        customerName,
        customerEmail,
        groupSize: Number(meta.privateEventGroupSize) || undefined,
        occasion: meta.privateEventOccasion || undefined,
        projectWish: meta.privateEventProjectWish || undefined,
        addonsSummary: meta.privateEventAddons || undefined,
        orderNumber: meta.orderNumber,
        bookedAt: new Date().toISOString(),
      },
    })
    .unset(['reservation'])
    .commit()
  revalidatePath('/en/book-atelieret')
  revalidatePath('/da/book-atelieret')

  const dateLabel = slot?.date
    ? new Date(slot.date).toLocaleString(locale === 'da' ? 'da-DK' : 'en-GB', {
        timeZone: 'Europe/Copenhagen',
        dateStyle: 'full',
        timeStyle: 'short',
      })
    : ''

  const rows = (pairs: Array<[string, string]>) =>
    pairs
      .filter(([, v]) => v)
      .map(
        ([label, value]) =>
          `<tr><td style="padding:4px 12px 4px 0;color:#888;">${label}</td><td style="padding:4px 0;">${value}</td></tr>`,
      )
      .join('')

  if (customerEmail) {
    const subject =
      locale === 'da'
        ? `Din booking af ateliéret er bekræftet – ${dateLabel}`
        : `Your atelier booking is confirmed – ${dateLabel}`
    const body =
      locale === 'da'
        ? `<p>Hej ${customerName},</p>
           <p>Tak for din booking! Vi glæder os til at se jer i ateliéret.</p>
           <table style="border-collapse:collapse;">${rows([
             ['Dato', dateLabel],
             ['Antal personer', meta.privateEventGroupSize ?? ''],
             ['Tilvalg', meta.privateEventAddons ?? ''],
             ['Ordrenummer', meta.orderNumber ?? ''],
             ['Betalt', `${totalDkk.toFixed(2)} DKK`],
           ])}</table>
           <p>Har I ønsker til projektet, eller ændrer jeres planer sig, så svar bare på denne mail.</p>
           <p>Kærlig hilsen<br/>Intetkøn</p>`
        : `<p>Hi ${customerName},</p>
           <p>Thank you for your booking! We look forward to seeing you in the atelier.</p>
           <table style="border-collapse:collapse;">${rows([
             ['Date', dateLabel],
             ['Group size', meta.privateEventGroupSize ?? ''],
             ['Add-ons', meta.privateEventAddons ?? ''],
             ['Order number', meta.orderNumber ?? ''],
             ['Paid', `${totalDkk.toFixed(2)} DKK`],
           ])}</table>
           <p>If you have wishes for the project, or your plans change, just reply to this email.</p>
           <p>Warm regards<br/>Intetkøn</p>`
    try {
      await sesv2.send(
        new SendEmailCommand({
          FromEmailAddress: ORDER_FROM_EMAIL,
          Destination: { ToAddresses: [customerEmail] },
          Content: {
            Simple: {
              Subject: { Data: subject },
              Body: {
                Html: {
                  Data: `<div style="font-family:sans-serif;max-width:560px;">${body}</div>`,
                },
              },
            },
          },
        }),
      )
    } catch (err) {
      console.error('Error sending private event confirmation:', err)
    }
  }

  const adminEmail = process.env.ADMIN_ORDER_EMAIL || 'info@intetkon.com'
  try {
    await sesv2.send(
      new SendEmailCommand({
        FromEmailAddress: ORDER_FROM_EMAIL,
        Destination: { ToAddresses: [adminEmail] },
        ReplyToAddresses: customerEmail ? [customerEmail] : undefined,
        Content: {
          Simple: {
            Subject: {
              Data: `Ny booking: Book ateliéret – ${dateLabel} (${customerName})`,
            },
            Body: {
              Html: {
                Data: `<div style="font-family:sans-serif;max-width:560px;">
                  <h2>Ateliéret er booket!</h2>
                  <table style="border-collapse:collapse;">${rows([
                    ['Dato', dateLabel],
                    ['Navn', customerName],
                    ['Email', customerEmail],
                    ['Antal personer', meta.privateEventGroupSize ?? ''],
                    ['Anledning', meta.privateEventOccasion ?? ''],
                    ['Projektønske', meta.privateEventProjectWish ?? ''],
                    ['Tilvalg', meta.privateEventAddons ?? ''],
                    ['Ordrenummer', meta.orderNumber ?? ''],
                    ['Betalt', `${totalDkk.toFixed(2)} DKK`],
                  ])}</table>
                  <p style="color:#888;font-size:12px;">Detaljerne ligger også på slottet i Sanity under "Private Event Slot".</p>
                </div>`,
              },
            },
          },
        },
      }),
    )
  } catch (err) {
    console.error('Error sending private event admin notification:', err)
  }

  return true
}

async function createOrderInSanity(
  session: Stripe.Checkout.Session,
  purchasedItems: PurchasedItem[],
): Promise<CreatedOrder> {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session

  const { orderNumber, customerName, customerEmail, clerkUserId, locale } =
    metadata as Metadata & { clerkUserId?: string }

  const deterministicId = orderDocumentId(id)
  const existingOrder = await backendClient.fetch<Record<string, any> | null>(
    `*[_id == $id][0]`,
    { id: deterministicId },
  )
  if (existingOrder) {
    return { ...existingOrder, wasCreated: false, sanityProductIds: [] }
  }

  const productItems = purchasedItems.filter((item) => item.type === 'product')
  const workshopItems = purchasedItems.filter(
    (item) => item.type === 'workshop',
  )

  for (const item of purchasedItems) {
    if (item.type === 'workshop') {
      const remaining = (item.maxAllocation ?? 0) - (item.currentSignUps ?? 0)
      if (item.quantity > remaining) {
        throw new Error(`Workshop ${item.id} no longer has enough capacity`)
      }
    } else if (
      item.productType === 'physical' &&
      item.stock != null &&
      item.quantity > item.stock
    ) {
      throw new Error(`Product ${item.id} no longer has enough stock`)
    }
  }

  const sanityProducts = productItems.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: 'reference',
      _ref: item.id,
    },
    quantity: item.quantity,
  }))

  const workshopReferences = workshopItems.map((item) => ({
    _type: 'reference' as const,
    _ref: item.id,
  }))

  const order = {
    _id: deterministicId,
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
    locale: locale ?? 'en',
  }

  const transaction = backendClient.transaction().create(order)
  for (const item of purchasedItems) {
    transaction.patch(item.id, (patch) => {
      const increments: Record<string, number> =
        item.type === 'workshop'
          ? { currentSignUps: item.quantity }
          : { salesCount: item.quantity }
      if (
        item.type === 'product' &&
        item.productType === 'physical' &&
        item.stock != null
      ) {
        increments.stock = -item.quantity
      }
      return patch
        .ifRevisionId(item._rev)
        .setIfMissing(item.type === 'product' ? { salesCount: 0 } : {})
        .inc(increments)
    })
  }

  try {
    await transaction.commit()
  } catch (error) {
    // A concurrent delivery can race between the existence check and create.
    // If its deterministic order now exists, this delivery is a duplicate.
    const concurrentlyCreated = await backendClient.fetch<Record<
      string,
      any
    > | null>(`*[_id == $id][0]`, { id: deterministicId })
    if (concurrentlyCreated) {
      return {
        ...concurrentlyCreated,
        wasCreated: false,
        sanityProductIds: [],
      }
    }
    throw error
  }

  return {
    ...order,
    wasCreated: true,
    sanityProductIds: purchasedItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    })),
  }
}

async function sendOrderConfirmationEmail(
  session: Stripe.Checkout.Session,
  sanityProductIds: { id: string; quantity: number }[],
  locale: string,
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
      s3KeyEn?: Array<{ s3Key: string; filename?: string }>
      s3KeyDa?: Array<{ s3Key: string; filename?: string }>
      courseDate?: string
      courseLocation?: string
      date?: string
      endDate?: string
      location?: string
      slug?: { current: string }
    }[]
  >(
    `*[_id in $ids]{
      _id,
      _type,
      "name": name[language == $locale][0].value,
      "title": title[language == $locale][0].value,
      price,
      productType,
      s3KeyEn,
      s3KeyDa,
      courseDate,
      courseLocation,
      date,
      endDate,
      location,
      "slug": slug[language == $locale][0].value
    }`,
    { ids: sanityProductIds.map((p) => p.id), locale },
  )

  const products: OrderProduct[] = []
  for (const { id, quantity } of sanityProductIds) {
    const detail = details.find((p) => p._id === id)
    if (!detail) continue

    const isWorkshop = detail._type === 'workshop'

    const downloadUrls: { label: string; url: string }[] = []
    if (!isWorkshop && detail.productType === 'digital') {
      const enLabel =
        locale === 'da' ? 'Download (Engelsk)' : 'Download (English)'
      const daLabel = locale === 'da' ? 'Download (Dansk)' : 'Download (Danish)'
      const sessionId = session.id

      if (detail.s3KeyEn && detail.s3KeyEn.length > 0) {
        detail.s3KeyEn.forEach((file, index) => {
          const fileName = file.filename?.trim()
            ? file.filename
            : `${enLabel} ${index + 1}`
          downloadUrls.push({
            label: `${fileName}`,
            url: `${baseUrl}/api/download/${detail._id}?session=${sessionId}&locale=en&index=${index}`,
          })
        })
      }

      if (detail.s3KeyDa && detail.s3KeyDa.length > 0) {
        detail.s3KeyDa.forEach((file, index) => {
          const fileName = file.filename?.trim()
            ? file.filename
            : `${daLabel} ${index + 1}`
          downloadUrls.push({
            label: `${fileName}`,
            url: `${baseUrl}/api/download/${detail._id}?session=${sessionId}&locale=da&index=${index}`,
          })
        })
      }
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
      downloadUrls: downloadUrls.length > 0 ? downloadUrls : undefined,
      courseDate: isWorkshop ? detail.date : detail.courseDate,
      courseLocation: isWorkshop ? detail.location : detail.courseLocation,
      courseDuration: isWorkshop
        ? formatEndTime((detail as any).endDate)
        : undefined,
      productUrl: detail.slug?.current
        ? `${baseUrl}/${locale}${isWorkshop ? '/workshops' : '/product'}/${detail.slug.current}`
        : undefined,
    })
  }

  const subject =
    locale === 'da'
      ? `Ordre bekræftet — ${orderNumber}`
      : `Order confirmed — ${orderNumber}`

  const html = await render(
    OrderConfirmationEmail({
      customerName,
      orderNumber,
      orderDate: new Date().toISOString(),
      totalPrice: amount_total ? amount_total / 100 : 0,
      currency: currency ?? 'dkk',
      products,
      ordersPageUrl: `${baseUrl}/${locale}/app/orders`,
      locale,
    }),
  )

  await sesv2.send(
    new SendEmailCommand({
      FromEmailAddress: ORDER_FROM_EMAIL,
      Destination: { ToAddresses: [customerEmail] },
      Content: {
        Simple: {
          Subject: { Data: subject },
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
      endDate?: string
      location?: string
    }[]
  >(
    `*[_id in $ids]{
      _id,
      _type,
      "name": name[language == "en"][0].value,
      "title": title[language == "en"][0].value,
      price,
      productType,
      courseDate,
      courseLocation,
      date,
      endDate,
      location
    }`,
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
      courseDuration: isWorkshop ? formatEndTime(detail.endDate) : undefined,
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

async function sendWorkshopConfirmationEmails(
  session: Stripe.Checkout.Session,
  workshopIds: string[],
  locale: string,
) {
  const { metadata, currency } = session
  const { orderNumber, customerName, customerEmail } = metadata as Metadata

  const workshops = await backendClient.fetch<
    {
      _id: string
      title?: string
      date?: string
      endDate?: string
      location?: string
      level?: string
      price: number
      mailInformation?: any
    }[]
  >(
    `*[_id in $ids]{
      _id,
      "title": title[language == $locale][0].value,
      date,
      endDate,
      location,
      level,
      price,
      "mailInformation": mailInformation[language == $locale][0].value
    }`,
    { ids: workshopIds, locale },
  )

  const subject =
    locale === 'da'
      ? `Workshop bekræftet — ${orderNumber}`
      : `Workshop confirmed — ${orderNumber}`

  for (const workshop of workshops) {
    const workshopTitle = workshop.title ?? 'Workshop'

    const html = await render(
      WorkshopConfirmationEmail({
        customerName,
        orderNumber,
        workshopTitle,
        workshopDate: workshop.date ?? '',
        workshopEndTime: formatEndTime(workshop.endDate),
        workshopLocation: workshop.location ?? '',
        workshopLevel: workshop.level ?? '',
        price: workshop.price,
        currency: currency ?? 'dkk',
        locale,
      }),
    )

    await sesv2.send(
      new SendEmailCommand({
        FromEmailAddress: ORDER_FROM_EMAIL,
        Destination: { ToAddresses: [customerEmail] },
        Content: {
          Simple: {
            Subject: { Data: subject },
            Body: { Html: { Data: html } },
          },
        },
      }),
    )

    const additionalInfoHtml = workshop.mailInformation
      ? blockContentToHtml(workshop.mailInformation)
      : null

    if (additionalInfoHtml) {
      const additionalSubject =
        locale === 'da'
          ? `Yderligere information — ${workshopTitle}`
          : `Additional information — ${workshopTitle}`

      const additionalHtml = await render(
        WorkshopAdditionalInfoEmail({
          customerName,
          workshopTitle,
          contentHtml: additionalInfoHtml,
          locale,
        }),
      )

      await sesv2.send(
        new SendEmailCommand({
          FromEmailAddress: ORDER_FROM_EMAIL,
          Destination: { ToAddresses: [customerEmail] },
          Content: {
            Simple: {
              Subject: { Data: additionalSubject },
              Body: { Html: { Data: additionalHtml } },
            },
          },
        }),
      )
    }
  }
}
