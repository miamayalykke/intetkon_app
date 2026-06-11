import { defaultLocale } from '@src/i18n'
import { client } from '../client'

interface LocaleContentOptions {
  locale?: string
  fallbackToDefault?: boolean
}

export async function getLocaleContent(
  query: string,
  params: Record<string, unknown> = {},
  options: LocaleContentOptions = {}
) {
  const { locale = defaultLocale, fallbackToDefault = true } = options

  // Add language filter to query
  const queryWithLocale = query.replace(
    /\*\[/,
    `*[language == "${locale}" && [`
  )

  try {
    return await client.fetch(queryWithLocale, params)
  } catch (error) {
    // If no content found for requested locale and fallback is enabled, try default locale
    if (fallbackToDefault && locale !== defaultLocale) {
      const queryWithDefault = query.replace(
        /\*\[/,
        `*[language == "${defaultLocale}" && [`
      )
      return await client.fetch(queryWithDefault, params)
    }
    throw error
  }
}

export function buildLocaleQuery(
  baseQuery: string,
  locale?: string
): string {
  const currentLocale = locale || defaultLocale
  return baseQuery.replace(/\*\[/, `*[language == "${currentLocale}" && [`)
}
