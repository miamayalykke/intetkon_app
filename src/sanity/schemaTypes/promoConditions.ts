import { defineField, defineType } from 'sanity'

// cond_cart_contains_all
// ALL listed products must be present in the basket. Used to trigger bundle discounts.
export const condCartContainsAll = defineType({
  name: 'cond_cart_contains_all',
  title: 'Cart contains ALL of these products',
  type: 'object',
  fields: [
    defineField({
      name: 'products',
      title: 'Required Products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Every product listed here must be in the basket for this condition to pass.',
      validation: (Rule) => Rule.required().min(2),
    }),
  ],
  preview: {
    select: {
      p0: 'products.0.name',
      p1: 'products.1.name',
      p2: 'products.2.name',
    },
    prepare({ p0, p1, p2 }) {
      const names = [p0, p1, p2].filter(Boolean)
      const label = names.length ? names.join(', ') + (names.length < 3 ? '' : '…') : '(no products)'
      return { title: 'Contains ALL', subtitle: label }
    },
  },
})

// cond_cart_contains_any
// At least minQuantity of the listed products must appear in the basket.
export const condCartContainsAny = defineType({
  name: 'cond_cart_contains_any',
  title: 'Cart contains ANY of these products',
  type: 'object',
  fields: [
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'minQuantity',
      title: 'Minimum matching products',
      type: 'number',
      description: 'How many of the listed products must be present. Default: 1.',
      initialValue: 1,
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { p0: 'products.0.name', minQuantity: 'minQuantity' },
    prepare({ p0, minQuantity }) {
      return { title: `Contains ANY (min ${minQuantity ?? 1})`, subtitle: p0 ?? '' }
    },
  },
})

// cond_coupon_code
// A specific code must be entered by the customer. Supports global and per-customer usage caps.
export const condCouponCode = defineType({
  name: 'cond_coupon_code',
  title: 'Coupon code required',
  type: 'object',
  fields: [
    defineField({
      name: 'code',
      title: 'Code',
      type: 'string',
      description: 'The code customers must enter (case-insensitive). E.g. WELCOME10',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'maxUsesGlobal',
      title: 'Max total uses',
      type: 'number',
      description: 'Maximum times this code can be redeemed across all customers. Leave empty for unlimited.',
    }),
    defineField({
      name: 'maxUsesPerCustomer',
      title: 'Max uses per customer',
      type: 'number',
      description: 'Set to 1 for a one-time-per-person code. Leave empty for unlimited.',
    }),
    defineField({
      name: 'usedCount',
      title: 'Times used',
      type: 'number',
      description: 'Auto-incremented after each successful checkout. Do not edit.',
      initialValue: 0,
      readOnly: true,
    }),
  ],
  preview: {
    select: { code: 'code', usedCount: 'usedCount', maxUsesGlobal: 'maxUsesGlobal' },
    prepare({ code, usedCount, maxUsesGlobal }) {
      const limit = maxUsesGlobal != null ? `/${maxUsesGlobal}` : ''
      return { title: `Code: ${code ?? '—'}`, subtitle: `Used ${usedCount ?? 0}${limit} times` }
    },
  },
})

// cond_cart_subtotal
// The basket total (before discounts) must satisfy an amount threshold.
export const condCartSubtotal = defineType({
  name: 'cond_cart_subtotal',
  title: 'Cart subtotal threshold',
  type: 'object',
  fields: [
    defineField({
      name: 'operator',
      title: 'Operator',
      type: 'string',
      options: {
        list: [
          { title: 'At least (≥)', value: 'gte' },
          { title: 'At most (≤)', value: 'lte' },
        ],
        layout: 'radio',
      },
      initialValue: 'gte',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'amount',
      title: 'Amount (DKK)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
  preview: {
    select: { operator: 'operator', amount: 'amount' },
    prepare({ operator, amount }) {
      const op = operator === 'gte' ? '≥' : '≤'
      return { title: `Subtotal ${op} ${amount ?? '?'} DKK` }
    },
  },
})

// cond_product_count
// The basket must have a certain number of distinct products or total quantity of items.
export const condProductCount = defineType({
  name: 'cond_product_count',
  title: 'Product count',
  type: 'object',
  fields: [
    defineField({
      name: 'countType',
      title: 'Count type',
      type: 'string',
      options: {
        list: [
          { title: 'Distinct products (number of unique items)', value: 'distinct_products' },
          { title: 'Total quantity (sum of all quantities)', value: 'total_quantity' },
        ],
        layout: 'radio',
      },
      initialValue: 'distinct_products',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'operator',
      title: 'Operator',
      type: 'string',
      options: {
        list: [
          { title: 'At least (≥)', value: 'gte' },
          { title: 'Exactly (=)', value: 'eq' },
          { title: 'At most (≤)', value: 'lte' },
        ],
        layout: 'radio',
      },
      initialValue: 'gte',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'count',
      title: 'Count',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { countType: 'countType', operator: 'operator', count: 'count' },
    prepare({ countType, operator, count }) {
      const opLabel = operator === 'gte' ? '≥' : operator === 'eq' ? '=' : '≤'
      const typeLabel = countType === 'distinct_products' ? 'distinct products' : 'total qty'
      return { title: `${typeLabel} ${opLabel} ${count ?? '?'}` }
    },
  },
})

// cond_category_count
// The basket must contain at least N products from a specific category.
export const condCategoryCount = defineType({
  name: 'cond_category_count',
  title: 'Products from a category',
  type: 'object',
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'minCount',
      title: 'Minimum products from this category',
      type: 'number',
      initialValue: 1,
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { category: 'category.title', minCount: 'minCount' },
    prepare({ category, minCount }) {
      return { title: `≥ ${minCount ?? 1} from "${category ?? '—'}"` }
    },
  },
})
