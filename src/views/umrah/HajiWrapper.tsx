'use client'

// React Imports
import {  useEffect } from 'react'

// Component Imports
import PackageHeader from './PackageHeader'
import Package from './Package'
import { useSettings } from '@core/hooks/useSettings'
import PackageFilter from '@views/umrah/PackageFilter'


const HajiWrapper = (
  {packageType,selectedPackageTypeProps}:
  {packageType:string,selectedPackageTypeProps?:string}
) => {
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
      <PackageHeader title={'Haji Packages'} />
      <PackageFilter packageType={packageType} selectedPackageTypeProps={selectedPackageTypeProps} tipePaket={'hajiPackages'}/>
    </>
  )
}

export default HajiWrapper
