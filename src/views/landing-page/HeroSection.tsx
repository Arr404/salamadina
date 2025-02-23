'use client'
// React Imports
import { useState, useEffect } from 'react'
import Image from "next/image";

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'
import CustomIconButton from '@core/components/mui/IconButton'


const HeroSection = () => {
  // States
  const [transform, setTransform] = useState('')

  const isAboveLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleMouseMove = (event: MouseEvent) => {
        const rotateX = (window.innerHeight - 2 * event.clientY) / 100
        const rotateY = (window.innerWidth - 2 * event.clientX) / 100

        setTransform(
          `perspective(1200px) rotateX(${rotateX < -40 ? -20 : rotateX}deg) rotateY(${rotateY}deg) scale3d(1,1,1)`
        )
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
      className="top-[-3rem] relative overflow-hidden pbs-[75px] -mbs-[75px] rounded-b-[1.5rem] xl:rounded-b-[3rem] flex items-center justify-center text-center min-h-[600px] xl:min-h-[664px]"
    >
      {/* Background Image with Fallback Gradient */}
      <div
        className=" absolute inset-0 rounded-b-xl bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/logo.png')`, // Change this to your actual image
          backgroundColor: "#B71E7E", // Base color in case the image takes time to load
        }}
        onError={(e) => (e.currentTarget.style.backgroundImage = "none")}
      >
        {/* Circular Gradient Overlay */}
        <div className="top-[-2.5rem] absolute bg-gradient-radial from-[#901D57] to-[#B71E7E] rounded-b-3xl opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-lg p-8">
        <Image
          src="/logo-landscape.png" // Update this to the correct path if needed
          alt="Logo"
          width={400} // Adjust based on the original text size
          height={100} // Adjust based on aspect ratio
          className="sm:w-[400px] w-[250px] object-contain"
          priority // Ensures the image loads quickly
        />
        <Typography className="font-medium text-white max-w-lg mx-auto">

        </Typography>
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
    </section>


  )
}

export default HeroSection
