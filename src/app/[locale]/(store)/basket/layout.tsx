import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Basket',
  description: 'View your basket',
  robots: { index: false, follow: false },
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
