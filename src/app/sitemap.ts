import { type Locale, locales } from '@src/i18n'
import { BASE_URL } from '@src/lib/seo'
import { getLocalizedSlug } from '@src/lib/slug-helpers'
import { client } from '@src/sanity/lib/client'
import type { MetadataRoute } from 'next'

export const revalidate = 3600

const STATIC_ROUTES = [
  '',
  '/shop',
  '/patterns',
  '/workshops',
  '/blog',
  '/about',
  '/contact',
  '/pattern-testing',
  '/careers',
  '/privacy-policy',
  '/return-policy',
  '/terms-of-service',
]

interface SlugDoc {
  slug: unknown
  _updatedAt: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  const add = (
    paths: Partial<Record<Locale, string>>,
    lastModified?: string,
  ) => {
    const languages: Record<string, string> = {}
    for (const [l, p] of Object.entries(paths)) {
      if (p != null) languages[l] = `${BASE_URL}/${l}${p}`
    }
    const xDefault = languages.da ?? languages.en
    for (const url of Object.values(languages)) {
      entries.push({
        url,
        lastModified,
        alternates: { languages: { ...languages, 'x-default': xDefault } },
      })
    }
  }

  for (const route of STATIC_ROUTES) {
    add({ en: route, da: route })
  }

  const [products, workshops, posts] = await Promise.all([
    client.fetch<SlugDoc[]>(
      `*[_type == "product" && defined(slug)]{ slug, _updatedAt }`,
    ),
    client.fetch<SlugDoc[]>(
      `*[_type == "workshop" && defined(slug) && date >= now()]{ slug, _updatedAt }`,
    ),
    client.fetch<SlugDoc[]>(
      `*[_type == "post" && defined(slug) && publishedAt <= now()]{ slug, _updatedAt }`,
    ),
  ])

  const addDocs = (docs: SlugDoc[], basePath: string) => {
    for (const doc of docs) {
      const paths: Partial<Record<Locale, string>> = {}
      for (const l of locales) {
        const slug = getLocalizedSlug(doc.slug, l)
        if (slug) paths[l] = `${basePath}/${slug}`
      }
      if (Object.keys(paths).length) add(paths, doc._updatedAt)
    }
  }

  addDocs(products ?? [], '/product')
  addDocs(workshops ?? [], '/workshops')
  addDocs(posts ?? [], '/blog')

  return entries
}
