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
      const handleMouseMove = () => {
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
      className="z-10 top-[3.6rem] xl:top-[0rem] relative overflow-hidden rounded-b-[1.5rem] xl:rounded-b-[3rem] flex items-center justify-center text-center min-h-[30vh] md:min-h-[100vh]"
    >
      {/* Background Image with Fallback Gradient */}
    <div
      className="absolute inset-0 w-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/images/landing/umrah-corporate.jpg')`,
        backgroundColor: "#B71E7E",
      }}
      onError={(e) => handleImageError(e)}
    >
      {/* Circular Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-radial from-[#901D57] to-[#B71E7E] opacity-90"></div>
    </div>

    </section>


  )
}

export default HeroSection
