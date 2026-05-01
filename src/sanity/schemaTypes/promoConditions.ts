import { defineField, defineType } from 'sanity'

export const condCouponCode = defineType({
  name: 'condCouponCode',
  title: 'Condition: Coupon Code',
  type: 'document',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({
      name: 'code',
      title: 'Required Code',
      type: 'string',
      validation: (R) => R.required(),
    }),
  ],
  preview: {
    select: { code: 'code' },
    prepare({ code }) {
      return { title: `Code: ${code}` }
    },
  },
})

export const condCartSubtotal = defineType({
  name: 'condCartSubtotal',
  title: 'Condition: Cart Subtotal',
  type: 'document',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({
      name: 'minAmount',
      title: 'Minimum Amount (DKK)',
      type: 'number',
      validation: (R) => R.required().min(0),
    }),
  ],
  preview: {
    select: { minAmount: 'minAmount' },
    prepare({ minAmount }) {
      return { title: `Min subtotal: ${minAmount} DKK` }
    },
  },
})

export const condProductCount = defineType({
  name: 'condProductCount',
  title: 'Condition: Product Count',
  type: 'document',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({
      name: 'minCount',
      title: 'Minimum Item Count',
      type: 'number',
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { minCount: 'minCount' },
    prepare({ minCount }) {
      return { title: `Min items: ${minCount}` }
    },
  },
})

export const condCategoryCount = defineType({
  name: 'condCategoryCount',
  title: 'Condition: Category Count',
  type: 'document',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'minCount',
      title: 'Minimum Count',
      type: 'number',
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { category: 'category.title', minCount: 'minCount' },
    prepare({ category, minCount }) {
      return { title: `Category "${category}" × ${minCount}` }
    },
  },
})

export const condCartContainsAll = defineType({
  name: 'condCartContainsAll',
  title: 'Condition: Cart Contains All',
  type: 'document',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Required Items (all must be in cart)',
      description: 'Can be products or workshops',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }, { type: 'workshop' }] }],
    }),
  ],
  preview: {
    select: { label: 'label' },
    prepare({ label }) {
      return { title: label ?? 'Cart contains all' }
    },
  },
})

export const condCartContainsOneFromEachGroup = defineType({
  name: 'condCartContainsOneFromEachGroup',
  title: 'Condition: One From Each Course Group',
  type: 'document',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({
      name: 'groups',
      title: 'Course Groups',
      description:
        'The cart must contain at least one item from every group. Use this when the same course runs on multiple dates and any date counts.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'courseGroup',
          title: 'Course Group',
          fields: [
            defineField({
              name: 'label',
              title: 'Group Label',
              description: 'e.g. "Beginner 1"',
              type: 'string',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'items',
              title: 'Items in this group (any date / instance)',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'product' }, { type: 'workshop' }] }],
            }),
          ],
          preview: {
            select: { label: 'label' },
            prepare({ label }) {
              return { title: label ?? 'Group' }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { label: 'label' },
    prepare({ label }) {
      return { title: label ?? 'One from each group' }
    },
  },
})

export const condCartContainsAny = defineType({
  name: 'condCartContainsAny',
  title: 'Condition: Cart Contains Any',
  type: 'document',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Items (any one must be in cart)',
      description: 'Can be products or workshops',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }, { type: 'workshop' }] }],
    }),
  ],
  preview: {
    select: { label: 'label' },
    prepare({ label }) {
      return { title: label ?? 'Cart contains any' }
    },
  },
})
