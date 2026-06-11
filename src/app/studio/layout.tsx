export const metadata = {
  title: 'Intetkøn Studio',
  description: 'Intetkøn shop Studio page',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
