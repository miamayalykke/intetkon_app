import { ClerkProvider } from '@clerk/nextjs'
import PublicFooter from '@src/components/footers/PublicFooter'
import Header from '@src/components/headers/Header'
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background">
        <ClerkProvider dynamic>
          <Header />

          <main className="pt-22 min-h-svh">{children}</main>

          <PublicFooter />
        </ClerkProvider>
      </body>
    </html>
  )
}
