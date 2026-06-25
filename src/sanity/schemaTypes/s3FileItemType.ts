import { defineField, defineType } from 'sanity'

import { S3FileUpload } from '../components/S3FileUpload'

export const s3FileItemType = defineType({
  name: 's3FileItem',
  title: 'S3 File Item',
  type: 'object',
  fields: [
    defineField({
      name: 'filename',
      title: 'Display Name (optional)',
      description: 'e.g., "Main PDF", "Supplementary Guide"',
      type: 'string',
    }),
    defineField({
      name: 's3Key',
      title: 'S3 File Key',
      type: 'string',
      components: { input: S3FileUpload },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
