import { defineField, defineType } from 'sanity'

const localizationObject = {
  type: 'object' as const,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'Dansk', value: 'da' },
        ],
      },
      initialValue: 'en',
    }),
  ],
}

export const internationalizedArrayString = defineType({
  name: 'internationalizedArrayString',
  type: 'array',
  of: [
    {
      ...localizationObject,
      fields: [
        ...localizationObject.fields,
        defineField({
          name: 'value',
          type: 'string',
        }),
      ],
    } as any,
  ],
  initialValue: [
    {
      language: 'en',
      value: '',
    },
  ],
})

export const internationalizedArrayText = defineType({
  name: 'internationalizedArrayText',
  type: 'array',
  of: [
    {
      ...localizationObject,
      fields: [
        ...localizationObject.fields,
        defineField({
          name: 'value',
          type: 'text',
        }),
      ],
    } as any,
  ],
  initialValue: [
    {
      language: 'en',
      value: '',
    },
  ],
})

export const internationalizedArraySlug = defineType({
  name: 'internationalizedArraySlug',
  type: 'array',
  of: [
    {
      ...localizationObject,
      fields: [
        ...localizationObject.fields,
        defineField({
          name: 'value',
          type: 'slug',
        }),
      ],
    } as any,
  ],
  initialValue: [
    {
      language: 'en',
      value: { current: '' },
    },
  ],
})

export const internationalizedArrayBlockContent = defineType({
  name: 'internationalizedArrayBlockContent',
  type: 'array',
  of: [
    {
      ...localizationObject,
      fields: [
        ...localizationObject.fields,
        defineField({
          name: 'value',
          type: 'blockContent',
        }),
      ],
    } as any,
  ],
  initialValue: [
    {
      language: 'en',
      value: [],
    },
  ],
})
