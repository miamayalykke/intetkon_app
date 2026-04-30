'use server'

import { type AppliedPromotion, type CartContext, evaluatePromotions } from './evaluatePromotions'

export type PromoCodeResult =
  | { ok: true; appliedPromotions: AppliedPromotion[] }
  | { ok: false; error: string }

/**
 * Validates a customer-entered coupon code against all active promotions.
 *
 * Calls the full pricing engine with the entered code and checks whether
 * any code-gated promotion (`cond_coupon_code`) matched. Auto-apply promotions
 * are included in the result too (so the basket gets the full picture).
 *
 * Returns an error message when the code does not match any active promotion
 * or when usage limits have been reached.
 */
export async function applyPromoCode(
  code: string,
  cart: CartContext,
): Promise<PromoCodeResult> {
  const trimmedCode = code.trim()
  if (!trimmedCode) {
    return { ok: false, error: 'Please enter a coupon code.' }
  }

  try {
    const appliedPromotions = await evaluatePromotions({
      ...cart,
      enteredCouponCode: trimmedCode,
    })

    // Check whether the code actually matched a code-gated promotion.
    // The engine only returns promotions whose conditions fully passed,
    // so if no promo has this couponCode it means the code is invalid or exhausted.
    const codeMatched = appliedPromotions.some(
      (p) => p.couponCode?.toUpperCase() === trimmedCode.toUpperCase(),
    )

    if (!codeMatched) {
      return { ok: false, error: 'Invalid or expired coupon code.' }
    }

    return { ok: true, appliedPromotions }
  } catch (error) {
    console.error('[applyPromoCode] Error', error)
    return { ok: false, error: 'Could not apply coupon. Please try again.' }
  }
}
