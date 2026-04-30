import { ShoppingCartIcon } from 'lucide-react'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const orderType = defineType({
  name: 'order',
  title: 'Orders',
  type: 'document',
  icon: ShoppingCartIcon,
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stripeCheckoutSessionId',
      title: 'Stripe Checkout Session ID',
      type: 'string',
    }),
    defineField({
      name: 'stripeCustomerId',
      title: 'Stripe Customer ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clerkUserId',
      title: 'Store User ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Customer Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'stripePaymentIntentId',
      title: 'Stripe Payment Intent ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'workshopBookings',
      title: 'Workshop Bookings',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'workshop',
              title: 'Workshop',
              type: 'reference',
              to: [{ type: 'workshop' }],
            }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'date', title: 'Date', type: 'datetime' }),
            defineField({ name: 'location', title: 'Location', type: 'string' }),
            defineField({ name: 'duration', title: 'Duration', type: 'string' }),
            defineField({ name: 'price', title: 'Price', type: 'number' }),
          ],
          preview: {
            select: { title: 'title', date: 'date' },
            prepare({ title, date }) {
              return {
                title: title ?? 'Workshop',
                subtitle: date ? new Date(date).toLocaleDateString('da-DK') : '',
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'product',
              title: 'Product Bought',
              type: 'reference',
              to: [{ type: 'product' }],
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
            }),
          ],
          preview: {
            select: {
              product: 'product.name',
              quantity: 'quantity',
              image: 'product.image',
              price: 'product.price',
              currency: 'product.currency',
            },
            prepare(select) {
              return {
                title: `${select.product} x ${select.quantity}`,
                subtitle: `${select.price * select.quantity}`,
                media: select.image,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'totalPrice',
      title: 'Total Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'amountDiscount',
      title: 'Amount Discount',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
    }),
    defineField({
      name: 'orderDate',
      title: 'Order Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      name: 'customerName',
      amount: 'totalPrice',
      currency: 'currency',
      orderId: 'orderNumber',
      email: 'email',
    },
    prepare(select) {
      const orderIdSnippet = `${select.orderId.toString().slice(0, 5)}...${select.orderId.toString().slice(-5)}`
      return {
        title: `${select.name} (${orderIdSnippet})`,
        subtitle: `${select.amount} ${select.currency}, ${select.email}`,
        media: ShoppingCartIcon,
      }
    },
  },
})
