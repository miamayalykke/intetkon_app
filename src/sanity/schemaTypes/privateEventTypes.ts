import { CalendarIcon, EnvelopeIcon, TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const privateEventSlotType = defineType({
  name: 'privateEventSlot',
  title: 'Private Event Slot',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'date',
      title: 'Start Date & Time',
      type: 'datetime',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date & Time',
      type: 'datetime',
    }),
    defineField({
      name: 'minGroupSize',
      title: 'Minimum Group Size',
      type: 'number',
      initialValue: 4,
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'maxGroupSize',
      title: 'Maximum Group Size',
      type: 'number',
      initialValue: 6,
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'pricingMode',
      title: 'Pricing Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Per Person', value: 'perPerson' },
          { title: 'Total (flat price for the whole group)', value: 'total' },
        ],
        layout: 'radio',
      },
      initialValue: 'perPerson',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (DKK)',
      description:
        'Per person, or a flat total for the whole group — depending on Pricing Mode above. Add-ons are always charged per person on top of this.',
      type: 'number',
      initialValue: 795,
      validation: (R) => R.required().min(0),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Booked', value: 'booked' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'available',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'booking',
      title: 'Booking Details',
      description: 'Filled automatically when a customer completes payment',
      type: 'object',
      fields: [
        defineField({ name: 'customerName', title: 'Name', type: 'string' }),
        defineField({ name: 'customerEmail', title: 'Email', type: 'string' }),
        defineField({ name: 'groupSize', title: 'Group Size', type: 'number' }),
        defineField({ name: 'occasion', title: 'Occasion', type: 'string' }),
        defineField({
          name: 'projectWish',
          title: 'Project Wish',
          type: 'text',
        }),
        defineField({
          name: 'addonsSummary',
          title: 'Add-ons',
          type: 'string',
        }),
        defineField({
          name: 'orderNumber',
          title: 'Order Number',
          type: 'string',
        }),
        defineField({ name: 'bookedAt', title: 'Booked At', type: 'datetime' }),
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      date: 'date',
      status: 'status',
      customerName: 'booking.customerName',
      price: 'price',
      pricingMode: 'pricingMode',
    },
    prepare({ date, status, customerName, price, pricingMode }) {
      const dateStr = date
        ? new Date(date).toLocaleString('da-DK', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })
        : 'No date'
      const priceStr =
        price != null
          ? `${price} DKK${pricingMode === 'total' ? ' total' : '/person'}`
          : ''
      return {
        title: dateStr,
        subtitle: `${status ?? 'available'} · ${priceStr}${customerName ? ` · ${customerName}` : ''}`,
      }
    },
  },
})

export const privateEventAddonType = defineType({
  name: 'privateEventAddon',
  title: 'Private Event Add-on',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price Per Person (DKK)',
      description:
        'Add-ons are always charged per person (price × group size), on top of the event price.',
      type: 'number',
      validation: (R) => R.required().min(0),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'title.0.value', price: 'price', active: 'active' },
    prepare({ title, price, active }) {
      return {
        title: title ?? 'Add-on',
        subtitle: `${price ?? 0} DKK${active ? '' : ' · inactive'}`,
      }
    },
  },
})

export const privateEventRequestType = defineType({
  name: 'privateEventRequest',
  title: 'Private Event Request',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({
      name: 'preferredDates',
      title: 'Preferred Dates',
      type: 'string',
    }),
    defineField({ name: 'groupSize', title: 'Group Size', type: 'number' }),
    defineField({ name: 'occasion', title: 'Occasion', type: 'string' }),
    defineField({ name: 'message', title: 'Message', type: 'text' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Handled', value: 'handled' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      preferredDates: 'preferredDates',
      status: 'status',
    },
    prepare({ name, preferredDates, status }) {
      return {
        title: name ?? 'Request',
        subtitle: `${preferredDates ?? ''}${status === 'new' ? ' · NEW' : ''}`,
      }
    },
  },
})
