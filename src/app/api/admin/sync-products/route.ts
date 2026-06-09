import { currentUser } from '@clerk/nextjs/server'
import { backendClient } from '@sanity/lib/backendClient'
import stripe from '@src/lib/stripe'
import { type NextRequest, NextResponse } from 'next/server'

type SyncableDocument = {
  _id: string
  _type: 'product' | 'workshop'
  name?: string
  title?: string
  price: number
  stripeProductId?: string
}

async function syncDocToStripe(doc: SyncableDocument): Promise<{ ok: boolean; id: string; error?: string }> {
  try {
    const name = doc._type === 'product' ? (doc.name ?? 'Product') : (doc.title ?? 'Workshop')

    if (doc.stripeProductId) {
      await stripe.products.update(doc.stripeProductId, {
        name,
        metadata: { sanityId: doc._id },
      })
      return { ok: true, id: doc.stripeProductId }
    } else {
      const product = await stripe.products.create({
        name,
        type: 'good',
        metadata: { sanityId: doc._id },
      })

      await backendClient.patch(doc._id).set({ stripeProductId: product.id }).commit()

      return { ok: true, id: product.id }
    }
  } catch (error) {
    return { ok: false, id: doc._id, error: String(error) }
  }
}

async function runSync() {
  const docs = await backendClient.fetch<SyncableDocument[]>(`
    *[_type in ["product", "workshop"]] {
      _id,
      _type,
      name,
      title,
      price,
      stripeProductId,
    }
  `)

  const results = await Promise.allSettled(docs.map(syncDocToStripe))

  const summary = results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value
    return { ok: false, id: docs[i]._id, error: String(r.reason) }
  })

  return {
    synced: summary.filter((r) => r.ok).length,
    failed: summary.filter((r) => !r.ok).length,
    details: summary,
  }
}

export async function GET() {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await runSync()
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  void req
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await runSync()
  return NextResponse.json(result)
}
