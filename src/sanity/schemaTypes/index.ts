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
import { postType } from './postType'
import {
  privateEventAddonType,
  privateEventRequestType,
  privateEventSlotType,
} from './privateEventTypes'
import { productType } from './productType'
import {
  condCartContainsAll,
  condCartContainsAny,
  condCartContainsOneFromEachGroup,
  condCartSubtotal,
  condCategoryCount,
  condCouponCode,
  condProductCount,
} from './promoConditions'
import { promotionRedemptionType } from './promotionRedemptionType'
import { promotionType } from './promotionType'
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
    postType,
    salesType,
    workshopType,
    privateEventSlotType,
    privateEventAddonType,
    privateEventRequestType,
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
