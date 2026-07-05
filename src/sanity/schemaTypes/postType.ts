import { DocumentTextIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'internationalizedArraySlug',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description:
        'Short summary shown on the blog list and used as the meta description in Google — keep it under ~155 characters',
      type: 'internationalizedArrayText',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alternative Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      description:
        'The post is hidden until this date — set a future date to schedule it',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'internationalizedArrayBlockContent',
      validation: (R) => R.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title.0.value',
      media: 'mainImage',
      publishedAt: 'publishedAt',
    },
    prepare({ title, media, publishedAt }) {
      return {
        title: title ?? 'Untitled',
        subtitle: publishedAt
          ? new Date(publishedAt).toLocaleDateString('da-DK')
          : 'Draft',
        media,
      }
    },
  },
})
