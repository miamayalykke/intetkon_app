import { ClerkProvider } from '@clerk/nextjs'
import { SanityLive } from '@sanity/lib/live'
import { DisableDraftMode } from '@src/components/disableDraftMode'
import PublicFooter from '@src/components/footers/PublicFooter'
import Header from '@src/components/headers/Header'
import type { Metadata } from 'next'
import { VisualEditing } from 'next-sanity/visual-editing'
import { draftMode } from 'next/headers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Intetkøn',
  description: 'Official Intetkøn Webshop Home',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isEnabled } = await draftMode()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background">
        <ClerkProvider dynamic>
          {isEnabled && (
            <>
              <DisableDraftMode />
              <VisualEditing />
            </>
          )}

          <Header />

          <main className="pt-22 min-h-svh">{children}</main>

          <PublicFooter />
          <SanityLive />
        </ClerkProvider>
      </body>
    </html>
  )
}
