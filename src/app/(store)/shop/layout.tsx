import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop Physical Products',
  description: 'Page visualizing all physical products for sale!',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
