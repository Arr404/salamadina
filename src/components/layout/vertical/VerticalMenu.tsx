import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'
import CustomChip from '@core/components/mui/Chip'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {

  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: 'bs-full overflow-y-auto overflow-x-hidden',
          onScroll: container => scrollMenu(container, false)
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: container => scrollMenu(container, true)
        })}
    >
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {/* Home */}
        {/*<MenuItem
          href={`/home`}
          icon={<i className='tabler-smart-home' />}
        >
          {dictionary['navigation']?.home || 'Home'}
        </MenuItem>*/}

        {/* Agent */}
        <MenuItem
          href={`/admin/agent`}
          icon={<i className='tabler-users' />}
        >
          {dictionary['navigation']?.agent || 'Agent'}
        </MenuItem>

        {/* Customer Reviews */}
        <MenuItem
          href={`/admin/customers-reviews`}
          icon={<i className='tabler-star' />}
        >
          {dictionary['navigation']?.customersReviews || 'Customers Reviews'}
        </MenuItem>

        {/* Gallery */}
        <MenuItem
          href={`/admin/gallery`}
          icon={<i className='tabler-photo' />}
        >
          {dictionary['navigation']?.gallery || 'Gallery'}
        </MenuItem>

        {/* Packages Section */}
        <MenuSection label={dictionary['navigation']?.packages || 'Packages'}>
          {/* Umrah Package */}
          <MenuItem
            href={`/package/umrah`}
            icon={<i className='tabler-layout-grid' />}
          >
            {dictionary['navigation']?.umrahPackage || 'Umrah Package'}
          </MenuItem>

          {/* Hajj Package */}
          <MenuItem
            href={`/package/haji`}
            icon={<i className='tabler-building-mosque' />}
          >
            {dictionary['navigation']?.hajjPackage || 'Hajj Package'}
          </MenuItem>

          {/* Educational Trip Package */}
          <MenuItem
            href={`/package/edutrip`}
            icon={<i className='tabler-school' />}
          >
            {dictionary['navigation']?.eduTripPackage || 'Educational Trip'}
          </MenuItem>
        </MenuSection>



        {/* About Us Section */}
        <MenuSection label={dictionary['navigation']?.aboutUs || 'About Us'}>
          {/* Company Profile */}
          <MenuItem
            href={`/admin/profile`}
            icon={<i className='tabler-building' />}
          >
            {dictionary['navigation']?.companyProfile || 'Company Profile'}
          </MenuItem>

          {/* Legal Information */}
          <MenuItem
            href={`/admin/legalitas`}
            icon={<i className='tabler-license' />}
          >
            {dictionary['navigation']?.legalInformation || 'Legal Information'}
          </MenuItem>
          {/* Testimonial Videos */}
          <MenuItem
            href={`/admin/testimoni-video`}
            icon={<i className='tabler-video' />}
          >
            {dictionary['navigation']?.testimonialVideos || 'Testimonial Videos'}
          </MenuItem>

          {/* FAQ */}
          <MenuItem
            href={`/admin/faq`}
            icon={<i className='tabler-help-circle' />}
          >
            {dictionary['navigation']?.faq || 'FAQ'}
          </MenuItem>

          {/* Contact Person */}
          {/*<MenuItem
            href={`/admin/contact-person`}
            icon={<i className='tabler-phone' />}
          >
            {dictionary['navigation']?.contactPerson || 'Contact Person'}
          </MenuItem>*/}
        </MenuSection>

      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
