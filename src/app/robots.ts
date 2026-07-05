import { BASE_URL } from '@src/lib/seo'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/studio',
          '/app',
          '/*/basket',
          '/*/success',
          '/*/search',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
