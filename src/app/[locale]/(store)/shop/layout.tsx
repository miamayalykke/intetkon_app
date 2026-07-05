import { staticPageMetadata } from '@src/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return staticPageMetadata(locale, '/shop', {
    en: {
      title: 'Shop Physical Products',
      description:
        'Browse physical products from Intetkøn — sewn goods, kits and supplies.',
    },
    da: {
      title: 'Shop Fysiske Produkter',
      description:
        'Se fysiske produkter fra Intetkøn — syede varer, kits og tilbehør.',
    },
  })
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
