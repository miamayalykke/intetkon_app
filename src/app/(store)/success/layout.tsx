import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Success',
  description: 'Your order was successfully completed!',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
