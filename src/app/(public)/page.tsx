import AboutSection from '@src/components/landing/AboutMeSection'
import BlogSection from '@src/components/landing/BlogSection'
import CallToActionSection from '@src/components/landing/CallToActionSection'
import HeroSection from '@src/components/landing/HeroSection'
import UnderConstruction from '@src/components/UnderConstruction'
import { headers } from 'next/headers'

const LandingPage = async () => {
  if (process.env.UNDER_CONSTRUCTION === 'true') {
    const headersList = await headers()
    const host = headersList.get('host') ?? ''
    const isLocalhost = host.startsWith('localhost')
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
