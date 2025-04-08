// React Imports
import { Fragment, useEffect, useState } from 'react'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'

// Next Imports
import { usePathname } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'

// Third-party Imports
import classnames from 'classnames'
import {
  useFloating,
  useDismiss,
  useRole,
  useInteractions,
  useHover,
  offset,
  flip,
  size,
  autoUpdate,
  FloatingPortal,
  safePolygon,
  useTransitionStyles
} from '@floating-ui/react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Link from '@components/Link'
import CustomAvatar from '@core/components/mui/Avatar'

type Props = {
  mode: Mode
  isBelowLgScreen: boolean
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
}

type MenuWrapperProps = {
  children: ReactNode
  refs: any
  isBelowLgScreen: boolean
  isOpen: boolean
  getFloatingProps: any
  top: number
  floatingStyles: CSSProperties
  isMounted: boolean
  styles: CSSProperties
}

// Constants
const UmrahReguler = [
  {
    title: 'Promo',
    href: '/umrah'
  },
  {
    title: 'Hemat',
    href: '/umrah'
  },
  {
    title: 'Premium',
    href: '/umrah'
  }
]

const UmrahPlus = [
  {
    title: 'Mesir',
    href: '/umrah'
  },
  {
    title: 'Turki',
    href: '/umrah'
  }
]

const MenuWrapper = (props: MenuWrapperProps) => {
  // Props
  const { children, refs, isBelowLgScreen, isOpen, getFloatingProps, top, floatingStyles, isMounted, styles } = props

  if (!isBelowLgScreen) {
    return (
      <FloatingPortal>
        {isMounted && (
          <div ref={refs.setFloating} className='z-[1201] lg:z-[11]' {...getFloatingProps()} style={floatingStyles}>
            <div
              className='flex gap-8 p-8'
              style={{
                ...styles,
                overflowY: 'auto',
                background: 'var(--mui-palette-background-paper)',
                minWidth: 100,
                borderRadius: 'var(--mui-shape-borderRadius)',
                outline: 0,
                boxShadow: 'var(--mui-shadows-3)',
                maxBlockSize: `calc((var(--vh, 1vh) * 100) - ${top}px)`
              }}
            >
              {children}
            </div>
          </div>
        )}
      </FloatingPortal>
    )
  }

  return (
    <Collapse in={isOpen}>
      <div className='flex flex-col gap-6 mbs-3'>{children}</div>
    </Collapse>
  )
}

const DropdownUmroh = (props: Props) => {
  // Props
  const { isBelowLgScreen, isDrawerOpen, setIsDrawerOpen } = props

  // states
  const [isOpen, setIsOpen] = useState(false)

  // hooks
  const pathname = usePathname()

  const { y, refs, floatingStyles, context } = useFloating<HTMLElement>({
    placement: 'bottom',
    open: isOpen,
    ...(!isBelowLgScreen && { onOpenChange: setIsOpen }),
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(14),
      flip({ padding: 10 }),
      size({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
            minWidth: `${rects.reference.width}px`
          })
        },
        padding: 10
      })
    ]
  })

  // Floating UI Transition Styles
  const { isMounted, styles } = useTransitionStyles(context, {
    // Configure both open and close durations:
    duration: 300,

    initial: {
      opacity: 0,
      transform: 'translateY(10px)'
    },
    open: {
      opacity: 1,
      transform: 'translateY(0px)'
    },
    close: {
      opacity: 0,
      transform: 'translateY(10px)'
    }
  })

  const hover = useHover(context, {
    handleClose: safePolygon({
      blockPointerEvents: true
    }),
    restMs: 25,
    delay: { open: 75 }
  })

  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'menu' })

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, role, hover])

  const Tag = isBelowLgScreen ? 'div' : Fragment

  const handleLinkClick = () => {
    if (isBelowLgScreen) {
      isDrawerOpen && setIsDrawerOpen(false)
    } else {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (!isDrawerOpen && isOpen) {
      setIsOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawerOpen])

  return (
    <Tag {...(isBelowLgScreen && { className: 'flex flex-col' })}>
      <Typography
        component={Link}
        color='text.primary'
        className={classnames(
          'flex items-center gap-2 font-medium plb-3 pli-1.5 hover:text-primary',
          { 'text-primary': ['/front-pages/payment', '/front-pages/pricing', '/front-pages/checkout', '/front-pages/umrah', '/front-pages/umrah/article/package-detail'].includes(pathname) }
        )}
        {...(isBelowLgScreen
          ? { onClick: (e : any) => { e.preventDefault(); setIsOpen(!isOpen); } }
          : { ref: refs.setReference, ...getReferenceProps() })}
      >
        <span>Umroh</span>
        <i className={classnames('text-xl', { 'tabler-chevron-down': !isBelowLgScreen || (isBelowLgScreen && !isOpen), 'tabler-chevron-up': isBelowLgScreen && isOpen })} />
      </Typography>

      <MenuWrapper {...{ refs, isBelowLgScreen, isOpen, getFloatingProps, top: y ? y - window.scrollY : 0, floatingStyles, isMounted, styles }}>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4'>
          {[
            {
              title: 'Umrah Reguler',
              href: '/umrah/reguler',
              icon: 'tabler-layout-grid',
              items: [
                { title: 'Umrah Ceria', href: '/umrah/reguler/ceria' },
                { title: 'Umrah Cermat', href: '/umrah/reguler/cermat' },
                { title: 'Umrah Istimewa', href: '/umrah/reguler/istimewa' }
              ]
            },
            {
              title: 'Umrah Edu Trip',
              href: '/umrah/edu-trip',
              icon: 'tabler-school',
              items: [
                { title: 'Manajemen', href: '/umrah/edu-trip/manajemen' },
                { title: 'Daurah Pelajar', href: '/umrah/edu-trip/daurah-pelajar' }
              ]
            },
            {
              title: 'Umrah Corporate',
              href: '/umrah/corporate',
              icon: 'tabler-building',
              items: [
                { title: 'Bronze', href: '/umrah/corporate/bronze' },
                { title: 'Silver', href: '/umrah/corporate/silver' },
                { title: 'Premium', href: '/umrah/corporate/premium' }
              ]
            },
            {
              title: 'Umrah Plus Mancanegara',
              href: '/umrah/plus',
              icon: 'tabler-world',
              items: [
                { title: 'Turki', href: '/umrah/plus/turki' },
                { title: 'Mesir', href: '/umrah/plus/mesir' }
              ]
            },
            {
              title: 'Umrah Prestige',
              href: '/umrah/prestige',
              icon: 'tabler-crown',
              items: [
                { title: 'Gold', href: '/umrah/prestige/gold' },
                { title: 'Platinum', href: '/umrah/prestige/platinum' }
              ]
            }
          ].map((section, index) => (
            <div key={index} className='space-y-1'>
              <div className='flex flex-col gap-2'>
                <div className='flex gap-3 items-center'>
                  <CustomAvatar variant='rounded' color='primary' skin='light'>
                    <i className={section.icon} />
                  </CustomAvatar>
                  <Link
                    key={index}
                    href={section.href}
                    className={classnames('', { 'text-primary': pathname.includes(section.href) })}
                    onClick={handleLinkClick}
                  >
                    <Typography variant='h6'>{section.title}</Typography>
                  </Link>
                </div>
                {section.items.map((page, idx) => (
                  <Link
                    key={idx}
                    href={page.href}
                    className={classnames('flex items-center gap-3 focus:outline-none hover:text-primary pl-10', { 'text-primary': pathname.includes(page.href) })}
                    onClick={handleLinkClick}
                  >
                    <i className='tabler-circle text-[10px]' />
                    <span>{page.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Standalone Links */}
          <div className='space-y-6'>
            {[{ title: 'Umrah Mandiri', icon: 'tabler-user', href: '/umrah/mandiri' }, { title: 'Umrah Custom/Community', icon: 'tabler-users', href: '/umrah/custom' }].map((link, index) => (
              <Link key={index} href={link.href} className='flex items-center gap-3 hover:text-primary' onClick={handleLinkClick}>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className={link.icon} />
                </CustomAvatar>
                <Typography variant='h6'>{link.title}</Typography>
              </Link>
            ))}
          </div>
        </div>

        {!isBelowLgScreen && (
          <div className='flex bg-backgroundDefault p-2 rounded mt-4 max-w-xs mx-auto'>
            <img src='/images/landing/umrah.jpg' alt='dropdown image' className='rounded w-full h-auto object-cover' />
          </div>
        )}
      </MenuWrapper>
    </Tag>
  )
}

export default DropdownUmroh
