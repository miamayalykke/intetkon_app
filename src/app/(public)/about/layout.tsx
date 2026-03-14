import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'The official Intetkøn About Us page',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
