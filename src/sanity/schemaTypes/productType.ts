import { PackageIcon } from 'lucide-react'
import { defineField, defineType } from 'sanity'
import { S3FileUpload } from '../components/S3FileUpload'

export const productType = defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Product image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
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
          { title: 'Physical Course', value: 'physical_course' },
          { title: 'Physical Item', value: 'physical' },
        ],
        layout: 'radio',
      },
      initialValue: 'digital',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sizes',
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
      hidden: ({ document }) => document?.productType !== 'physical',
    }),
    defineField({
      name: 's3Key',
      title: 'S3 File Key',
      description: 'The S3 object key for the downloadable file (digital products only)',
      type: 'string',
      components: { input: S3FileUpload },
      hidden: ({ document }) => document?.productType !== 'digital',
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
      title: 'name',
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
