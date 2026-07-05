import { staticPageMetadata } from '@src/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return staticPageMetadata(locale, '/privacy-policy', {
    en: {
      title: 'Privacy Policy',
      description: "Intetkøn's privacy policy — how we handle your data.",
    },
    da: {
      title: 'Privatlivspolitik',
      description:
        'Intetkøns privatlivspolitik — hvordan vi behandler dine data.',
    },
  })
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
