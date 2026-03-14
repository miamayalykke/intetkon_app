import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Product Page',
  description: 'View your selected Product',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
