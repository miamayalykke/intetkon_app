import type { SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import {
  internationalizedArrayBlockContent,
  internationalizedArraySlug,
  internationalizedArrayString,
  internationalizedArrayText,
} from './internationalizedTypes'
import { orderType } from './orderType'
import { productType } from './productType'
import { promotionRedemptionType } from './promotionRedemptionType'
import { promotionType } from './promotionType'
import {
  condCartContainsAll,
  condCartContainsAny,
  condCartContainsOneFromEachGroup,
  condCartSubtotal,
  condCategoryCount,
  condCouponCode,
  condProductCount,
} from './promoConditions'
import { s3FileItemType } from './s3FileItemType'
import { salesType } from './salesType'
import { workshopType } from './workshopType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    internationalizedArrayBlockContent,
    internationalizedArraySlug,
    internationalizedArrayString,
    internationalizedArrayText,
    productType,
    categoryType,
    orderType,
    salesType,
    workshopType,
    s3FileItemType,
    // Promotion engine
    promotionType,
    promotionRedemptionType,
    condCartContainsAll,
    condCartContainsAny,
    condCartContainsOneFromEachGroup,
    condCouponCode,
    condCartSubtotal,
    condProductCount,
    condCategoryCount,
  ],
}
