'use client'

import { NextIntlClientProvider } from 'next-intl'
import type { ReactNode } from 'react'

interface IntlProviderProps {
  children: ReactNode
  locale: string
}

export function IntlProvider({ children, locale }: IntlProviderProps) {
  return (
    <NextIntlClientProvider locale={locale}>{children}</NextIntlClientProvider>
  )
}
