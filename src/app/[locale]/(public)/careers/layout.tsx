import { staticPageMetadata } from '@src/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return staticPageMetadata(locale, '/careers', {
    en: {
      title: 'Careers',
      description: 'Open positions and opportunities to work with Intetkøn.',
    },
    da: {
      title: 'Karriere',
      description:
        'Ledige stillinger og muligheder for at arbejde hos Intetkøn.',
    },
  })
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
