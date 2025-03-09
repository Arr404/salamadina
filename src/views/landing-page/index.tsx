'use client'

// React Imports
import { useEffect } from 'react'


// Component Imports
import HeroSection from './HeroSection'
import UsefulFeature from './UsefulFeature'
import CustomerReviews from './CustomerReviews'
import Pricing from './Pricing'
import ProductStat from './ProductStat'
import Faqs from './Faqs'
import GetStarted from './GetStarted'
import ContactUs from './ContactUs'
import { useSettings } from '@core/hooks/useSettings'
import Gallery from '@views/landing-page/Gallery'
import MapsLeaflet from '@views/landing-page/MapsLeaflet'

const LandingPageWrapper = () => {
  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='bg-backgroundPaper'>
      <HeroSection />
      {/*<Maps />*/}
      <MapsLeaflet/>
      <UsefulFeature />
      <CustomerReviews />
      <Gallery/>
      {/*<OurTeam />*/}
      <Pricing />
      <ProductStat />
      <Faqs />
      <GetStarted  />
      <ContactUs />
    </div>
  )
}

export default LandingPageWrapper
