'use client'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Link from '@components/Link'
import CustomTextField from '@core/components/mui/TextField'

// Hooks Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/styles.module.css'

// Icons import
import { Instagram as InstagramIcon, Facebook as FacebookIcon, Twitter as TwitterIcon, Youtube as YoutubeIcon, Phone as PhoneIcon } from 'lucide-react'


const Footer = ({ mode }: { mode: Mode }) => {
  // Vars
  const footerImageLight = '/images/footer-bg-light.png'
  const footerImageDark = '/images/footer-bg-dark.png'

  // Hooks
  const dashboardImage = useImageVariant(mode, footerImageLight, footerImageDark)

  return (
    <footer className='max-w-full'>
      <div className='relative bg-[#811745]'>
        <div className={classnames('plb-12 text-white', frontCommonStyles.layoutSpacing)}>
          <Grid container rowSpacing={10} columnSpacing={12}>
            <Grid item xs={12} lg={5}>
              <div className='flex flex-col items-start gap-6'>
                <Link href="/landing">
                  <img
                    src="/images/logo-white.png"
                    alt="Company Logo"
                    height="5"
                    className="w-auto h-[4rem] max-w-full"
                    sizes="(max-width: 768px) 7px, (max-width: 1200px) 24px, 32px"
                  />
                </Link>
                <Typography color="white" className="md:max-is-[390px] opacity-[78]">
                  Jalan Raya Ceweng Kalianyar, Dusun Krajan RT 001 RW 002, Bandung, Diwek, Jombang, Jawa Timur, Kode Pos 61471
                  <br/>No. Telp: 0821-2911-1101
                </Typography>
                <div className='flex gap-4 mt-4'>
                  <Link href="https://instagram.com" className='text-white hover:text-gray-300'>
                    <InstagramIcon fontSize="medium" />
                  </Link>
                  <Link href="https://facebook.com" className='text-white hover:text-gray-300'>
                    <FacebookIcon fontSize="medium" />
                  </Link>
                  <Link href="https://twitter.com" className='text-white hover:text-gray-300'>
                    <TwitterIcon fontSize="medium" />
                  </Link>
                  <Link href="https://youtube.com" className='text-white hover:text-gray-300'>
                    <YoutubeIcon fontSize="medium" />
                  </Link>
                  <Link href="https://wa.me/6282129111101" className='text-white hover:text-gray-300'>
                    <PhoneIcon fontSize="medium" />
                  </Link>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={3} lg={2}>
              <Typography color='white' className='font-medium mbe-6 opacity-[92]'>
                Pages
              </Typography>
              <div className='flex flex-col gap-4'>
                <Typography component={Link} href='/umrah' color='white' className='opacity-[78]'>
                  Umrah
                </Typography>
                <Link href='/haji' className='flex items-center gap-[10px]'>
                  <Typography color='white' className='opacity-[78]'>
                    Hajj
                  </Typography>
                </Link>
                <Typography
                  component={Link}
                  href='/halaltour'
                  color='white'
                  className='opacity-[78]'
                >
                  Edutrip  <Chip label='New' color='primary' size='small' />
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={3} lg={2}>
              <Typography color='white' className='font-medium mbe-6 opacity-[92]'>
                Company
              </Typography>
              <div className='flex flex-col gap-4'>
                <Typography component={Link} href='/profile' color='white' className='opacity-[78]'>
                  About Us
                </Typography>
                <Typography component={Link} href='/legalitas' color='white' className='opacity-[78]'>
                  Legalitas
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Typography color='white' className='font-medium mbe-6 opacity-[92]'>
                Support
              </Typography>
              <div className='flex flex-col gap-4'>
                <Typography component={Link} href='#faq' color='white' className='opacity-[78]'>
                  FAQ
                </Typography>
                <Typography component={Link} href='#getStarted' color='white' className='opacity-[78]'>
                  Contact Us
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>

    </footer>
  )
}

export default Footer
