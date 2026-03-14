import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Basket',
  description: 'View your basket',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
