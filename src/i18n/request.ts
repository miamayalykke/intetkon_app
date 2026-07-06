import { getRequestConfig } from 'next-intl/server'

import { defaultLocale, locales } from '../i18n'
import { loadMessages } from './messages'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = (await requestLocale) ?? defaultLocale
  const locale = (locales as readonly string[]).includes(requested) ? requested : defaultLocale

  return {
    locale,
    messages: await loadMessages(locale),
    timeZone: 'Europe/Copenhagen',
  }
})
