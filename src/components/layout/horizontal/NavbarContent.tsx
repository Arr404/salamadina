// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import Logo from '@components/layout/shared/Logo'
import ModeDropdown from '@components/layout/shared/ModeDropdown'


// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'



const NavbarContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <div
      className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}
    >
      <div className='flex items-center gap-4'>
        <NavToggle />
        {/* Hide Logo on Smaller screens */}
        {!isBreakpointReached && (
          <Link href={"/"}>
            <Logo />
          </Link>
        )}
      </div>

      <div className='flex items-center'>
        {/*<LanguageDropdown  setIsLoading={setIsLoading}/>*/}
        <ModeDropdown />
        {/* Language Dropdown, Notification Dropdown, quick access menu dropdown, user dropdown will be placed here */}
      </div>
    </div>
  )
}

export default NavbarContent
