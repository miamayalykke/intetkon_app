import { defaultLocale } from '@src/i18n'

interface LocalizedValue {
  language: string
  value: string
}

interface LocalizedObject {
  language: string
  value: unknown
}

export function getLocalizedValue(
  values: LocalizedValue[] | undefined,
  locale: string = defaultLocale
): string | null {
  if (!values || !Array.isArray(values)) {
    return null
  }

  const localized = values.find((item) => item.language === locale)
  if (localized) {
    return localized.value
  }

  const fallback = values.find((item) => item.language === defaultLocale)
  return fallback?.value ?? null
}

export function getLocalizedObject<T = unknown>(
  values: LocalizedObject[] | undefined,
  locale: string = defaultLocale
): T | null {
  if (!values || !Array.isArray(values)) {
    return null
  }

  const localized = values.find((item) => item.language === locale)
  if (localized) {
    return localized.value as T
  }

  const fallback = values.find((item) => item.language === defaultLocale)
  return (fallback?.value as T) ?? null
}

export function addLocalizeProjection(baseQuery: string): string {
  return baseQuery
}

export function createLocalizeFilter(locale: string = defaultLocale): string {
  return locale
}
