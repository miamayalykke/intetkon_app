import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
