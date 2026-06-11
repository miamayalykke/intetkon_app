import { getRequestConfig } from 'next-intl/server'

import { defaultLocale, locales } from '../i18n'

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = locale || defaultLocale

  // Validate that the locale is supported
  if (!(locales as readonly string[]).includes(currentLocale)) {
    return {
      locale: defaultLocale,
      messages: (await import(`../messages/${defaultLocale}.json`)).default,
    }
  }

  return {
    locale: currentLocale,
    messages: (await import(`../messages/${currentLocale}.json`)).default,
  }
})
