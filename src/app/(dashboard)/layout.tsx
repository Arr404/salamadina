'use client'

// React Imports
import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

// MUI Imports
import Button from '@mui/material/Button'

// Type Imports
import type { ChildrenType, Mode, SystemMode } from '@core/types'

// Util Imports
import { getMode, getSystemMode } from '@core/utils/serverHelpers'

// Dynamically Import Components
const Providers = dynamic(() => import('@components/Providers'), { ssr: false })
const LayoutWrapper = dynamic(() => import('@layouts/LayoutWrapper'), { ssr: false })
const VerticalLayout = dynamic(() => import('@layouts/VerticalLayout'), { ssr: false })
const HorizontalLayout = dynamic(() => import('@layouts/HorizontalLayout'), { ssr: false })
const Navigation = dynamic(() => import('@components/layout/vertical/Navigation'), { ssr: false })
const Header = dynamic(() => import('@components/layout/horizontal/Header'), { ssr: false })
const Navbar = dynamic(() => import('@components/layout/vertical/Navbar'), { ssr: false })
const VerticalFooter = dynamic(() => import('@components/layout/vertical/Footer'), { ssr: false })
const HorizontalFooter = dynamic(() => import('@components/layout/horizontal/Footer'), { ssr: false })
const ScrollToTop = dynamic(() => import('@core/components/scroll-to-top'), { ssr: false })

const Layout = ({ children }: ChildrenType) => {
  // State for mode and system mode
  const [mode, setMode] = useState<Mode>('light')
  const [systemMode, setSystemMode] = useState<SystemMode>('light')

  useEffect(() => {
    // Fetch mode and systemMode from client-side helpers
    setMode(getMode())
    setSystemMode(getSystemMode())
  }, [])

  // Vars
  const direction = 'ltr'

  return (
    <Providers direction={direction}>
      <LayoutWrapper
        systemMode={systemMode}
        verticalLayout={
          <VerticalLayout
            navigation={<Navigation mode={mode} systemMode={systemMode} />}
            navbar={<Navbar />}
            footer={<VerticalFooter />}
          >
            {children}
          </VerticalLayout>
        }
        horizontalLayout={
          <HorizontalLayout header={<Header />} footer={<HorizontalFooter />}>
            {children}
          </HorizontalLayout>
        }
      />
      <ScrollToTop className='mui-fixed'>
        <Button variant='contained' className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'>
          <i className='tabler-arrow-up' />
        </Button>
      </ScrollToTop>
    </Providers>
  )
}

export default Layout
