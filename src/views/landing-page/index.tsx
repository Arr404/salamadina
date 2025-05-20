'use client'

// React Imports
import { useEffect } from 'react'


// Component Imports
import HeroSection from './HeroSection'
import UsefulFeature from './UsefulFeature'
import CustomerReviews from './CustomerReviews'
import Pricing from './Pricing'
import Video from './Video'
import Faqs from './Faqs'
import GetStarted from './GetStarted'
import ContactUs from './ContactUs'
import { useSettings } from '@core/hooks/useSettings'
import Gallery from '@views/landing-page/Gallery'
import MapsLeaflet from '@views/landing-page/MapsLeaflet'
import MapsGlobe from '@views/landing-page/MapsGlobe'
import GalleryLanding from '@views/landing-page/Gallery'
// Image paths from your original code
const images = [
  "images/gallery/3 Februari/IMG-20250205-WA0051.jpg",
  "images/gallery/3 Februari/IMG-20250205-WA0068.jpg",
  "images/gallery/3 Februari/IMG-20250205-WA0074.jpg",
  "images/gallery/3 Februari/IMG-20250205-WA0093.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0018.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0019.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0079.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0083.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0092.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0143.jpg",
  "images/gallery/3 Februari/IMG-20250208-WA0095.jpg",
  "images/gallery/3 Februari/IMG-20250209-WA0007.jpg",
  "images/gallery/3 Februari/IMG-20250209-WA0020.jpg",
  "images/gallery/3 Februari/IMG-20250209-WA0039.jpg",
  "images/gallery/3 Februari/IMG-20250209-WA0051.jpg",
  "images/gallery/3 Februari/IMG-20250211-WA0004.jpg",
  "images/gallery/3 Februari/WhatsApp Image 2025-02-09 at 07.57.10_7f459ee6.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241009-WA0026.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241009-WA0054.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241010-WA0014.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241014-WA0051.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241015-WA0005.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241108-WA0032.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241108-WA0035.jpg",
  "images/gallery/5 oktober 24 umroh corporate/WhatsApp Image 2023-05-11 at 19.58.22.jpeg",
  "images/gallery/5 oktober 24 umroh corporate/WhatsApp Image 2024-11-07 at 15.05.51_998b0c75.jpg",
  "images/gallery/5 oktober 24 umroh corporate/WhatsApp Image 2024-11-07 at 15.14.43_b685204a.jpg",
  "images/gallery/5 oktober 24 umroh corporate/WhatsApp Image 2024-11-07 at 15.21.18_1c49e39e.jpg",
  "images/gallery/19 Desember/IMG-20241222-WA0043.jpg",
  "images/gallery/19 Desember/IMG-20241223-WA0034.jpg",
  "images/gallery/19 Desember/IMG-20241223-WA0035.jpg",
  "images/gallery/19 Desember/IMG-20241224-WA0050.jpg",
  "images/gallery/19 Desember/IMG-20241224-WA0055.jpg",
  "images/gallery/19 Desember/IMG-20241227-WA0034.jpg",
  "images/gallery/19 Desember/IMG-20241228-WA0043.jpg",
  "images/gallery/19 Desember/IMG-20241228-WA0045.jpg",
  "images/gallery/19 Desember/IMG-20241228-WA0047.jpg",
  "images/gallery/19 Desember/IMG-20241228-WA0054.jpg",
  "images/gallery/19 Desember/IMG-20241228-WA0055.jpg",
  "images/gallery/19 Desember/WhatsApp Image 2024-12-23 at 19.20.39_2e0a8a1a.jpg",
  "images/gallery/19 Desember/WhatsApp Image 2024-12-23 at 19.20.40_fc46fd99.jpg",
  "images/gallery/19 Desember/WhatsApp Image 2024-12-28 at 17.24.58_8781c8a3.jpg",
  "images/gallery/22 Januari/IMG-20250129-WA0107.jpg",
  "images/gallery/22 Januari/IMG-20250201-WA0080.jpg",
  "images/gallery/22 Januari/IMG-20250202-WA0001.jpg",
  "images/gallery/28 Januari/IMG-20250201-WA0057.jpg",
  "images/gallery/28 Januari/IMG-20250204-WA0059.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-02 at 20.34.36_0244155c.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-03 at 09.20.35_166533e2.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-03 at 09.20.38_d1d9c67d.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-03 at 09.20.39_82bc6ee4.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-03 at 09.20.40_f13273f8.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-07 at 13.02.58_dd12cd61.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-07 at 13.14.36_614600d9.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-07 at 13.16.32_447f54cc.jpg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-06-25 at 00.00.13.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-06-28 at 14.55.46.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-06-28 at 14.55.49.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-06-28 at 14.56.16.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-07-05 at 12.59.03.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-07-10 at 23.54.52 (1).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-07-11 at 21.05.27.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.20 (1).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.20 (2).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.20 (3).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.21.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.21 (1).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.21 (2).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.22 (1).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.23.jpeg"
];

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
      <div className='relative -mt-8 md:-mt-12'> {/* Negative margin to pull content up */}
        <MapsGlobe/>
        <UsefulFeature />
        <CustomerReviews />
        <GalleryLanding images={images} />
        <Pricing />
        <Video />
        <Faqs />
      </div>

      {/*<ContactUs />*/}
    </div>
  )
}

export default LandingPageWrapper
