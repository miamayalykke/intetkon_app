import { staticPageMetadata } from '@src/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return staticPageMetadata(locale, '/book-atelieret', {
    en: {
      title: 'Book the Atelier — private sewing events',
      description:
        'Book the Intetkøn atelier for your own private sewing event — bachelorette parties, birthdays and team events. 795 DKK per person, you choose the project.',
    },
    da: {
      title: 'Book ateliéret — private syevents',
      description:
        'Book Intetkøns atelier til jeres helt eget private syevent — polterabend, fødselsdag eller firma-event. 795 kr. pr. person, I vælger selv projektet.',
    },
  })
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
