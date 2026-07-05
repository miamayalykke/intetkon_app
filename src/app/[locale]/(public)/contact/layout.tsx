import { staticPageMetadata } from '@src/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return staticPageMetadata(locale, '/contact', {
    en: {
      title: 'Contact Us',
      description:
        'Get in touch with Intetkøn — questions about courses, workshops or patterns.',
    },
    da: {
      title: 'Kontakt Os',
      description:
        'Kontakt Intetkøn — spørgsmål om sykurser, workshops eller symønstre.',
    },
  })
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
