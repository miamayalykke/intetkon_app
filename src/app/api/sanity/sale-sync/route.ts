import { timingSafeEqual } from 'node:crypto'
import stripe from '@src/lib/stripe'
import { type NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'

type ExpandedPromotionCode = Stripe.PromotionCode & { coupon: Stripe.Coupon }

import { backendClient } from '@sanity/lib/backendClient'

type Condition = {
  _type: string
  itemIds?: string[]
  categoryId?: string
  groups?: Array<{ itemIds?: string[] }>
}

type SaleDocument = {
  _id: string
  title?: string
  discountAmount?: number
  discountType?: 'percentage' | 'fixed'
  discountAppliesTo?: 'allItems' | 'matchingItems'
  couponCode?: string
  maxRedemptions?: number
  validFrom?: string
  validTo?: string
  isActive?: boolean
  excludedProductIds?: string[]
  excludedCategoryIds?: string[]
  conditions?: Condition[]
}

// Sanity sends document fields directly in the projection.
// couponCode is included so we can still look up Stripe objects on delete
// (when the Sanity document no longer exists).
type WebhookPayload = {
  _id: string
  _type: string
  couponCode?: string
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

async function fetchSaleFromSanity(
  sanityId: string,
): Promise<SaleDocument | null> {
  return backendClient.fetch<SaleDocument | null>(
    `*[_type in ["sale", "promotion"] && _id == $id][0]{
      _id,
      title,
      discountAmount,
      discountType,
      discountAppliesTo,
      couponCode,
      maxRedemptions,
      validFrom,
      validTo,
      isActive,
      "excludedProductIds": excludedProducts[]->_id,
      "excludedCategoryIds": excludedCategories[]->_id,
      "conditions": conditions[] -> {
        _type,
        "itemIds": items[]._ref,
        "categoryId": category._ref,
        "groups": groups[] {
          "itemIds": items[]._ref
        }
      }
    }`,
    { id: sanityId },
  )
}

// Look up a Stripe promotion code by its code string
async function findPromotionCode(
  couponCode: string,
): Promise<ExpandedPromotionCode | null> {
  const results = await stripe.promotionCodes.list({
    code: couponCode,
    limit: 1,
  })
  return (results.data[0] ?? null) as ExpandedPromotionCode | null
}

// Fetch Stripe Product IDs for all eligible products and workshops (not excluded)
async function getEligibleStripeProductIds(
  excludedProductIds: string[],
  excludedCategoryIds: string[],
): Promise<string[]> {
  const hasExclusions =
    excludedProductIds.length > 0 || excludedCategoryIds.length > 0
  if (!hasExclusions) return []

  const eligible = await backendClient.fetch<{ stripeProductId: string }[]>(
    `*[
      (
        (_type == "product" && !(_id in $excludedProductIds) && !(count(categories[_ref in $excludedCategoryIds]) > 0))
        || _type == "workshop"
      )
      && defined(stripeProductId)
    ]{ stripeProductId }`,
    { excludedProductIds, excludedCategoryIds },
  )

  return eligible.map((p) => p.stripeProductId).filter(Boolean)
}

async function getStripeProductIdsFromConditions(
  conditions: Condition[],
): Promise<string[]> {
  if (!conditions.length) return []

  const allItemIds = new Set<string>()

  for (const condition of conditions) {
    switch (condition._type) {
      case 'condCartContainsAll':
      case 'condCartContainsAny': {
        const ids = condition.itemIds ?? []
        for (const id of ids) allItemIds.add(id)
        break
      }
      case 'condCartContainsOneFromEachGroup': {
        const groups = condition.groups ?? []
        for (const group of groups) {
          const ids = group.itemIds ?? []
          for (const id of ids) allItemIds.add(id)
        }
        break
      }
      case 'condCategoryCount': {
        const categoryId = condition.categoryId
        if (categoryId) {
          const products = await backendClient.fetch<{ _id: string }[]>(
            `*[_type == "product" && $categoryId in categories[]._ref]{ _id }`,
            { categoryId },
          )
          for (const p of products) allItemIds.add(p._id)
        }
        break
      }
    }
  }

  if (!allItemIds.size) return []

  const items = await backendClient.fetch<{ stripeProductId: string }[]>(
    `*[_id in $ids && defined(stripeProductId)]{ stripeProductId }`,
    { ids: Array.from(allItemIds) },
  )

  return items.map((item) => item.stripeProductId).filter(Boolean)
}

async function syncToStripe(doc: SaleDocument): Promise<void> {
  if (!doc.couponCode || doc.discountAmount === undefined) {
    console.warn(
      '[sale-sync] Skipping sync - couponCode or discountAmount missing',
      { id: doc._id },
    )
    return
  }

  const isPercentage = doc.discountType !== 'fixed'
  const discountAppliesTo = doc.discountAppliesTo ?? 'allItems'

  let eligibleStripeProductIds: string[] = []

  if (discountAppliesTo === 'matchingItems' && doc.conditions?.length) {
    eligibleStripeProductIds = await getStripeProductIdsFromConditions(
      doc.conditions,
    )
  } else if (discountAppliesTo === 'allItems') {
    const excludedProductIds = doc.excludedProductIds ?? []
    const excludedCategoryIds = doc.excludedCategoryIds ?? []
    const hasExclusions =
      excludedProductIds.length > 0 || excludedCategoryIds.length > 0

    eligibleStripeProductIds = hasExclusions
      ? await getEligibleStripeProductIds(
          excludedProductIds,
          excludedCategoryIds,
        )
      : []
  }

  // --- Find existing promo code (and its coupon) by code string ---
  const existingPromo = await findPromotionCode(doc.couponCode)
  const existingCoupon = existingPromo
    ? (existingPromo.coupon as Stripe.Coupon)
    : null

  let couponChanged = false
  let couponId: string

  if (existingCoupon) {
    const amountMismatch = isPercentage
      ? existingCoupon.percent_off !== doc.discountAmount
      : existingCoupon.amount_off !== Math.round(doc.discountAmount * 100)
    const typeMismatch = isPercentage
      ? existingCoupon.percent_off === null
      : existingCoupon.amount_off === null

    const currentAppliesTo = existingCoupon.applies_to?.products ?? []
    const appliestoChanged =
      JSON.stringify([...currentAppliesTo].sort()) !==
      JSON.stringify([...eligibleStripeProductIds].sort())

    if (amountMismatch || typeMismatch || appliestoChanged) {
      // Deactivate old promo code before deleting coupon
      if (existingPromo) {
        await stripe.promotionCodes.update(existingPromo.id, { active: false })
      }
      await stripe.coupons.del(existingCoupon.id)
      couponChanged = true
    }
  }

  if (couponChanged || !existingCoupon) {
    const couponParams: Stripe.CouponCreateParams = {
      name: doc.title ?? doc.couponCode,
      metadata: { sanityId: doc._id },
      ...(isPercentage
        ? { percent_off: doc.discountAmount }
        : {
            amount_off: Math.round(doc.discountAmount * 100),
            currency: 'dkk',
          }),
      ...(doc.validTo
        ? { redeem_by: Math.floor(new Date(doc.validTo).getTime() / 1000) }
        : {}),
      ...(eligibleStripeProductIds.length > 0
        ? { applies_to: { products: eligibleStripeProductIds } }
        : {}),
    }
    const newCoupon = await stripe.coupons.create(couponParams)
    couponId = newCoupon.id
    couponId = existingCoupon.id
  }

  // --- Promotion code ---
  const activePromo = couponChanged ? null : existingPromo

  if (activePromo) {
    const redemptionsChanged =
      activePromo.max_redemptions !== (doc.maxRedemptions ?? null)
    if (redemptionsChanged) {
      // max_redemptions cannot be changed after creation - deactivate and recreate
      await stripe.promotionCodes.update(activePromo.id, { active: false })
      await stripe.promotionCodes.create({
        promotion: { type: 'coupon', coupon: couponId },
        code: doc.couponCode,
        active: doc.isActive ?? true,
        metadata: { sanityId: doc._id },
        ...(doc.maxRedemptions ? { max_redemptions: doc.maxRedemptions } : {}),
      })
      colse {
      awonsole.log('[sale-sync] Updated Stripe promotion code:', activePromo.id)
    }
  } else {
    cons
      code: doc.couponCode,
      active: doc.isActive ?? true,
      metadata: { sanityId: doc._id },
      ..
    console.log('[sale-sync] Created Stripe promotion code:', promo.id)
  }
}

async 
  if (!existingPromo) return

  await stripe.promotionCodes.update(existingPromo.id, { active: false })
  console.log(
    '[
  )

  const coupon = existingPromo.coupon as Stripe.Coupon
export async function POST(req: NextRequest) {
  if (!validateSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: WebhookPayload

  console.log(
    '[sale-sync] Received webhook for:',
    payload._id,
    'type:',
    payload._type,
  )
  if (!['sale', 'promotion'].includes(payload._type)) {
    return NextResponse.json({
    const doc = await fetchSaleFromSanity(payload._id)

    if (!doc) {
      // Document deleted - use couponCode from webhook payload for lookup
      if (!payload.couponCode) {
        console.warn(
          '[sale-sync] Deleted document has no couponCode in payload - cannot deactivate',
        )
        return NextResponse.json({ ok: true })
      }
      console.log(
    }
  } catch (error) {
    console.error('[sale-sync] Error syncing sale to Stripe', {
      sanityId: payload._id,
      error,
    })
    return NextResponse.json({ error: 'Stripe sync failed' }, { status: 500 })
  }

  retur
