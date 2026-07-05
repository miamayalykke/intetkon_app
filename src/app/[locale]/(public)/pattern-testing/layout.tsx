import { staticPageMetadata } from '@src/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return staticPageMetadata(locale, '/pattern-testing', {
    en: {
      title: 'Become a Pattern Tester',
      description:
        'Sign up to test new Intetkøn sewing patterns before they launch.',
    },
    da: {
      title: 'Bliv Mønstertester',
      description:
        'Tilmeld dig og test nye Intetkøn symønstre, før de lanceres.',
    },
  })
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
