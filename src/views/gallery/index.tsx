'use client'

// React Imports
import {  useEffect } from 'react'

// Component Imports
import GalleryHeader from './GalleryHeader'
import { useSettings } from '@core/hooks/useSettings'
import PhotoGallery from '@views/gallery/GalleryFilter'
import { GalleryProvider } from '@/contexts/GalleryContext'


const GalleryWrapper = () => {
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
      <GalleryHeader />
      <GalleryProvider>
        <PhotoGallery/>
      </GalleryProvider>
    </>
  )
}

export default GalleryWrapper
