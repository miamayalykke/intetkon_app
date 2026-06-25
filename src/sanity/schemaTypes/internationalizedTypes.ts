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

const validateBothLanguages = (Rule: any) =>
  Rule.custom((value: any) => {
    if (!Array.isArray(value) || value.length === 0) {
      return 'Both English and Danish versions are required'
    }

    const languages = value.map((item: any) => item?.language).filter(Boolean)
    const hasEnglish = languages.includes('en')
    const hasDanish = languages.includes('da')

    if (!hasEnglish) {
      return 'English version is required'
    }
    if (!hasDanish) {
      return 'Danish version is required'
    }

    // Check that values exist and are not empty
    const enValue = value.find((item: any) => item?.language === 'en')?.value
    const daValue = value.find((item: any) => item?.language === 'da')?.value

    // Handle both strings and arrays (for blockContent)
    const enHasContent =
      enValue &&
      (Array.isArray(enValue) ? enValue.length > 0 : String(enValue).trim())
    const daHasContent =
      daValue &&
      (Array.isArray(daValue) ? daValue.length > 0 : String(daValue).trim())

    if (!enHasContent) {
      return 'English version must have content'
    }
    if (!daHasContent) {
      return 'Danish version must have content'
    }

    return true
  })

export const internationalizedArrayString = defineType({
  name: 'internationalizedArrayString',
  type: 'array',
  of: [
    {
      ...localizationObject,
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
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'value',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    } as any,
  ],
  initialValue: [
    { language: 'en', value: '' },
    { language: 'da', value: '' },
  ],
  validation: (Rule) => validateBothLanguages(Rule.required()),
})

export const internationalizedArrayText = defineType({
  name: 'internationalizedArrayText',
  type: 'array',
  of: [
    {
      ...localizationObject,
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
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'value',
          type: 'text',
          validation: (Rule) => Rule.required(),
        }),
      ],
    } as any,
  ],
  initialValue: [
    { language: 'en', value: '' },
    { language: 'da', value: '' },
  ],
  validation: (Rule) => validateBothLanguages(Rule.required()),
})

export const internationalizedArraySlug = defineType({
  name: 'internationalizedArraySlug',
  type: 'array',
  of: [
    {
      ...localizationObject,
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
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'value',
          type: 'slug',
          options: {
            source: (doc: any, context: any) => {
              const language = context.parent?.language
              const nameOrTitle = doc.name || doc.title || []
              const match = nameOrTitle.find(
                (n: any) => n.language === language,
              )
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
            Rule.required().custom((value: any) => {
              const current = value?.current
              if (!current) return 'Slug is required'
              if (/[\sæøå]/i.test(current)) {
                return 'Slug must not contain spaces or Danish characters (æ, ø, å) - use ae, o, a instead.'
              }
              return true
            }),
        }),
      ],
    } as any,
  ],
  initialValue: [
    { language: 'en', value: { current: '' } },
    { language: 'da', value: { current: '' } },
  ],
  validation: (Rule) => validateBothLanguages(Rule.required()),
})

export const internationalizedArrayBlockContent = defineType({
  name: 'internationalizedArrayBlockContent',
  type: 'array',
  of: [
    {
      ...localizationObject,
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
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'value',
          type: 'blockContent',
          validation: (Rule) => Rule.required(),
        }),
      ],
    } as any,
  ],
  initialValue: [
    { language: 'en', value: [] },
    { language: 'da', value: [] },
  ],
  validation: (Rule) => validateBothLanguages(Rule.required()),
})
