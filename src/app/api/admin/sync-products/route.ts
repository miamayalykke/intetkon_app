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
  date?: string
}

async function syncDocToStripe(
  doc: SyncableDocument,
): Promise<{ ok: boolean; id: string; error?: string }> {
  try {
    const resolveLocalized = (field: any): string => {
      if (typeof field === 'string') return field
      if (Array.isArray(field)) {
        const en = field.find((f: any) => f.language === 'en')
        return en?.value ?? field[0]?.value ?? ''
      }
      return ''
    }

    let name: string
    if (doc._type === 'product') {
      name = resolveLocalized(doc.name) || 'Product'
    } else {
      const dateStr = doc.date
        ? new Date(doc.date).toLocaleDateString('da-DK')
        : 'No date'
      name = `${resolveLocalized(doc.title) || 'Workshop'} - ${dateStr}`
    }

    if (doc.stripeProductId) {
      try {
        await stripe.products.update(doc.stripeProductId, {
          name,
          metadata: { sanityId: doc._id },
        })
        return { ok: true, id: doc.stripeProductId }
      } catch (updateError: any) {
        // Stale ID from a different Stripe environment — clear it and create fresh
        if (updateError?.code === 'resource_missing') {
          await backendClient
            .patch(doc._id)
            .unset(['stripeProductId'])
            .commit()
          doc = { ...doc, stripeProductId: undefined }
        } else {
          throw updateError
        }
      }
    }

    const product = await stripe.products.create({
      name,
      metadata: { sanityId: doc._id },
    })

    await backendClient
      .patch(doc._id)
      .set({ stripeProductId: product.id })
      .commit()

    return { ok: true, id: product.id }
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
      date,
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
