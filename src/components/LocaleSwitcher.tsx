'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

export function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    // Remove the current locale from the pathname
    const segments = pathname.split('/').filter(Boolean)
    const withoutLocale = segments.slice(1).join('/')
    return `/${newLocale}/${withoutLocale}`
  }

  return (
    <div className="flex gap-2">
      <Link
        href={switchLocale('en')}
        className={`px-3 py-1 rounded ${
          locale === 'en'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        }`}
      >
        English
      </Link>
      <Link
        href={switchLocale('da')}
        className={`px-3 py-1 rounded ${
          locale === 'da'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        }`}
      >
        Dansk
      </Link>
    </div>
  )
}
