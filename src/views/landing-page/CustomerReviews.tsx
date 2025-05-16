// MUI Imports
import { useState } from 'react'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Rating from '@mui/material/Rating'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useKeenSlider } from 'keen-slider/react'
import classnames from 'classnames'

// Component Imports
import { useSwipeable } from "react-swipeable";

import CustomIconButton from '@core/components/mui/IconButton'
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppKeenSlider from '@/libs/styles/AppKeenSlider'

// SVG Imports
import Pinterest from '@assets/svg/front-pages/landing-page/Pinterest'
import Dribbble from '@assets/svg/front-pages/landing-page/Dribbble'
import Airbnb from '@assets/svg/front-pages/landing-page/Airbnb'
import Coinbase from '@assets/svg/front-pages/landing-page/Coinbase'
import Netflix from '@assets/svg/front-pages/landing-page/Netflix'

// Styles Imports
import frontCommonStyles from '@views/styles.module.css'
import styles from './styles.module.css'
import { TestimonialSlider } from '@components/layout/front-pages/TestimonialSlider'


const CustomerReviews = () => {
  const imagePaths = [
    "afco.png", "bigpm.png", "bmtsrt.png", "bmtugt.png", "bnn.png",
    "kspps.png", "lkms.png", "mimps.png", "pbs.png", "pens.png",
    "pmc.png", "pp.png", "puj.png", "sas.png", "sdm9tu.png",
    "sdm10ba.png", "sm1c.png", "sm1k.png", "sm1kr.png", "sm1pu.png",
    "sm1s.png", "sm1t.png", "sm1w.png", "sm2k.png", "sm2kri.png",
    "sm2sid.png", "sm2tu.png", "sm2w.png", "sm3wa.png", "sm4za.png",
    "sm5por.png", "sm8tu.png", "sm11ran.png", "sm12t.png", "smk3m.png",
    "wika.png"
  ];

  // Hooks
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slides: {
        perView: 3,
        origin: 'auto'
      },
      breakpoints: {
        '(max-width: 1200px)': {
          slides: {
            perView: 2,
            spacing: 10,
            origin: 'auto'
          }
        },
        '(max-width: 900px)': {
          slides: {
            perView: 2,
            spacing: 10
          }
        },
        '(max-width: 600px)': {
          slides: {
            perView: 1,
            spacing: 10,
            origin: 'center'
          }
        }
      }
    },
    [
      slider => {
        let timeout: ReturnType<typeof setTimeout>
        const mouseOver = false

        function clearNextTimeout() {
          clearTimeout(timeout)
        }

        function nextTimeout() {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 2000)
        }

        slider.on('created', nextTimeout)
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  // Duplicate images for infinite scroll effect
  const images = [...imagePaths, ...imagePaths];

  const [isPaused, setIsPaused] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => setIsPaused(true),
    onSwipedRight: () => setIsPaused(true),
    onSwiped: () => setTimeout(() => setIsPaused(false), 2000), // Resume after 2s
  });

  return (
    <section className={classnames('flex flex-col gap-8 plb-[100px] bg-backgroundDefault', styles.sectionStartRadius)}>
      <div
        className={classnames('flex max-md:flex-col max-sm:flex-wrap is-full gap-6', frontCommonStyles.layoutSpacing)}
      >
        <TestimonialSlider/>
      </div>
      <Divider />
      <div {...handlers} className="relative w-full overflow-hidden">
        <div
          className={`flex items-center gap-12 animate-scroll ${isPaused ? "paused" : ""}`}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={`/images/clients/${image}`}
              alt={image.replace(".png", "")}
              className="h-24 w-auto object-contain"
            />
          ))}
        </div>

        {/* Tailwind animation */}
        <style jsx>{`
          @keyframes scroll {
            from {
              transform: translateX(0%);
            }
            to {
              transform: translateX(-50%);
            }
          }

          .animate-scroll {
            animation: scroll 15s linear infinite;
          }

          .paused {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </section>
  )
}

export default CustomerReviews
