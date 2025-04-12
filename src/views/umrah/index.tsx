'use client'

// React Imports
import {  useEffect } from 'react'

// Component Imports
import PackageHeader from './PackageHeader'
import Package from './Package'
import { useSettings } from '@core/hooks/useSettings'
import PackageFilter from '@views/umrah/PackageFilter'


const UmrahWrapper = () => {
/*  // States
  const [searchValue, setSearchValue] = useState('')*/

  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <PackageHeader />
      <PackageFilter tipePaket={'umrahPackages'}/>
    </>
  )
}

export default UmrahWrapper
