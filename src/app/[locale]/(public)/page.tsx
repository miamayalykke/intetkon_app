import AboutSection from '@src/components/landing/AboutMeSection'
import BlogSection from '@src/components/landing/BlogSection'
import CallToActionSection from '@src/components/landing/CallToActionSection'
import HeroSection from '@src/components/landing/HeroSection'
import UnderConstruction from '@src/components/UnderConstruction'
import { alternatesFor } from '@src/lib/seo'
import type { Metadata } from 'next'
import { headers } from 'next/headers'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return { alternates: alternatesFor(locale, { en: '', da: '' }) }
}

const LandingPage = async () => {
  if (process.env.UNDER_CONSTRUCTION === 'true') {
    const headersList = await headers()
    const host = headersList.get('host') ?? ''
    const isLocalhost =
      host.startsWith('localhost') ||
      /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/.test(host)
    if (
      !isLocalhost ||
      process.env.UNDER_CONSTRUCTION_ON_LOCALHOST !== 'false'
    ) {
      return <UnderConstruction />
    }
  }

  return (
    <>
      <HeroSection />
      <AboutSection />
      <BlogSection />
      <CallToActionSection />
    </>
  )
}

export default LandingPage
