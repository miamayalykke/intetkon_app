import { staticPageMetadata } from '@src/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return staticPageMetadata(locale, '/patterns', {
    en: {
      title: 'Shop Digital Sewing Patterns',
      description:
        'Digital sewing patterns from Intetkøn — instant download, sizes for adults and kids.',
    },
    da: {
      title: 'Shop Digitale Symønstre',
      description:
        'Digitale symønstre fra Intetkøn — download med det samme, størrelser til voksne og børn.',
    },
  })
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
