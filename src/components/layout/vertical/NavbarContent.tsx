// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import LanguageDropdown from '../shared/LanguageDropdown'
import { useState } from 'react'

const NavbarContent = () => {
  const [isLoading, setIsloading] = useState<boolean>(false)

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />

      </div>
      <div className='flex items-center ml-24 gap-4'>
        <LanguageDropdown setIsLoading={setIsloading} />
        <ModeDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
