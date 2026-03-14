export const metadata = {
  title: 'Intetkøn Studio',
  description: 'Intetkøn shop Studio page',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
