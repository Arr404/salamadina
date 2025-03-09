'use client'

// React Imports
import type { SyntheticEvent} from 'react';
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'



const HeroSection = () => {
  // States
 /* const [transform, setTransform] = useState('')

  const isAboveLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))*/
  const [isImageEror, setIsImageError] = useState<boolean>(false)

  const handleImageError = (e : SyntheticEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundImage = "none"
    setIsImageError(true)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleMouseMove = (event: MouseEvent) => {
        console.log(event)

        /*const rotateX = (window.innerHeight - 2 * event.clientY) / 100
        const rotateY = (window.innerWidth - 2 * event.clientX) / 100
*/
        /*setTransform(
          `perspective(1200px) rotateX(${rotateX < -40 ? -20 : rotateX}deg) rotateY(${rotateY}deg) scale3d(1,1,1)`
        )*/
      }

      window.addEventListener('mousemove', handleMouseMove)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  return (
    <section
      id="home"
      className="mb-24 top-[3.6rem] xl:top-[0rem] relative overflow-hidden pbs-[75px] -mbs-[75px] rounded-b-[1.5rem] xl:rounded-b-[3rem] flex items-center justify-center text-center min-h-[200px] md:min-h-[800px]"
    >
      {/* Background Image with Fallback Gradient */}
      <div
        className="absolute  inset-0 h-full rounded-b-xl bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/landing/umrah-corporate.jpg')`,
          backgroundColor: "#B71E7E",
        }}
        onError={(e) => handleImageError(e)}
      >
        {/* Circular Gradient Overlay */}
        <div
          className="top-[-2.5rem] absolute h-full w-full bg-gradient-radial from-[#901D57] to-[#B71E7E] rounded-b-3xl opacity-90"></div>
      </div>


      {/* Content */}
      <div className="relative max-w-lg p-8">
        {isImageEror ? (
          <div>
            <img
              src="/images/logos-landscape.png"
              alt="Logo"
              width="400"
              height="100"
              className="sm:w-[400px] w-[250px] object-contain"
            />
            <div className="flex mbs-6 items-baseline justify-center">
              <Button
                component={Link}
                variant='outlined'
                href="https:wa.me/62800000000"
                startIcon={<i className='tabler-user-search text-xl' />}
                className='bg-white whitespace-nowrap'
                target='_blank'
              >
                Contact Us
              </Button>
            </div>
          </div>
        ) : (
          <></>
        )}

        <Typography className="font-medium text-white max-w-lg mx-auto">

        </Typography>

      </div>
    </section>


  )
}

export default HeroSection
