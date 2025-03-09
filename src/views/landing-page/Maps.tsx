"use client";

// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'


import { useIntersection } from '@/hooks/useIntersection'


// Styles Imports
import frontCommonStyles from '@views/styles.module.css'
import IndonesiaMaps from '@assets/svg/IndonesiaMaps'


const Maps = () => {
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
        <div className='flex flex-col gap-y-4 items-center '>
          <Chip size='small' className="text-white bg-[#811745]" variant='tonal' color='primary' label='Agents' />
          <div className='flex flex-col items-center gap-y-1 justify-center flex-wrap'>
            <div className='flex items-center gap-x-2'>
              <Typography  variant='h4' className='text-center text-[#811745]'>
                <span className='text-bold  relative z-[1] font-extrabold'>
                  All Agent

                </span>{' '}
                In Indonesia
              </Typography>
            </div>
            <Typography className='text-center text-[#811745]'>
              Find one near you
            </Typography>
            <div className="mt-12 overflow-hidden">
              <IndonesiaMaps/>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Maps
