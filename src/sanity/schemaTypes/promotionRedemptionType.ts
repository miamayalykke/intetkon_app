import { defineField, defineType } from 'sanity'

export const promotionRedemptionType = defineType({
  name: 'promotionRedemption',
  title: 'Promotion Redemption',
  type: 'document',
  fields: [
    defineField({
      name: 'promotion',
      title: 'Promotion',
      type: 'reference',
      to: [{ type: 'promotion' }],
      validation: (R) => R.required(),
    }),
    defineField({ name: 'orderId', title: 'Order ID', type: 'string' }),
    defineField({ name: 'clerkUserId', title: 'User ID', type: 'string' }),
    defineField({ name: 'customerEmail', title: 'Customer Email', type: 'string' }),
    defineField({
      name: 'redeemedAt',
      title: 'Redeemed At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      promotion: 'promotion.title',
      customerEmail: 'customerEmail',
      redeemedAt: 'redeemedAt',
    },
    prepare({ promotion, customerEmail, redeemedAt }) {
      return {
        title: promotion ?? 'Unknown Promotion',
        subtitle: `${customerEmail ?? ''} · ${redeemedAt ? new Date(redeemedAt).toLocaleDateString('da-DK') : ''}`,
      }
    },
  },
})
