import { timingSafeEqual } from 'node:crypto'
import { type NextRequest, NextResponse } from 'next/server'

import { backendClient } from '@sanity/lib/backendClient'
import stripe from '@src/lib/stripe'

type SyncableDocument = {
  _id: string
  _type: 'product' | 'workshop'
  name?: string
  title?: string
  price: number
  stripeProductId?: string
  date?: string
}

type WebhookPayload = {
  _id: string
  _type: string
}

function validateSecret(req: NextRequest): boolean {
  const incoming = req.headers.get('x-sanity-webhook-secret')
  const expected = process.env.SANITY_WEBHOOK_SECRET
  if (!incoming || !expected) return false
  try {
    return timingSafeEqual(Buffer.from(incoming), Buffer.from(expected))
  } catch {
    return false
  }
}

async function fetchDocFromSanity(sanityId: string): Promise<SyncableDocument | null> {
  return backendClient.fetch<SyncableDocument | null>(
    `*[_id == $id && _type in ["product", "workshop"]][0]{
      _id,
      _type,
      name,
      title,
      price,
      stripeProductId,
      date,
    }`,
    { id: sanityId },
  )
}

async function syncToStripe(doc: SyncableDocument): Promise<void> {
  let name: string
  if (doc._type === 'product') {
    name = doc.name ?? 'Product'
  } else {
    const date = (doc as any).date
    const dateStr = date ? new Date(date).toLocaleDateString('da-DK') : 'No date'
    name = `${doc.title ?? 'Workshop'} - ${dateStr}`
  }
  let productId: string

  if (doc.stripeProductId) {
    await stripe.products.update(doc.stripeProductId, {
      name,
      metadata: { sanityId: doc._id },
    })
    console.log('[product-sync] Updated Stripe product:', doc.stripeProductId)
    productId = doc.stripeProductId
  } else {
    const product = await stripe.products.create({
      name,
      type: 'good',
      metadata: { sanityId: doc._id },
    })
    console.log('[product-sync] Created Stripe product:', product.id)
    productId = product.id

    await backendClient
      .patch(doc._id)
      .set({ stripeProductId: product.id })
      .commit()
  }

  try {
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      limit: 1,
    })

    if (prices.data.length > 0) {
      const existingPrice = prices.data[0]
      if (existingPrice.unit_amount !== Math.round(doc.price * 100)) {
        await stripe.prices.update(existingPrice.id, { active: false })
        await stripe.prices.create({
          product: productId,
          currency: 'dkk',
          unit_amount: Math.round(doc.price * 100),
        })
        console.log('[product-sync] Created new price for product:', productId)
      }
    } else {
      await stripe.prices.create({
        product: productId,
        currency: 'dkk',
        unit_amount: Math.round(doc.price * 100),
      })
      console.log('[product-sync] Created price for product:', productId)
    }
  } catch (error) {
    console.error('[product-sync] Error creating price for product:', productId, error)
  }
}

async function deactivateInStripe(stripeProductId: string): Promise<void> {
  if (!stripeProductId) return

  await stripe.products.update(stripeProductId, { active: false })
  console.log('[product-sync] Deactivated Stripe product:', stripeProductId)
}

export async function POST(req: NextRequest) {
  if (!validateSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: WebhookPayload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('[product-sync] Received webhook for:', payload._id, 'type:', payload._type)

  if (!['product', 'workshop'].includes(payload._type)) {
    return NextResponse.json({ ok: true, skipped: 'not a product or workshop document' })
  }

  try {
    const doc = await fetchDocFromSanity(payload._id)

    if (!doc) {
      console.log('[product-sync] Document deleted — deactivating in Stripe:', payload._id)
      await deactivateInStripe(payload._id)
    } else {
      console.log('[product-sync] Syncing document:', doc._id)
      await syncToStripe(doc)
    }
  } catch (error) {
    console.error('[product-sync] Error syncing product to Stripe', {
      sanityId: payload._id,
      error,
    })
    return NextResponse.json({ error: 'Stripe sync failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
