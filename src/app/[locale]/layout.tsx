import PublicFooter from '@src/components/footers/PublicFooter'
import Header from '@src/components/headers/Header'
import { IntlProvider } from '@src/components/providers/IntlProvider'
import { defaultLocale, locales } from '@src/i18n'
import { loadMessages } from '@src/i18n/messages'
import { BASE_URL } from '@src/lib/seo'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const SITE_COPY = {
  en: {
    title: 'Intetkøn — Sewing courses, workshops & patterns',
    description:
      'Learn to sew at the Intetkøn atelier. Sewing courses and workshops for all levels, plus digital sewing patterns you can download and sew at home.',
  },
  da: {
    title: 'Intetkøn — Sykurser, syworkshops & symønstre',
    description:
      'Lær at sy hos Intetkøn. Sykurser og syworkshops for alle niveauer i vores atelier — og digitale symønstre, du kan downloade og sy derhjemme.',
  },
} as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const l = locale === 'da' ? 'da' : 'en'
  const copy = SITE_COPY[l]
  return {
    metadataBase: new URL(BASE_URL),
    title: { default: copy.title, template: '%s | Intetkøn' },
    description: copy.description,
    openGraph: {
      type: 'website',
      siteName: 'Intetkøn',
      locale: l === 'da' ? 'da_DK' : 'en_US',
      alternateLocale: l === 'da' ? 'en_US' : 'da_DK',
      title: copy.title,
      description: copy.description,
      images: [{ url: '/og-default.jpg', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
  }
}

const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${BASE_URL}/#business`,
  name: 'Intetkøn',
  url: BASE_URL,
  image: `${BASE_URL}/og-default.jpg`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Bentzonsvej 50b',
    postalCode: '2000',
    addressLocality: 'Frederiksberg',
    addressCountry: 'DK',
  },
  sameAs: [
    'https://www.facebook.com/profile.php?id=61569961322745',
    'https://www.instagram.com/_intetkon_/',
    'https://www.tiktok.com/@intetkon_',
    'https://www.linkedin.com/company/intetk%C3%B8n/',
  ],
}

function websiteJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Intetkøn',
    url: BASE_URL,
    inLanguage: locale === 'da' ? 'da' : 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/${locale}/search?query={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  // Validate locale
  const validLocale = (locales as readonly string[]).includes(locale)
    ? locale
    : defaultLocale

  // Load messages for the locale
  const messages = await loadMessages(validLocale)

  return (
    <html lang={validLocale} suppressHydrationWarning>
      <body className="bg-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd(validLocale)),
          }}
        />
        <Analytics />
        <SpeedInsights />
        <IntlProvider locale={validLocale} messages={messages}>
          <Header locale={validLocale} />
          <main className="pt-22 min-h-svh">{children}</main>
          <PublicFooter />
        </IntlProvider>
      </body>
    </html>
  )
}
