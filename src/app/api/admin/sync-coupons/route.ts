import { backendClient } from '@sanity/lib/backendClient'
import stripe from '@src/lib/stripe'
import { currentUser } from '@clerk/nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'

type SyncDocument = {
  _id: string
  _type: 'sale' | 'promotion'
  title?: string
  discountAmount?: number
  discountType?: 'percentage' | 'fixed'
  couponCode?: string
  maxRedemptions?: number
  validTo?: string
  isActive?: boolean
  excludedProductIds?: string[]
  excludedCategoryIds?: string[]
}

async function findExistingPromo(code: string) {
  const results = await stripe.promotionCodes.list({ code, limit: 1 })
  if (!results.data[0]) return null
  const promo = results.data[0] as Stripe.PromotionCode & { coupon: Stripe.Coupon }
  return promo
}

async function getEligibleStripeProductIds(
  excludedProductIds: string[],
  excludedCategoryIds: string[],
) {
  if (!excludedProductIds.length && !excludedCategoryIds.length) return []
  const eligible = await backendClient.fetch<{ stripeProductId: string }[]>(
    `*[
      _type == "product"
      && defined(stripeProductId)
      && !(_id in $excludedProductIds)
      && !(count(categories[_ref in $excludedCategoryIds]) > 0)
    ]{ stripeProductId }`,
    { excludedProductIds, excludedCategoryIds },
  )
  return eligible.map((p) => p.stripeProductId).filter(Boolean)
}

async function syncDocToStripe(doc: SyncDocument): Promise<{ ok: boolean; code: string; error?: string }> {
  if (!doc.couponCode || doc.discountAmount === undefined) {
    return { ok: false, code: doc.couponCode ?? '(none)', error: 'Missing couponCode or discountAmount' }
  }

  const isPercentage = doc.discountType !== 'fixed'
  const excludedProductIds = doc.excludedProductIds ?? []
  const excludedCategoryIds = doc.excludedCategoryIds ?? []
  const eligibleStripeProductIds =
    excludedProductIds.length || excludedCategoryIds.length
      ? await getEligibleStripeProductIds(excludedProductIds, excludedCategoryIds)
      : []

  const existingPromo = await findExistingPromo(doc.couponCode)
  const existingCoupon = existingPromo?.coupon ?? null

  let couponId: string

  if (existingCoupon) {
    const amountMismatch = isPercentage
      ? existingCoupon.percent_off !== doc.discountAmount
      : existingCoupon.amount_off !== Math.round(doc.discountAmount * 100)
    const typeMismatch = isPercentage
      ? existingCoupon.percent_off === null
      : existingCoupon.amount_off === null
    const currentApplies = existingCoupon.applies_to?.products ?? []
    const appliesChanged =
      JSON.stringify([...currentApplies].sort()) !==
      JSON.stringify([...eligibleStripeProductIds].sort())

    if (amountMismatch || typeMismatch || appliesChanged) {
      if (existingPromo) {
        await stripe.promotionCodes.update(existingPromo.id, { active: false })
      }
      await stripe.coupons.del(existingCoupon.id)
      const couponParams: Stripe.CouponCreateParams = {
        name: doc.title ?? doc.couponCode,
        metadata: { sanityId: doc._id },
        ...(isPercentage
          ? { percent_off: doc.discountAmount }
          : { amount_off: Math.round(doc.discountAmount * 100), currency: 'dkk' }),
        ...(doc.validTo ? { redeem_by: Math.floor(new Date(doc.validTo).getTime() / 1000) } : {}),
        ...(eligibleStripeProductIds.length ? { applies_to: { products: eligibleStripeProductIds } } : {}),
      }
      const newCoupon = await stripe.coupons.create(couponParams)
      couponId = newCoupon.id
    } else {
      couponId = existingCoupon.id
    }
  } else {
    const couponParams: Stripe.CouponCreateParams = {
      name: doc.title ?? doc.couponCode,
      metadata: { sanityId: doc._id },
      ...(isPercentage
        ? { percent_off: doc.discountAmount }
        : { amount_off: Math.round(doc.discountAmount * 100), currency: 'dkk' }),
      ...(doc.validTo ? { redeem_by: Math.floor(new Date(doc.validTo).getTime() / 1000) } : {}),
      ...(eligibleStripeProductIds.length ? { applies_to: { products: eligibleStripeProductIds } } : {}),
    }
    const newCoupon = await stripe.coupons.create(couponParams)
    couponId = newCoupon.id
  }

  const activePromo = existingCoupon?.id === couponId ? existingPromo : null

  if (activePromo) {
    const redemptionsChanged = activePromo.max_redemptions !== (doc.maxRedemptions ?? null)
    if (redemptionsChanged) {
      await stripe.promotionCodes.update(activePromo.id, { active: false })
      await stripe.promotionCodes.create({
        promotion: { type: 'coupon', coupon: couponId },
        code: doc.couponCode,
        active: doc.isActive ?? true,
        metadata: { sanityId: doc._id },
        ...(doc.maxRedemptions ? { max_redemptions: doc.maxRedemptions } : {}),
      })
    } else {
      await stripe.promotionCodes.update(activePromo.id, { active: doc.isActive ?? true })
    }
  } else {
    await stripe.promotionCodes.create({
      promotion: { type: 'coupon', coupon: couponId },
      code: doc.couponCode,
      active: doc.isActive ?? true,
      metadata: { sanityId: doc._id },
      ...(doc.maxRedemptions ? { max_redemptions: doc.maxRedemptions } : {}),
    })
  }

  return { ok: true, code: doc.couponCode }
}

async function runSync() {
  const docs = await backendClient.fetch<SyncDocument[]>(`
    *[_type in ["sale", "promotion"] && defined(couponCode) && defined(discountAmount)] {
      _id,
      _type,
      title,
      discountAmount,
      discountType,
      couponCode,
      maxRedemptions,
      validTo,
      isActive,
      "excludedProductIds": excludedProducts[]->_id,
      "excludedCategoryIds": excludedCategories[]->_id,
    }
  `)

  const results = await Promise.allSettled(docs.map(syncDocToStripe))

  const summary = results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value
    return { ok: false, code: docs[i].couponCode ?? '?', error: String(r.reason) }
  })

  return {
    synced: summary.filter((r) => r.ok).length,
    failed: summary.filter((r) => !r.ok).length,
    details: summary,
  }
}

// GET: trigger from browser while signed in to Clerk
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
