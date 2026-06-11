import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Intetkøn',
  description: 'Official Intetkøn Webshop Home',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClerkProvider dynamic>{children}</ClerkProvider>
}
