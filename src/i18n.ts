import { getRequestConfig } from 'next-intl/server'

import { loadMessages } from './i18n/messages'

export const defaultLocale = 'en' as const
export const locales = ['en', 'da'] as const
export type Locale = (typeof locales)[number]

// The active request config lives in ./i18n/request.ts (next-intl plugin default).
// This default export is kept for backwards compatibility.
export default getRequestConfig(async ({ locale }) => {
  const currentLocale = locale || defaultLocale
  return {
    locale: currentLocale,
    messages: await loadMessages(currentLocale),
  }
})
