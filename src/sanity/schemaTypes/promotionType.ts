import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const promotionType = defineType({
  name: 'promotion',
  title: 'Promotion',
  type: 'document',
  icon: TagIcon,
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'conditions', title: 'Conditions' },
    { name: 'action', title: 'Discount Action' },
    { name: 'limits', title: 'Limits & Stacking' },
  ],
  fields: [
    // ─── Identity ────────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'identity',
      description: 'Shown to the customer in the basket (e.g. "Beginner Series Bundle").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Customer-facing description',
      type: 'text',
      group: 'identity',
      description: 'Optional. Shown below the discount badge in the basket.',
      rows: 2,
    }),
    defineField({
      name: 'internalNote',
      title: 'Internal note',
      type: 'text',
      group: 'identity',
      description: 'Admin-only notes. Never shown to customers.',
      rows: 2,
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      group: 'identity',
      initialValue: true,
    }),
    defineField({
      name: 'validFrom',
      title: 'Valid from',
      type: 'datetime',
      group: 'identity',
    }),
    defineField({
      name: 'validTo',
      title: 'Valid to',
      type: 'datetime',
      group: 'identity',
    }),

    // ─── Conditions ──────────────────────────────────────────────────────────
    defineField({
      name: 'conditionLogic',
      title: 'Condition logic',
      type: 'string',
      group: 'conditions',
      options: {
        list: [
          { title: 'ALL conditions must match (AND)', value: 'all' },
          { title: 'ANY condition must match (OR)', value: 'any' },
        ],
        layout: 'radio',
      },
      initialValue: 'all',
      description: 'How multiple conditions are combined. Leave on "ALL" for most use cases.',
    }),
    defineField({
      name: 'conditions',
      title: 'Conditions',
      type: 'array',
      group: 'conditions',
      description:
        'Add one or more conditions. If no conditions are added, the promotion auto-applies to every eligible basket.',
      of: [
        { type: 'cond_cart_contains_all' },
        { type: 'cond_cart_contains_any' },
        { type: 'cond_coupon_code' },
        { type: 'cond_cart_subtotal' },
        { type: 'cond_product_count' },
        { type: 'cond_category_count' },
      ],
    }),

    // ─── Discount Action ─────────────────────────────────────────────────────
    defineField({
      name: 'actionType',
      title: 'Discount type',
      type: 'string',
      group: 'action',
      options: {
        list: [
          { title: 'Percentage off (%)', value: 'percent_off' },
          { title: 'Fixed amount off (DKK)', value: 'fixed_off' },
        ],
        layout: 'radio',
      },
      initialValue: 'percent_off',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'discountPercent',
      title: 'Discount percentage',
      type: 'number',
      group: 'action',
      description: 'e.g. 20 for 20% off.',
      hidden: ({ parent }) => parent?.actionType !== 'percent_off',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'discountAmountDKK',
      title: 'Discount amount (DKK)',
      type: 'number',
      group: 'action',
      description: 'Fixed DKK amount to subtract from the scoped subtotal.',
      hidden: ({ parent }) => parent?.actionType !== 'fixed_off',
      validation: (Rule) => Rule.min(0),
    }),

    // ─── Scope ───────────────────────────────────────────────────────────────
    defineField({
      name: 'scopeMode',
      title: 'Apply discount to',
      type: 'string',
      group: 'action',
      options: {
        list: [
          { title: 'All items (entire cart)', value: 'all' },
          {
            title: 'Include only — apply to listed products/categories only',
            value: 'include_only',
          },
          {
            title: 'Exclude — apply to everything EXCEPT listed products/categories',
            value: 'exclude',
          },
        ],
        layout: 'radio',
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'scopeProducts',
      title: 'Products',
      type: 'array',
      group: 'action',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Used with "Include only" or "Exclude" modes.',
      hidden: ({ parent }) => parent?.scopeMode === 'all',
    }),
    defineField({
      name: 'scopeCategories',
      title: 'Categories',
      type: 'array',
      group: 'action',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      description: 'Used with "Include only" or "Exclude" modes. Applies to all products in the listed categories.',
      hidden: ({ parent }) => parent?.scopeMode === 'all',
    }),

    // ─── Limits & Stacking ───────────────────────────────────────────────────
    defineField({
      name: 'stackable',
      title: 'Stackable',
      type: 'boolean',
      group: 'limits',
      description: 'Allow this promotion to combine with other active promotions.',
      initialValue: false,
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'number',
      group: 'limits',
      description:
        'Higher number = evaluated first. When a non-stackable promotion wins, lower-priority ones are dropped.',
      initialValue: 0,
    }),
    defineField({
      name: 'maxRedemptions',
      title: 'Max total redemptions',
      type: 'number',
      group: 'limits',
      description: 'Global cap across all customers. Leave empty for unlimited.',
    }),
    defineField({
      name: 'redemptionCount',
      title: 'Times redeemed',
      type: 'number',
      group: 'limits',
      description: 'Auto-incremented after each successful checkout. Do not edit.',
      initialValue: 0,
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      actionType: 'actionType',
      discountPercent: 'discountPercent',
      discountAmountDKK: 'discountAmountDKK',
      isActive: 'isActive',
      redemptionCount: 'redemptionCount',
    },
    prepare({ title, actionType, discountPercent, discountAmountDKK, isActive, redemptionCount }) {
      const amount =
        actionType === 'percent_off'
          ? `${discountPercent ?? '?'}% off`
          : `${discountAmountDKK ?? '?'} kr off`
      const status = isActive ? 'Active' : 'Inactive'
      return {
        title,
        subtitle: `${amount} — ${status} — ${redemptionCount ?? 0} redemptions`,
      }
    },
  },
})
