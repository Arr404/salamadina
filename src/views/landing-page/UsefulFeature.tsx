// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import {  Users, CalendarCheck, MapPin, BookOpen } from "lucide-react";

import { useIntersection } from '@/hooks/useIntersection'

import User from '@assets/svg/front-pages/landing-page/User'
import Rocket from '@assets/svg/front-pages/landing-page/Rocket'

/*// SVG Imports
import Paper from '@assets/svg/front-pages/landing-page/Paper'
import Check from '@assets/svg/front-pages/landing-page/Check'
import User from '@assets/svg/front-pages/landing-page/User'
import LaptopCharging from '@assets/svg/front-pages/landing-page/LaptopCharging'
import Rocket from '@assets/svg/front-pages/landing-page/Rocket'
import Document from '@assets/svg/front-pages/landing-page/Document'*/


// Styles Imports
import frontCommonStyles from '@views/styles.module.css'

// Data
const feature = [
  {
    icon: <User color='var(--mui-palette-primary-main)' />,
    title: 'Hajj Guidance',
    description: 'Comprehensive step-by-step guidance for a smooth and spiritually fulfilling Hajj journey.'
  },
  {
    icon: <Rocket color='var(--mui-palette-primary-main)' />,
    title: 'Umrah Packages',
    description: 'Tailored Umrah packages that suit different budgets, ensuring comfort and convenience.'
  },
  {
    icon: <CalendarCheck  width={64}
                          height={64} color='var(--mui-palette-primary-main)' />,
    title: 'Flexible Booking',
    description: 'Easily schedule your Hajj or Umrah trip with flexible dates and reliable services.'
  },
  {
    icon: <MapPin width={64}
                  height={64} color='var(--mui-palette-primary-main)' />,
    title: 'Guided Tours',
    description: 'Explore the holy cities with expert guides who provide historical and spiritual insights.'
  },
  {
    icon: <Users width={64}
                 height={64} color='var(--mui-palette-primary-main)' />,
    title: 'Group & Family Plans',
    description: 'Special discounts and tailored services for families and group travelers.'
  },
  {
    icon: <BookOpen width={64}
                    height={64} color='var(--mui-palette-primary-main)' />,
    title: 'Educational Resources',
    description: 'Access to books, videos, and live sessions to prepare for your pilgrimage.'
  }
];

const UsefulFeature = () => {
  // Refs
  const skipIntersection = useRef(true)
  const ref = useRef<null | HTMLDivElement>(null)

  // Hooks
  const { updateIntersections } = useIntersection()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (skipIntersection.current) {
          skipIntersection.current = false

          return
        }

        updateIntersections({ [entry.target.id]: entry.isIntersecting })
      },
      { threshold: 0.35 }
    )

    ref.current && observer.observe(ref.current as HTMLDivElement)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id='features' ref={ref} className='bg-backgroundPaper'>
      <div className={classnames('flex flex-col gap-12 pbs-12 pbe-[100px]', frontCommonStyles.layoutSpacing)}>
        <div className='flex flex-col gap-y-4 items-center justify-center'>
          <Chip size='small' variant='tonal' color='primary' label='Useful Feature' />
          <div className='flex flex-col items-center gap-y-1 justify-center flex-wrap'>
            <div className='flex items-center gap-x-2'>
              <Typography color='text.primary' variant='h4' className='text-center'>
                <span className='relative z-[1] font-extrabold'>
                  Untukmu
                  <img
                    src='/images/landing/bg-shape.png'
                    alt='bg-shape'
                    className='absolute block-end-0 z-[1] bs-[40%] is-[125%] sm:is-[132%] -inline-start-[13%] sm:inline-start-[-19%] block-start-[17px]'
                  />
                </span>{' '}
                Sahabat Salam
              </Typography>
            </div>
            <Typography className='text-center'>
              Not just a set of tools, the package includes ready-to-deploy conceptual application.
            </Typography>
          </div>
        </div>
        <div>
          <Grid container spacing={6}>
            {feature.map((item, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <div className='flex flex-col gap-2 justify-center items-center'>
                  {item.icon}
                  <Typography className='mbs-2' variant='h5'>
                    {item.title}
                  </Typography>
                  <Typography className='max-is-[364px] text-center'>{item.description}</Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </section>
  )
}

export default UsefulFeature
