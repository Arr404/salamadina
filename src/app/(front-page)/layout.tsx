'use client'

import { useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports

import 'aos/dist/aos.css'

import type { ChildrenType } from '@core/types'

// Context Imports
import { IntersectionProvider } from '@/contexts/intersectionContext'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import FrontLayout from '@components/layout/front-pages'
import ScrollToTop from '@core/components/scroll-to-top'

const AOS = require('aos')


// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'


const Layout = ({ children }: ChildrenType) => {
  useEffect(() => {
    AOS.init?.({
      once: true,
      duration: 700,
      easing: 'ease-out-cubic',
    })
  })

  return (

        <Providers direction='ltr'>
            <BlankLayout >
              <IntersectionProvider>
                <FrontLayout>
                  {children}
                  <ScrollToTop className='mui-fixed'>
                    <Button
                      variant='contained'
                      className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
                    >
                      <i className='tabler-arrow-up' />
                    </Button>
                  </ScrollToTop>
                </FrontLayout>
              </IntersectionProvider>
            </BlankLayout>
        </Providers>
  )
}

export default Layout
