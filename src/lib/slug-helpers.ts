export function getLocalizedSlug(
  slug: any,
  locale: string
): string | undefined {
  if (!slug) return undefined

  // Handle new array structure: slug[] { language, value }
  if (Array.isArray(slug)) {
    const localeSlug = slug.find((s: any) => s.language === locale)
    return localeSlug?.value?.current
  }

  // Handle old Slug structure: { current: string }
  if (slug.current) {
    return slug.current
  }

  return undefined
}
