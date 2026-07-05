import type { Metadata } from 'next'

export const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  'https://intetkon.com'

/** Flatten Sanity block content into a plain-text meta description. */
export function blocksToPlainText(blocks: unknown, maxLength = 160): string {
  if (!Array.isArray(blocks)) return typeof blocks === 'string' ? blocks : ''
  const text = blocks
    .filter((b) => b?._type === 'block' && Array.isArray(b.children))
    .map((b) => b.children.map((c: { text?: string }) => c.text ?? '').join(''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > maxLength
    ? `${text.slice(0, maxLength - 1).trimEnd()}…`
    : text
}

/**
 * Canonical + hreflang for a page. Pass the path per locale (they differ for
 * products/workshops/posts because slugs are localized). x-default points at
 * Danish since that's the primary audience.
 */
export function alternatesFor(
  locale: string,
  paths: Partial<Record<'en' | 'da', string>>,
): Metadata['alternates'] {
  const languages: Record<string, string> = {}
  if (paths.en != null) languages.en = `${BASE_URL}/en${paths.en}`
  if (paths.da != null) languages.da = `${BASE_URL}/da${paths.da}`
  languages['x-default'] = languages.da ?? languages.en ?? BASE_URL

  const current = paths[locale as 'en' | 'da'] ?? paths.da ?? paths.en ?? ''
  return {
    canonical: `${BASE_URL}/${locale}${current}`,
    languages,
  }
}

interface LocalizedCopy {
  title: string
  description: string
}

/** Metadata for static pages where the path is identical in both locales. */
export function staticPageMetadata(
  locale: string,
  path: string,
  copy: Record<'en' | 'da', LocalizedCopy>,
): Metadata {
  const l = locale === 'da' ? 'da' : 'en'
  const t = copy[l]
  return {
    title: t.title,
    description: t.description,
    alternates: alternatesFor(l, { en: path, da: path }),
    openGraph: { title: t.title, description: t.description },
  }
}
