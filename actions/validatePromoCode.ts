'use server'

import { backendClient } from '@sanity/lib/backendClient'
import stripe from '@src/lib/stripe'
import 'server-only'

export type ItemForValidation = {
  id: string
  itemType: 'product' | 'workshop'
  quantity: number
  price: number
  categoryIds: string[]
}

type Condition = {
  _type: string
  itemIds?: string[]
  minAmount?: number
  minCount?: number
  categoryId?: string
  groups?: Array<{ label?: string; itemIds?: string[] }>
}

type PromoDoc = {
  _id: string
  _type: 'sale' | 'promotion'
  discountAmount: number
  discountType?: 'percentage' | 'fixed'
  discountAppliesTo?: 'allItems' | 'matchingItems'
  validFrom?: string
  validTo?: string
  conditions?: Condition[]
}

export type PromoValidationResult =
  | {
      valid: true
      stripePromoCodeId: string
      discountAmount: number
      discountType: 'percentage' | 'fixed'
      appliesTo: 'allItems' | 'matchingItems'
      /** DKK subtracted from the cart total, computed for the current cart */
      discountValue: number
      /** _ids of the cart items the discount covers */
      eligibleItemIds: string[]
      label: string
    }
  | { valid: false; message: string }

function evaluateCondition(
  condition: Condition,
  items: ItemForValidation[],
): { met: boolean; message: string } {
  switch (condition._type) {
    case 'condCartContainsAll': {
      const ids = condition.itemIds ?? []
      const missing = ids.filter((id) => !items.some((i) => i.id === id))
      return missing.length === 0
        ? { met: true, message: '' }
        : {
            met: false,
            message: 'Your cart is missing required items for this code',
          }
    }
    case 'condCartContainsAny': {
      const ids = condition.itemIds ?? []
      const hasAny = ids.some((id) => items.some((i) => i.id === id))
      return hasAny
        ? { met: true, message: '' }
        : {
            met: false,
            message: 'Your cart must contain at least one required item',
          }
    }
    case 'condCartSubtotal': {
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      return total >= (condition.minAmount ?? 0)
        ? { met: true, message: '' }
        : {
            met: false,
            message: `Minimum order of ${condition.minAmount} DKK required`,
          }
    }
    case 'condProductCount': {
      const count = items.reduce((sum, i) => sum + i.quantity, 0)
      return count >= (condition.minCount ?? 0)
        ? { met: true, message: '' }
        : {
            met: false,
            message: `Add at least ${condition.minCount} items to use this code`,
          }
    }
    case 'condCategoryCount': {
      const count = items
        .filter(
          (i) =>
            condition.categoryId &&
            i.categoryIds.includes(condition.categoryId),
        )
        .reduce((sum, i) => sum + i.quantity, 0)
      return count >= (condition.minCount ?? 0)
        ? { met: true, message: '' }
        : {
            met: false,
            message: `Add at least ${condition.minCount} items from the required category`,
          }
    }
    case 'condCartContainsOneFromEachGroup': {
      const groups = condition.groups ?? []
      if (groups.length === 0) return { met: true, message: '' }
      const missingGroups = groups.filter((group) => {
        const ids = group.itemIds ?? []
        return !ids.some((id) => items.some((i) => i.id === id))
      })
      return missingGroups.length === 0
        ? { met: true, message: '' }
        : {
            met: false,
            message:
              missingGroups.length === 1
                ? `Your cart is missing an item from the group "${missingGroups[0].label ?? 'required'}"`
                : `Your cart is missing items from ${missingGroups.length} required groups`,
          }
    }
    default:
      return { met: true, message: '' }
  }
}

/**
 * Cart item ids scoped by an item-level condition, or null for cart-level
 * conditions (subtotal, item count, coupon code) that don't single out items.
 */
function itemsMatchingCondition(
  condition: Condition,
  items: ItemForValidation[],
): string[] | null {
  switch (condition._type) {
    case 'condCartContainsAll':
    case 'condCartContainsAny': {
      const ids = condition.itemIds ?? []
      return items.filter((i) => ids.includes(i.id)).map((i) => i.id)
    }
    case 'condCartContainsOneFromEachGroup': {
      const ids = new Set(
        (condition.groups ?? []).flatMap((g) => g.itemIds ?? []),
      )
      return items.filter((i) => ids.has(i.id)).map((i) => i.id)
    }
    case 'condCategoryCount': {
      if (!condition.categoryId) return null
      return items
        .filter((i) => i.categoryIds.includes(condition.categoryId as string))
        .map((i) => i.id)
    }
    default:
      return null
  }
}

export async function validatePromoCode(
  code: string,
  items: ItemForValidation[],
): Promise<PromoValidationResult> {
  if (!code.trim()) return { valid: false, message: 'Enter a promo code' }

  try {
    const doc = await backendClient.fetch<PromoDoc | null>(
      `*[(_type == "promotion" || _type == "sale") && couponCode == $code && isActive == true][0] {
        _id,
        _type,
        discountAmount,
        discountType,
        discountAppliesTo,
        validFrom,
        validTo,
        "conditions": conditions[] -> {
          _type,
          "itemIds": items[]._ref,
          minAmount,
          minCount,
          "categoryId": category._ref,
          "groups": groups[] {
            label,
            "itemIds": items[]._ref
          }
        }
      }`,
      { code },
    )

    if (!doc)
      return {
        valid: false,
        message: 'This code is invalid or inactive',
      }

    const now = new Date()
    if (doc.validFrom && new Date(doc.validFrom) > now) {
      return { valid: false, message: 'This code is not yet valid' }
    }
    if (doc.validTo && new Date(doc.validTo) < now) {
      return { valid: false, message: 'This code has expired' }
    }

    for (const condition of doc.conditions ?? []) {
      const result = evaluateCondition(condition, items)
      if (!result.met) return { valid: false, message: result.message }
    }

    // Determine which items the discount covers
    const appliesTo =
      doc.discountAppliesTo === 'matchingItems' ? 'matchingItems' : 'allItems'

    let eligibleItems = items
    if (appliesTo === 'matchingItems') {
      const matchedIds = new Set<string>()
      let hasItemScopedCondition = false
      for (const condition of doc.conditions ?? []) {
        const ids = itemsMatchingCondition(condition, items)
        if (ids) {
          hasItemScopedCondition = true
          for (const id of ids) matchedIds.add(id)
        }
      }
      // Only cart-level conditions attached → nothing to scope to, keep all items
      if (hasItemScopedCondition) {
        eligibleItems = items.filter((i) => matchedIds.has(i.id))
      }
    }

    const eligibleSubtotal = eligibleItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    )
    const discountType = doc.discountType ?? 'percentage'
    const discountValue =
      discountType === 'fixed'
        ? Math.min(doc.discountAmount, eligibleSubtotal)
        : Math.round(eligibleSubtotal * doc.discountAmount) / 100

    // Checkout uses this pre-synced promotion code for every promotion type.
    // This preserves Stripe redemption limits and product restrictions; the
    // application-specific cart conditions have already been checked above.
    const stripeCodes = await stripe.promotionCodes.list({
      code,
      limit: 1,
    })
    const stripePromo = stripeCodes.data[0]

    if (!stripePromo?.active) {
      return {
        valid: false,
        message:
          'This code is not yet active in our payment system. Please try again shortly.',
      }
    }

    const suffix = appliesTo === 'matchingItems' ? ' selected items' : ''
    const label =
      discountType === 'fixed'
        ? `${doc.discountAmount} DKK off${suffix}`
        : `${doc.discountAmount}% off${suffix}`

    return {
      valid: true,
      stripePromoCodeId: stripePromo.id,
      discountAmount: doc.discountAmount,
      discountType,
      appliesTo,
      discountValue,
      eligibleItemIds: eligibleItems.map((i) => i.id),
      label,
    }
  } catch (error) {
    console.error('Error validating promo code:', error)
    return {
      valid: false,
      message: 'Unable to validate promo code. Please try again or contact us.',
    }
  }
}
