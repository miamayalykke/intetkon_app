import { getRequestConfig } from 'next-intl/server'

export const defaultLocale = 'en' as const
export const locales = ['en', 'da'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = locale || defaultLocale
  return {
    locale: currentLocale,
    messages: (await import(`./messages/${currentLocale}.json`)).default,
  }
})
