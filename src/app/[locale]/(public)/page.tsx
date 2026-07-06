import AboutSection from '@src/components/landing/AboutMeSection'
import BlogSection from '@src/components/landing/BlogSection'
import CallToActionSection from '@src/components/landing/CallToActionSection'
import HeroSection from '@src/components/landing/HeroSection'
import { alternatesFor } from '@src/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return { alternates: alternatesFor(locale, { en: '', da: '' }) }
}

const LandingPage = () => {
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
