import { getRequestConfig } from 'next-intl/server'

import { defaultLocale, locales } from '../i18n'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? defaultLocale

  if (!(locales as readonly string[]).includes(locale)) {
    return {
      locale: defaultLocale,
      messages: (await import(`../messages/${defaultLocale}.json`)).default,
      timeZone: 'Europe/Copenhagen',
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Europe/Copenhagen',
  }
})
