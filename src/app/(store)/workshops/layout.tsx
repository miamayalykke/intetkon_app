import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Workshops',
  description: 'View and sign up for upcoming workshops!',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
