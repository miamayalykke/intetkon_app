import { staticPageMetadata } from '@src/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return staticPageMetadata(locale, '/terms-of-service', {
    en: {
      title: 'Terms of Service',
      description: "Intetkøn's terms of service.",
    },
    da: {
      title: 'Handelsbetingelser',
      description: 'Intetkøns handelsbetingelser.',
    },
  })
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
