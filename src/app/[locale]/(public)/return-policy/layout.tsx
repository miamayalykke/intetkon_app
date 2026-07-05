import { staticPageMetadata } from '@src/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return staticPageMetadata(locale, '/return-policy', {
    en: {
      title: 'Return Policy',
      description:
        "Intetkøn's return policy for products, patterns and workshops.",
    },
    da: {
      title: 'Returpolitik',
      description:
        'Intetkøns returpolitik for produkter, mønstre og workshops.',
    },
  })
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
