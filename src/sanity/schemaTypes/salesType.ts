import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

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
      name: 'discountAmount',
      type: 'number',
      title: 'Discount Amount',
      description: 'The amount to discount — percentage (e.g. 20 = 20%) or fixed DKK value depending on Discount Type',
    }),
    defineField({
      name: 'discountType',
      type: 'string',
      title: 'Discount Type',
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
    }),
    defineField({
      name: 'maxRedemptions',
      type: 'number',
      title: 'Max Redemptions',
      description: 'Leave blank for unlimited uses',
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
      name: 'excludedProducts',
      type: 'array',
      title: 'Excluded Products',
      description: 'Products this coupon cannot be used for',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
    defineField({
      name: 'excludedCategories',
      type: 'array',
      title: 'Excluded Categories',
      description: 'Categories this coupon cannot be used for',
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
      const suffix = discountType === 'fixed' ? ' DKK' : '%'
      return {
        title,
        subtitle: `${discountAmount}${suffix} off — code: ${couponCode} — ${status}`,
      }
    },
  },
})
