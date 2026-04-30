'use server'

import { client } from '@sanity/lib/client'
import { defineQuery } from 'next-sanity'

export type CouponValidation = {
  saleId: string
  title: string
  couponCode: string
  discountAmount: number
  discountType: 'percentage' | 'fixed'
  excludedProductIds: string[]
  excludedCategoryIds: string[]
}

const ACTIVE_SALE_QUERY = defineQuery(`
  *[
    _type == "sale"
    && isActive == true
    && couponCode == $couponCode
    && (validFrom == null || validFrom <= $now)
    && (validTo == null || validTo >= $now)
  ] | order(validFrom desc)[0] {
    _id,
    title,
    couponCode,
    discountAmount,
    discountType,
    maxRedemptions,
    redemptionCount,
    "excludedProductIds": excludedProducts[]->_id,
    "excludedCategoryIds": excludedCategories[]->_id,
  }
`)

export async function validateCouponCode(couponCode: string): Promise<CouponValidation | null> {
  if (!couponCode.trim()) return null

  try {
    const now = new Date().toISOString()
    const sale = await client.fetch(
      ACTIVE_SALE_QUERY,
      { couponCode: couponCode.trim(), now },
      { cache: 'no-store' },
    )

    if (!sale || sale.discountAmount === null || sale.discountAmount === undefined) {
      return null
    }

    // Enforce max redemptions locally (Stripe also enforces at payment time)
    if (
      sale.maxRedemptions != null &&
      (sale.redemptionCount ?? 0) >= sale.maxRedemptions
    ) {
      return null
    }

    return {
      saleId: sale._id,
      title: sale.title ?? '',
      couponCode: sale.couponCode ?? couponCode,
      discountAmount: sale.discountAmount,
      discountType: sale.discountType === 'fixed' ? 'fixed' : 'percentage',
      excludedProductIds: (sale.excludedProductIds ?? []).filter(Boolean) as string[],
      excludedCategoryIds: (sale.excludedCategoryIds ?? []).filter(Boolean) as string[],
    }
  } catch (error) {
    console.error('[validateCouponCode] Error fetching sale', error)
    return null
  }
}
