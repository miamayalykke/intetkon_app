import PublicFooter from '@src/components/footers/PublicFooter'
import Header from '@src/components/headers/Header'
import { IntlProvider } from '@src/components/providers/IntlProvider'
import { defaultLocale, locales } from '@src/i18n'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { ReactNode } from 'react'

interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
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

  return (
    <html lang={validLocale} suppressHydrationWarning>
      <body className="bg-background">
        <Analytics />
        <SpeedInsights />
        <IntlProvider locale={validLocale}>
          <Header locale={validLocale} />
          <main className="pt-22 min-h-svh">{children}</main>
          <PublicFooter />
        </IntlProvider>
      </body>
    </html>
  )
}
