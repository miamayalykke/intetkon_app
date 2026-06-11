import { TagIcon } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Categories',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'internationalizedArraySlug',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'internationalizedArrayText',
    }),
  ],
  preview: {
    select: {
      title: 'title.0.value',
      subtitle: 'description.0.value',
    },
  },
})
