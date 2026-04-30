import { defineField, defineType } from 'sanity'

// Lightweight document created after each checkout that applied a promotion.
// Used to enforce per-customer redemption limits in evaluatePromotions.ts.
// Not exposed in the Studio navigation — query-only.
export const promotionRedemptionType = defineType({
  name: 'promotionRedemption',
  title: 'Promotion Redemption',
  type: 'document',
  fields: [
    defineField({
      name: 'promotionId',
      title: 'Promotion ID',
      type: 'string',
      description: 'Sanity _id of the promotion document.',
      readOnly: true,
    }),
    defineField({
      name: 'customerId',
      title: 'Customer ID',
      type: 'string',
      description: 'Clerk user ID.',
      readOnly: true,
    }),
    defineField({
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
      description: 'Sanity _id of the order document.',
      readOnly: true,
    }),
    defineField({
      name: 'redeemedAt',
      title: 'Redeemed at',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      promotionId: 'promotionId',
      customerId: 'customerId',
      redeemedAt: 'redeemedAt',
    },
    prepare({ promotionId, customerId, redeemedAt }) {
      return {
        title: `Promotion: ${promotionId ?? '—'}`,
        subtitle: `Customer: ${customerId ?? '—'} · ${redeemedAt ? new Date(redeemedAt).toLocaleDateString() : ''}`,
      }
    },
  },
})
