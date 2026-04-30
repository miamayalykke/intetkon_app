'use server'

import { client } from '@sanity/lib/client'
import { defineQuery } from 'next-sanity'
import type { BasketItem } from '../store/store'

// ─── Public types ─────────────────────────────────────────────────────────────

export type CartContext = {
  items: BasketItem[]
  customerId: string | null // Clerk user ID — used for per-customer redemption limits
  enteredCouponCode?: string // whatever the customer typed in the basket
}

export type AppliedPromotion = {
  promotionId: string
  title: string
  description: string | null
  discountAmountDKK: number // final DKK amount to deduct (pre-computed)
  scopeMode: 'all' | 'include_only' | 'exclude'
  // IDs of products that are affected by the scope (used by basket UI to label items)
  affectedProductIds: string[] // for include_only: items that DO get the discount
  unaffectedProductIds: string[] // for exclude: items that do NOT get the discount
  couponCode?: string // set only for code-gated promotions (for display)
}

// ─── Internal Sanity shape ────────────────────────────────────────────────────

type SanityCondition =
  | { _type: 'cond_cart_contains_all'; _key: string; productIds: string[] }
  | {
      _type: 'cond_cart_contains_any'
      _key: string
      productIds: string[]
      minQuantity: number | null
    }
  | {
      _type: 'cond_coupon_code'
      _key: string
      code: string
      maxUsesGlobal: number | null
      maxUsesPerCustomer: number | null
      usedCount: number
    }
  | { _type: 'cond_cart_subtotal'; _key: string; operator: 'gte' | 'lte'; amount: number }
  | {
      _type: 'cond_product_count'
      _key: string
      countType: 'distinct_products' | 'total_quantity'
      operator: 'gte' | 'eq' | 'lte'
      count: number
    }
  | { _type: 'cond_category_count'; _key: string; categoryId: string; minCount: number }

type SanityPromotion = {
  _id: string
  title: string
  description: string | null
  conditionLogic: 'all' | 'any'
  conditions: SanityCondition[]
  actionType: 'percent_off' | 'fixed_off'
  discountPercent: number | null
  discountAmountDKK: number | null
  scopeMode: 'all' | 'include_only' | 'exclude'
  scopeProductIds: string[]
  scopeCategoryIds: string[]
  stackable: boolean
  priority: number
  maxRedemptions: number | null
  redemptionCount: number
}

// ─── Sanity query ─────────────────────────────────────────────────────────────

const ACTIVE_PROMOTIONS_QUERY = defineQuery(`
  *[
    _type == "promotion"
    && isActive == true
    && (validFrom == null || validFrom <= $now)
    && (validTo == null || validTo >= $now)
  ] | order(priority desc) {
    _id,
    title,
    description,
    conditionLogic,
    conditions[] {
      _type,
      _key,
      ...select(_type == "cond_cart_contains_all" => {
        "productIds": products[]->_id,
      }),
      ...select(_type == "cond_cart_contains_any" => {
        "productIds": products[]->_id,
        minQuantity,
      }),
      ...select(_type == "cond_coupon_code" => {
        code,
        maxUsesGlobal,
        maxUsesPerCustomer,
        usedCount,
      }),
      ...select(_type == "cond_cart_subtotal" => {
        operator,
        amount,
      }),
      ...select(_type == "cond_product_count" => {
        countType,
        operator,
        count,
      }),
      ...select(_type == "cond_category_count" => {
        "categoryId": category->_id,
        minCount,
      }),
    },
    actionType,
    discountPercent,
    discountAmountDKK,
    scopeMode,
    "scopeProductIds": scopeProducts[]->_id,
    "scopeCategoryIds": scopeCategories[]->_id,
    stackable,
    priority,
    maxRedemptions,
    redemptionCount,
  }
`)

// ─── Condition evaluation ─────────────────────────────────────────────────────

function evaluateCondition(cond: SanityCondition, cart: CartContext): boolean {
  const basketIds = new Set(cart.items.map((i) => i.product._id))

  switch (cond._type) {
    case 'cond_cart_contains_all': {
      const ids = (cond.productIds ?? []).filter(Boolean)
      if (ids.length === 0) return false
      return ids.every((id) => basketIds.has(id))
    }

    case 'cond_cart_contains_any': {
      const ids = (cond.productIds ?? []).filter(Boolean)
      if (ids.length === 0) return false
      const matches = ids.filter((id) => basketIds.has(id))
      return matches.length >= (cond.minQuantity ?? 1)
    }

    case 'cond_coupon_code': {
      if (!cart.enteredCouponCode || !cond.code) return false
      const codeMatch = cart.enteredCouponCode.trim().toUpperCase() === cond.code.trim().toUpperCase()
      if (!codeMatch) return false
      // Check global usage cap
      if (cond.maxUsesGlobal != null && (cond.usedCount ?? 0) >= cond.maxUsesGlobal) return false
      return true
      // Per-customer cap is checked separately in checkRedemptionLimits
    }

    case 'cond_cart_subtotal': {
      const subtotal = cart.items.reduce(
        (s, i) => s + (i.product.price ?? 0) * i.quantity,
        0,
      )
      return cond.operator === 'gte' ? subtotal >= cond.amount : subtotal <= cond.amount
    }

    case 'cond_product_count': {
      const val =
        cond.countType === 'distinct_products'
          ? cart.items.length
          : cart.items.reduce((s, i) => s + i.quantity, 0)
      if (cond.operator === 'gte') return val >= cond.count
      if (cond.operator === 'eq') return val === cond.count
      return val <= cond.count
    }

    case 'cond_category_count': {
      if (!cond.categoryId) return false
      const inCategory = cart.items.filter((i) =>
        i.product.categories?.some((c) => c._ref === cond.categoryId),
      )
      return inCategory.length >= (cond.minCount ?? 1)
    }
  }
}

function evaluateConditions(
  conditions: SanityCondition[],
  logic: 'all' | 'any',
  cart: CartContext,
): boolean {
  if (!conditions || conditions.length === 0) return true // no conditions = always applies
  if (logic === 'any') return conditions.some((c) => evaluateCondition(c, cart))
  return conditions.every((c) => evaluateCondition(c, cart))
}

// ─── Redemption limit checks ──────────────────────────────────────────────────

async function checkRedemptionLimits(
  promo: SanityPromotion,
  customerId: string | null,
): Promise<boolean> {
  // Global cap
  if (promo.maxRedemptions != null && (promo.redemptionCount ?? 0) >= promo.maxRedemptions) {
    return false
  }

  // Per-customer cap from cond_coupon_code conditions
  if (!customerId) return true

  const couponConditions = (promo.conditions ?? []).filter(
    (c): c is Extract<SanityCondition, { _type: 'cond_coupon_code' }> =>
      c._type === 'cond_coupon_code',
  )

  for (const cond of couponConditions) {
    if (cond.maxUsesPerCustomer == null) continue
    const count = await client.fetch<number>(
      `count(*[_type == "promotionRedemption" && promotionId == $promotionId && customerId == $customerId])`,
      { promotionId: promo._id, customerId },
      { cache: 'no-store' },
    )
    if (count >= cond.maxUsesPerCustomer) return false
  }

  return true
}

// ─── Scope filtering ──────────────────────────────────────────────────────────

function getScopeItems(promo: SanityPromotion, cart: CartContext): BasketItem[] {
  const { scopeMode, scopeProductIds, scopeCategoryIds } = promo
  const hasTargets = scopeProductIds?.length > 0 || scopeCategoryIds?.length > 0

  if (scopeMode === 'all' || !hasTargets) return cart.items

  const productSet = new Set(scopeProductIds ?? [])
  const categorySet = new Set(scopeCategoryIds ?? [])

  const isTargeted = (item: BasketItem) =>
    productSet.has(item.product._id) ||
    item.product.categories?.some((c) => categorySet.has(c._ref))

  if (scopeMode === 'include_only') return cart.items.filter(isTargeted)
  if (scopeMode === 'exclude') return cart.items.filter((i) => !isTargeted(i))
  return cart.items
}

// ─── Discount computation ─────────────────────────────────────────────────────

function computeDiscountAmount(promo: SanityPromotion, scopeItems: BasketItem[]): number {
  const scopeSubtotal = scopeItems.reduce(
    (s, i) => s + (i.product.price ?? 0) * i.quantity,
    0,
  )
  if (scopeSubtotal <= 0) return 0

  if (promo.actionType === 'percent_off') {
    return scopeSubtotal * ((promo.discountPercent ?? 0) / 100)
  }
  if (promo.actionType === 'fixed_off') {
    return Math.min(promo.discountAmountDKK ?? 0, scopeSubtotal)
  }
  return 0
}

// ─── Stacking resolution ──────────────────────────────────────────────────────

function resolveStacking(
  matched: Array<{ promo: SanityPromotion; discountAmountDKK: number; scopeItems: BasketItem[] }>,
): typeof matched {
  // Already sorted by priority desc (from GROQ). Walk the list and stop
  // when a non-stackable promotion is reached.
  const result: typeof matched = []
  for (const entry of matched) {
    if (result.length === 0) {
      result.push(entry)
      if (!entry.promo.stackable) break
    } else {
      if (!entry.promo.stackable) break
      result.push(entry)
    }
  }
  return result
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function evaluatePromotions(cart: CartContext): Promise<AppliedPromotion[]> {
  if (cart.items.length === 0) return []

  try {
    const now = new Date().toISOString()
    const promotions = await client.fetch<SanityPromotion[]>(
      ACTIVE_PROMOTIONS_QUERY,
      { now },
      { cache: 'no-store' },
    )

    if (!promotions?.length) return []

    const matched: Array<{
      promo: SanityPromotion
      discountAmountDKK: number
      scopeItems: BasketItem[]
    }> = []

    for (const promo of promotions) {
      // 1. Check conditions
      const conditionsPass = evaluateConditions(
        promo.conditions ?? [],
        promo.conditionLogic ?? 'all',
        cart,
      )
      if (!conditionsPass) continue

      // 2. Check redemption limits
      const withinLimits = await checkRedemptionLimits(promo, cart.customerId)
      if (!withinLimits) continue

      // 3. Compute scope and discount
      const scopeItems = getScopeItems(promo, cart)
      const discountAmountDKK = computeDiscountAmount(promo, scopeItems)
      if (discountAmountDKK <= 0) continue

      matched.push({ promo, discountAmountDKK, scopeItems })
    }

    // 4. Resolve stacking
    const final = resolveStacking(matched)

    // 5. Build AppliedPromotion results
    return final.map(({ promo, discountAmountDKK, scopeItems }) => {
      const scopeItemIds = new Set(scopeItems.map((i) => i.product._id))
      const allIds = cart.items.map((i) => i.product._id)

      const affectedProductIds =
        promo.scopeMode === 'include_only' ? scopeItems.map((i) => i.product._id) : allIds

      const unaffectedProductIds =
        promo.scopeMode === 'exclude'
          ? cart.items.filter((i) => !scopeItemIds.has(i.product._id)).map((i) => i.product._id)
          : []

      // Find the coupon code from conditions (for display)
      const couponCond = (promo.conditions ?? []).find(
        (c): c is Extract<SanityCondition, { _type: 'cond_coupon_code' }> =>
          c._type === 'cond_coupon_code',
      )

      return {
        promotionId: promo._id,
        title: promo.title,
        description: promo.description ?? null,
        discountAmountDKK,
        scopeMode: promo.scopeMode ?? 'all',
        affectedProductIds,
        unaffectedProductIds,
        couponCode: couponCond?.code,
      }
    })
  } catch (error) {
    console.error('[evaluatePromotions] Error', error)
    return []
  }
}
