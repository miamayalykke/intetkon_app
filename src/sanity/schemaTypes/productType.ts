import { PackageIcon } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'internationalizedArraySlug',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayBlockContent',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'sortWeight',
      title: 'Featured Rank',
      description:
        'Higher numbers appear first under the "Featured" sort. Leave empty for default ordering.',
      type: 'number',
    }),
    defineField({
      name: 'salesCount',
      title: 'Sales Count',
      description:
        'Number of times this product has sold. Used for the "Most Popular" sort. Usually updated automatically.',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      hidden: ({ document }) => document?.productType === 'digital',
    }),
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      options: {
        list: [
          { title: 'Digital (PDF / file)', value: 'digital' },
          { title: 'Physical Item', value: 'physical' },
        ],
        layout: 'radio',
      },
      initialValue: 'digital',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'itemCategory',
      title: 'Item Category',
      type: 'string',
      options: {
        list: [
          { title: 'Baby', value: 'baby' },
          { title: 'Toddler', value: 'toddler' },
          { title: 'Kids', value: 'kids' },
          { title: 'Adult', value: 'adult' },
          { title: 'Hats', value: 'hats' },
        ],
        layout: 'radio',
      },
      hidden: ({ document }) => document?.productType !== 'physical',
      validation: (Rule) =>
        Rule.custom((value: any, context: any) => {
          if (context.document?.productType !== 'physical') return true
          if (!value) return 'Item Category is required for physical products'
          return true
        }),
    }),
    defineField({
      name: 'sizesAdult',
      title: 'Available Sizes',
      description: 'Select which sizes are available for this product',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'XS', value: 'XS' },
          { title: 'S', value: 'S' },
          { title: 'M', value: 'M' },
          { title: 'L', value: 'L' },
          { title: 'XL', value: 'XL' },
        ],
        layout: 'grid',
      },
      hidden: ({ document }) =>
        document?.productType !== 'physical' ||
        document?.itemCategory !== 'adult',
      validation: (Rule) =>
        Rule.custom((value: any, context: any) => {
          if (
            context.document?.productType !== 'physical' ||
            context.document?.itemCategory !== 'adult'
          )
            return true
          if (!value || value.length === 0) {
            return 'At least one size must be selected'
          }
          return true
        }),
    }),
    defineField({
      name: 'sizesKids',
      title: 'Available Sizes',
      description: 'Select which sizes are available for this product',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '2-4', value: '2-4' },
          { title: '4-6', value: '4-6' },
          { title: '6-8', value: '6-8' },
          { title: '8-10', value: '8-10' },
          { title: '10-12', value: '10-12' },
        ],
        layout: 'grid',
      },
      hidden: ({ document }) =>
        document?.productType !== 'physical' ||
        document?.itemCategory !== 'kids',
      validation: (Rule) =>
        Rule.custom((value: any, context: any) => {
          if (
            context.document?.productType !== 'physical' ||
            context.document?.itemCategory !== 'kids'
          )
            return true
          if (!value || value.length === 0) {
            return 'At least one size must be selected'
          }
          return true
        }),
    }),
    defineField({
      name: 'sizesToddler',
      title: 'Available Sizes',
      description: 'Select which sizes are available for this product',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '0-6M', value: '0-6M' },
          { title: '6-12M', value: '6-12M' },
          { title: '12-18M', value: '12-18M' },
          { title: '18-24M', value: '18-24M' },
        ],
        layout: 'grid',
      },
      hidden: ({ document }) =>
        document?.productType !== 'physical' ||
        document?.itemCategory !== 'toddler',
      validation: (Rule) =>
        Rule.custom((value: any, context: any) => {
          if (
            context.document?.productType !== 'physical' ||
            context.document?.itemCategory !== 'toddler'
          )
            return true
          if (!value || value.length === 0) {
            return 'At least one size must be selected'
          }
          return true
        }),
    }),
    defineField({
      name: 'sizesBaby',
      title: 'Available Sizes',
      description: 'Select which sizes are available for this product',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Newborn', value: 'newborn' },
          { title: '0-3M', value: '0-3M' },
          { title: '3-6M', value: '3-6M' },
          { title: '6-9M', value: '6-9M' },
        ],
        layout: 'grid',
      },
      hidden: ({ document }) =>
        document?.productType !== 'physical' ||
        document?.itemCategory !== 'baby',
      validation: (Rule) =>
        Rule.custom((value: any, context: any) => {
          if (
            context.document?.productType !== 'physical' ||
            context.document?.itemCategory !== 'baby'
          )
            return true
          if (!value || value.length === 0) {
            return 'At least one size must be selected'
          }
          return true
        }),
    }),
    defineField({
      name: 'sizesHats',
      title: 'Available Sizes',
      description: 'Select which sizes are available for this product',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [{ title: 'One Size', value: 'one-size' }],
        layout: 'grid',
      },
      hidden: ({ document }) =>
        document?.productType !== 'physical' ||
        document?.itemCategory !== 'hats',
      validation: (Rule) =>
        Rule.custom((value: any, context: any) => {
          if (
            context.document?.productType !== 'physical' ||
            context.document?.itemCategory !== 'hats'
          )
            return true
          if (!value || value.length === 0) {
            return 'At least one size must be selected'
          }
          return true
        }),
    }),
    defineField({
      name: 's3KeyEn',
      title: 'S3 Files (English)',
      description:
        'Add multiple S3 file keys for the English downloadable files (digital products only)',
      type: 'array',
      of: [{ type: 's3FileItem' }],
      hidden: ({ document }) => document?.productType !== 'digital',
      validation: (Rule) =>
        Rule.custom((value: any, context: any) => {
          const productType = context.document?.productType
          if (productType !== 'digital') return true
          if (!value || value.length === 0) {
            return 'At least one English S3 file is required for digital products'
          }
          return true
        }),
    }),
    defineField({
      name: 's3KeyDa',
      title: 'S3 Files (Danish)',
      description:
        'Add multiple S3 file keys for the Danish downloadable files. Falls back to the English files if not set.',
      type: 'array',
      of: [{ type: 's3FileItem' }],
      hidden: ({ document }) => document?.productType !== 'digital',
      validation: (Rule) =>
        Rule.custom((value: any, context: any) => {
          const productType = context.document?.productType
          if (productType !== 'digital') return true
          if (!value || value.length === 0) {
            return 'At least one Danish S3 file is required for digital products'
          }
          return true
        }),
    }),
    defineField({
      name: 'courseDate',
      title: 'Course Date',
      type: 'datetime',
      hidden: ({ document }) => document?.productType !== 'physical_course',
    }),
    defineField({
      name: 'courseLocation',
      title: 'Course Location',
      description: 'Physical address or online link',
      type: 'string',
      hidden: ({ document }) => document?.productType !== 'physical_course',
    }),
    defineField({
      name: 'stripeProductId',
      title: 'Stripe Product ID',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      title: 'name.0.value',
      media: 'image',
      price: 'price',
    },
    prepare(select) {
      return {
        title: select.title,
        subtitle: `${select.price} DKK`,
        media: select.media,
      }
    },
  },
})
