import { staticPageMetadata } from '@src/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return staticPageMetadata(locale, '/about', {
    en: {
      title: 'About Us',
      description:
        'Meet Intetkøn — the atelier behind the sewing courses, workshops and patterns.',
    },
    da: {
      title: 'Om Os',
      description:
        'Mød Intetkøn — atelieret bag sykurserne, syworkshopsne og symønstrene.',
    },
  })
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
