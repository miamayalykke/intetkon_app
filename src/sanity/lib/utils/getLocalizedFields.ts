import { defaultLocale } from '@src/i18n'

interface LocalizedField {
  language: string
  value: unknown
}

/**
 * Extract localized value from internationalized array field
 * Falls back to default language if requested language not found
 */
export function getLocalizedField<T = string>(
  field: LocalizedField[] | LocalizedField | T | undefined,
  locale: string = defaultLocale
): T | null {
  // If not an array, return as-is (for backward compatibility with shared fields)
  if (!Array.isArray(field)) {
    return (field as T) || null
  }

  // Find matching locale
  const localized = field.find((item) => item.language === locale)
  if (localized) {
    return (localized.value as T) || null
  }

  // Fall back to default locale
  const fallback = field.find((item) => item.language === defaultLocale)
  if (fallback) {
    return (fallback.value as T) || null
  }

  return null
}

/**
 * Transform document to extract localized fields while preserving all other properties
 * Safely handles both old (string) and new (array) field structures
 */
export function transformLocalizedDocument<T extends Record<string, any>>(
  doc: T,
  locale: string = defaultLocale,
  fieldsToTransform: string[] = []
): T {
  const result = { ...doc }

  if (!fieldsToTransform.length) {
    // If no fields specified, find array fields and transform them
    Object.entries(doc).forEach(([key, value]) => {
      if (
        Array.isArray(value) &&
        value[0] &&
        typeof value[0] === 'object' &&
        'language' in value[0]
      ) {
        ;(result as any)[key] = getLocalizedField(value, locale)
      }
    })
  } else {
    // Transform only specified fields
    fieldsToTransform.forEach((fieldName) => {
      const value = doc[fieldName]
      if (
        Array.isArray(value) &&
        value[0] &&
        typeof value[0] === 'object' &&
        'language' in value[0]
      ) {
        ;(result as any)[fieldName] = getLocalizedField(value, locale)
      }
    })
  }

  return result as T
}
