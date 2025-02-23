'use client'

// React Imports
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import Image from "next/image";

// Next Imports
import Link from 'next/link'

// MUI Imports
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import FrontMenu from './FrontMenu'
import CustomIconButton from '@core/components/mui/IconButton'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import styles from './styles.module.css'
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'

const Header = ({ mode, setIsLoading }: { mode: Mode, setIsLoading: Dispatch<SetStateAction<boolean>> }) => {

  // States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Hooks
  const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  // Detect window scroll
  const trigger = useScrollTrigger({
    threshold: 0,
    disableHysteresis: true
  })

  return (
    <header className={`${classnames(frontLayoutClasses.header, styles.header)} z-10`}>
      <div className={classnames(frontLayoutClasses.navbar, styles.navbar, { [styles.headerScrolled]: trigger })}>
        <div className={classnames(frontLayoutClasses.navbarContent, styles.navbarContent)}>
          {isBelowLgScreen ? (
            <div className='flex items-center gap-2 sm:gap-4'>

              <FrontMenu mode={mode} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
              <Link href='/landing'>
                <Image
                  src="/logo.png"
                  alt="Company Logo"
                  width={10}
                  height={5}
                  sizes="(max-width: 768px) 7px, (max-width: 1200px) 24px, 32px"
                  className="w-auto h-auto max-w-full"
                  priority
                  placeholder="blur"
                  blurDataURL="/logo.png" // Uses the same image for placeholder blur effect
                />
              </Link>
            </div>
          ) : (
            <div className='flex items-center gap-10'>
              <FrontMenu mode={mode} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />

            </div>
          )}
          {isBelowLgScreen ? (
            <></>
          ) : (
            <Link href='/landing'>
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={10}
                height={5}
                sizes="(max-width: 768px) 7px, (max-width: 1200px) 24px, 32px"
                className="w-auto h-auto max-w-full"
                priority
                placeholder="blur"
                blurDataURL="/logo.png" // Uses the same image for placeholder blur effect
              />
            </Link>
          )}

          <div className='flex items-center gap-2 sm:gap-4'>
            <LanguageDropdown setIsLoading={setIsLoading} />
            {isBelowLgScreen ? (
              <>
                <CustomIconButton
                  component={Link}
                  variant='contained'
                  href="https:wa.me/62800000000"
                  color='primary'
                  target='_blank'
                >
                  <i className='tabler-user-search text-xl' />
                </CustomIconButton>
                <IconButton onClick={() => setIsDrawerOpen(true)} className='-mis-2'>
                  <i className='tabler-menu-2 text-textPrimary' />
                </IconButton>
              </>
            ) : (
              <Button
                component={Link}
                variant='contained'
                href="https:wa.me/62800000000"
                startIcon={<i className='tabler-user-search text-xl' />}
                className='whitespace-nowrap'
                target='_blank'
              >
                Contact Us
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
