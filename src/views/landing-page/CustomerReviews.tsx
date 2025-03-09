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


// Data
const data = [
  {
    desc: "The guidance we received throughout the pilgrimage was exceptional. We were well-informed and felt secure at all times.",
    svg: <Pinterest color='#ee7676' />,
    rating: 5,
    name: 'Eugenia Moore',
    position: '2025',
    avatarSrc: '/images/avatars/1.png'
  },
  {
    desc: "Highly professional and well-organized Umrah services. I will definitely travel with them again in the future.",
    svg: <Netflix color='#d34c4d' />,
    rating: 5,
    name: 'Tommy haffman',
    position: '2025',
    avatarSrc: '/images/avatars/2.png'
  },
  {
    desc: "The guidance we received throughout the pilgrimage was exceptional. We were well-informed and felt secure at all times.",
    svg: <Airbnb color='#FF5A60' />,
    rating: 4,
    name: 'Eugenia Moore',
    position: '2025',
    avatarSrc: '/images/avatars/3.png'
  },
  {
    desc: "The guidance we received throughout the pilgrimage was exceptional. We were well-informed and felt secure at all times.",
    svg: <Coinbase color='#0199ff' />,
    rating: 5,
    name: 'Sara Smith',
    position: '2025',
    avatarSrc: '/images/avatars/4.png'
  },
  {
    desc: "Highly professional and well-organized Umrah services. I will definitely travel with them again in the future.",
    svg: <Dribbble color='#ea4c89' />,
    rating: 5,
    name: 'Tommy haffman',
    position: '2025',
    avatarSrc: '/images/avatars/5.png'
  }
]

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
        <div
          className='flex flex-col gap-1 bs-full justify-center items-center lg:items-start is-full md:is-[30%] mlb-auto sm:pbs-2'>
          <Chip label='Real Customers Reviews' variant='tonal' color='primary' size='small' className='mbe-3' />
          <div className='flex flex-col gap-y-1 flex-wrap max-lg:text-center '>
            <Typography color='text.primary' variant='h4'>
              <span className='relative z-[1] font-extrabold'>
                What people say
                <img
                  src='/images/landing/bg-shape.png'
                  alt='bg-shape'
                  className='absolute block-end-0 z-[1] bs-[40%] is-[132%] inline-start-[-8%] block-start-[17px]'
                />
              </span>
            </Typography>
            <Typography>See what our customers have to say about their experience.</Typography>
          </div>
          <div className='flex gap-x-4 mbs-11'>
            <CustomIconButton color='primary' variant='tonal' onClick={() => instanceRef.current?.prev()}>
              <i className='tabler-chevron-left' />
            </CustomIconButton>
            <CustomIconButton color='primary' variant='tonal' onClick={() => instanceRef.current?.next()}>
              <i className='tabler-chevron-right' />
            </CustomIconButton>
          </div>
        </div>
        <div className='is-full md:is-[70%]'>
          <AppKeenSlider>
            <div ref={sliderRef} className='keen-slider mbe-6'>
              {data.map((item, index) => (
                <div key={index} className='keen-slider__slide flex p-4 sm:p-3'>
                  <Card elevation={8} className='flex items-start'>
                    <CardContent className='p-8 items-center mlb-auto'>
                      <div className='flex flex-col gap-4 items-start'>
                        {/*{item.svg}*/}
                        <Typography>{item.desc}</Typography>
                        <Rating value={item.rating} readOnly />
                        <div className='flex items-center gap-x-3'>
                          <CustomAvatar size={32} src={item.avatarSrc} alt={item.name} />
                          <div className='flex flex-col items-start'>
                            <Typography color='text.primary' className='font-medium'>
                              {item.name}
                            </Typography>
                            <Typography variant='body2' color='text.disabled'>
                              {item.position}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </AppKeenSlider>
        </div>
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
