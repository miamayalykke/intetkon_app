import { timingSafeEqual } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import stripe from '@src/lib/stripe'
import { backendClient } from '@sanity/lib/backendClient'
import { imageUrl } from '@src/lib/imageUrl'

// Sanity sends the document fields directly — no operation/result/previous wrapper
type WebhookPayload = {
  _id: string
  _type: string
  name?: string
  image?: { asset?: { _ref: string }; _type: 'image' }
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

async function syncProductToStripe(payload: WebhookPayload): Promise<void> {
  console.log('[product-sync] Syncing product', { id: payload._id, name: payload.name })

  const imageUri = payload.image ? imageUrl(payload.image).width(800).url() : undefined

  // Fetch the existing stripeProductId from Sanity first.
  // Using a direct retrieve avoids Stripe's search index lag, which would
  // otherwise cause a new product to be created on every webhook call.
  const current = await backendClient.fetch<{ stripeProductId?: string }>(
    `*[_type == "product" && _id == $id][0]{ stripeProductId }`,
    { id: payload._id },
  )

  let stripeProductId: string

  if (current?.stripeProductId) {
    // Product already synced — update it directly
    await stripe.products.update(current.stripeProductId, {
      name: payload.name ?? 'Unnamed Product',
      ...(imageUri ? { images: [imageUri] } : {}),
    })
    stripeProductId = current.stripeProductId
    console.log('[product-sync] Updated Stripe product:', stripeProductId)
  } else {
    // No existing Stripe product — fall back to metadata search, then create
    const searchResults = await stripe.products.search({
      query: `metadata['sanityId']:'${payload._id}'`,
      limit: 1,
    })
    const existing = searchResults.data[0] ?? null

    if (existing) {
      await stripe.products.update(existing.id, {
        name: payload.name ?? 'Unnamed Product',
        ...(imageUri ? { images: [imageUri] } : {}),
      })
      stripeProductId = existing.id
      console.log('[product-sync] Updated Stripe product (via search):', stripeProductId)
    } else {
      const created = await stripe.products.create({
        name: payload.name ?? 'Unnamed Product',
        metadata: { sanityId: payload._id },
        ...(imageUri ? { images: [imageUri] } : {}),
      })
      stripeProductId = created.id
      console.log('[product-sync] Created Stripe product:', stripeProductId)
    }

    // Write stripeProductId back to Sanity so future webhooks use direct retrieve
    await backendClient.patch(payload._id).set({ stripeProductId }).commit()
    console.log('[product-sync] Wrote stripeProductId back to Sanity:', stripeProductId)
  }
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

  console.log('[product-sync] Raw payload:', JSON.stringify(payload, null, 2))

  if (payload._type !== 'product') {
    console.log('[product-sync] Skipping — _type is:', payload._type)
    return NextResponse.json({ ok: true, skipped: 'not a product document' })
  }

  try {
    await syncProductToStripe(payload)
  } catch (error) {
    console.error('[product-sync] Error syncing product to Stripe', { sanityId: payload._id, error })
    return NextResponse.json({ error: 'Stripe sync failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
