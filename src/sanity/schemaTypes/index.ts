import type { SchemaTypeDefinition } from 'sanity'
import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { orderType } from './orderType'
import {
  condCartContainsAll,
  condCartContainsAny,
  condCartSubtotal,
  condCategoryCount,
  condCouponCode,
  condProductCount,
} from './promoConditions'
import { productType } from './productType'
import { promotionRedemptionType } from './promotionRedemptionType'
import { promotionType } from './promotionType'
import { salesType } from './salesType'
import { workshopType } from './workshopType'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    productType,
    categoryType,
    orderType,
    salesType, // kept for historical data — no new documents
    workshopType,
    // Promotion engine
    promotionType,
    promotionRedemptionType,
    condCartContainsAll,
    condCartContainsAny,
    condCouponCode,
    condCartSubtotal,
    condProductCount,
    condCategoryCount,
  ],
}
