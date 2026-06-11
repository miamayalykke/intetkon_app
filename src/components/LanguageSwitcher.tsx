'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'da', label: 'DA' },
]

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname()

  // Remove the locale prefix from the pathname
  // pathname includes locale, so /en/workshops becomes /workshops
  const pathWithoutLocale = pathname.startsWith(`/${currentLocale}`)
    ? pathname.slice(currentLocale.length + 1)
    : pathname

  return (
    <div className="flex gap-2">
      {LANGUAGES.map((lang) => (
        <Link
          key={lang.code}
          href={`/${lang.code}${pathWithoutLocale || '/'}`}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            currentLocale === lang.code
              ? 'bg-orange-500 text-white'
              : 'bg-border text-foreground hover:bg-orange-500/20'
          }`}
        >
          {lang.label}
        </Link>
      ))}
    </div>
  )
}
