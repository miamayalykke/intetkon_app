import { defineQuery } from 'next-sanity'
import { client } from '../client'
import type { CouponCode } from './couponCodes'

export const getActiveSaleByCouponCode = async (couponCode: CouponCode) => {
  const ACTIVE_SALE_BY_COUPON_QUERY = defineQuery(`
        *[
        _type == "sale"
        && isActive == true
        && couponCode == $couponCode
        ] | order(validFrom desc)[0]
         `)

  try {
    const activeSale = await client.fetch(ACTIVE_SALE_BY_COUPON_QUERY, { couponCode })
    return activeSale ?? null
  } catch (error) {
    console.error('Error fetching active sale by coupon code:', error)
    return null
  }
}
