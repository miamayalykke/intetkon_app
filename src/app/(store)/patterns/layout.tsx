import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop Digital Patterns',
  description: 'Page visualizing all digital patterns for sale!',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
