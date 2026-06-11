import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const promotionType = defineType({
  name: 'promotion',
  title: 'Promotion',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'couponCode',
      title: 'Coupon Code',
      type: 'string',
    }),
    defineField({
      name: 'discountAmount',
      title: 'Discount Amount',
      type: 'number',
      validation: (R) => R.min(0),
    }),
    defineField({
      name: 'discountType',
      title: 'Discount Type',
      type: 'string',
      options: {
        list: [
          { title: 'Percentage (%)', value: 'percentage' },
          { title: 'Fixed amount (DKK)', value: 'fixed' },
        ],
        layout: 'radio',
      },
      initialValue: 'percentage',
    }),
    defineField({ name: 'validFrom', title: 'Valid From', type: 'datetime' }),
    defineField({ name: 'validTo', title: 'Valid To', type: 'datetime' }),
    defineField({
      name: 'maxRedemptions',
      title: 'Max Redemptions',
      type: 'number',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'discountAppliesTo',
      title: 'Discount Applies To',
      description:
        'Choose whether discount applies only to items matching the condition, or all items if condition is met',
      type: 'string',
      options: {
        list: [
          { title: 'All Items (if conditions met)', value: 'allItems' },
          { title: 'Only Matching Items', value: 'matchingItems' },
        ],
        layout: 'radio',
      },
      initialValue: 'allItems',
    }),
    defineField({
      name: 'conditions',
      title: 'Conditions',
      description: 'All conditions must be met for the promotion to apply',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            { type: 'condCouponCode' },
            { type: 'condCartSubtotal' },
            { type: 'condProductCount' },
            { type: 'condCategoryCount' },
            { type: 'condCartContainsAll' },
            { type: 'condCartContainsAny' },
            { type: 'condCartContainsOneFromEachGroup' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      couponCode: 'couponCode',
      isActive: 'isActive',
    },
    prepare({ title, couponCode, isActive }) {
      return {
        title,
        subtitle: `${couponCode ?? 'No code'} · ${isActive ? 'Active' : 'Inactive'}`,
      }
    },
  },
})
