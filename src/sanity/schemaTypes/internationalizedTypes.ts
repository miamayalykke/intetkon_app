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
          options: {
            source: (doc: any, context: any) => {
              const language = context.parent?.language
              const nameOrTitle = doc.name || doc.title || []
              const match = nameOrTitle.find((n: any) => n.language === language)
              return match?.value ?? ''
            },
            slugify: (input: string) =>
              input
                .toLowerCase()
                .replace(/æ/g, 'ae')
                .replace(/ø/g, 'o')
                .replace(/å/g, 'a')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, ''),
          },
          validation: (Rule) =>
            Rule.custom((value: any) => {
              const current = value?.current
              if (!current) return true
              if (/[\sæøå]/i.test(current)) {
                return 'Slug must not contain spaces or Danish characters (æ, ø, å) — use ae, o, a instead.'
              }
              return true
            }),
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
