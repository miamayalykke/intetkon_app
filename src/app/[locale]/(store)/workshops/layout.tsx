import { staticPageMetadata } from '@src/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return staticPageMetadata(locale, '/workshops', {
    en: {
      title: 'Sewing Workshops',
      description:
        'Book sewing workshops at the Intetkøn atelier — hands-on courses for all levels.',
    },
    da: {
      title: 'Syworkshops',
      description:
        'Book syworkshops hos Intetkøn atelier — praktiske sykurser for alle niveauer.',
    },
  })
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
