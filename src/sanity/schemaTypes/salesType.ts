import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { CouponCodeInput } from '../components/CouponCodeInput'

export const salesType = defineType({
  name: 'sale',
  title: 'Sale',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Sale Title',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Sale Description',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Sale Image',
    }),
    defineField({
      name: 'discountAmount',
      type: 'number',
      title: 'Discount Amount',
      description: 'The discount value — either a percentage (e.g. 20) or a fixed amount in DKK (e.g. 50)',
    }),
    defineField({
      name: 'discountType',
      type: 'string',
      title: 'Discount Type',
      description: 'Percentage or fixed amount in DKK',
      options: {
        list: [
          { title: 'Percentage (%)', value: 'percentage' },
          { title: 'Fixed amount (DKK)', value: 'fixed' },
        ],
        layout: 'radio',
      },
      initialValue: 'percentage',
    }),
    defineField({
      name: 'couponCode',
      type: 'string',
      title: 'Coupon Code',
      description: 'Enter a custom code or click Generate for a random one.',
      components: { input: CouponCodeInput },
    }),
    defineField({
      name: 'maxRedemptions',
      type: 'number',
      title: 'Max Redemptions',
      description: 'Maximum number of times this code can be used. Leave empty for unlimited.',
    }),
    defineField({
      name: 'validFrom',
      type: 'datetime',
      title: 'Valid From',
    }),
    defineField({
      name: 'validTo',
      type: 'datetime',
      title: 'Valid To',
    }),
    defineField({
      name: 'isActive',
      type: 'boolean',
      title: 'Is Active',
      description: 'Toggle to activate/deactivate the sale',
      initialValue: true,
    }),
    defineField({
      name: 'redemptionCount',
      type: 'number',
      title: 'Redemption Count',
      description: 'Automatically incremented each time this code is used at checkout. Do not edit.',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'excludedProducts',
      type: 'array',
      title: 'Excluded Products',
      description: 'Products that will not receive this discount.',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
    defineField({
      name: 'excludedCategories',
      type: 'array',
      title: 'Excluded Categories',
      description: 'All products in these categories will not receive this discount.',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      discountAmount: 'discountAmount',
      discountType: 'discountType',
      couponCode: 'couponCode',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, discountAmount, discountType, couponCode, isActive } = selection
      const status = isActive ? 'Active' : 'Inactive'
      const discountLabel =
        discountType === 'fixed' ? `${discountAmount} kr off` : `${discountAmount}% off`
      return {
        title,
        subtitle: `${discountLabel} - code ${couponCode} - ${status}`,
      }
    },
  },
})
