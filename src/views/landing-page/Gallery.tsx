'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Link from 'next/link'

type Categories = {
  [category: string]: string[]
}

// Organize images into categories based on their folder paths
const organizeImagesByCategory = (images: string[]): Categories => {
  const categories: Categories = {}

  images.forEach((img) => {
    const parts = img.split('/')
    if (parts.length >= 3) {
      const category = parts[2]
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(img)
    }
  })

  return categories
}

const GalleryLanding = ({ images }: { images: string[] }) => {
  const [currentCategory, setCurrentCategory] = useState<string>('')
  const [displayImages, setDisplayImages] = useState<string[]>([])
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [categories, setCategories] = useState<Categories>({})
  const [categoryList, setCategoryList] = useState<string[]>([])
  const [animationDirection, setAnimationDirection] = useState<number>(1)

  useEffect(() => {
    if (!images || images.length === 0) return

    const categorizedImages = organizeImagesByCategory(images)
    setCategories(categorizedImages)

    const catList = Object.keys(categorizedImages)
    setCategoryList(catList)

    if (catList.length > 0) {
      setCurrentCategory(catList[0])
      setDisplayImages(categorizedImages[catList[0]].slice(0, 8))
    }
  }, [images])

  const changeCategory = (category: string) => {
    setAnimationDirection(1)
    setCurrentCategory(category)
    setDisplayImages(categories[category].slice(0, 8))
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const navigateLightbox = (direction: number) => {
    const categoryImages = categories[currentCategory]
    const newIndex =
      (currentImageIndex + direction + categoryImages.length) % categoryImages.length
    setCurrentImageIndex(newIndex)
  }

  const rotateImages = (direction: number) => {
    setAnimationDirection(direction)
    const categoryImages = categories[currentCategory]

    if (direction > 0) {
      const nextBatch: string[] = []
      const startIndex = (categoryImages.indexOf(displayImages[displayImages.length - 1]) + 1) % categoryImages.length
      for (let i = 0; i < 8; i++) {
        const index = (startIndex + i) % categoryImages.length
        nextBatch.push(categoryImages[index])
      }
      setDisplayImages(nextBatch)
    } else {
      const prevBatch: string[] = []
      const startIndex = (categoryImages.indexOf(displayImages[0]) - 8 + categoryImages.length) % categoryImages.length
      for (let i = 0; i < 8; i++) {
        const index = (startIndex + i) % categoryImages.length
        prevBatch.push(categoryImages[index])
      }
      setDisplayImages(prevBatch)
    }
  }

  const formatImageName = (path: string) => {
    const name = path.split('/').pop() || ''
    return name.length > 30 ? name.substring(0, 30) + '...' : name
  }

  return (
    <section id="gallery" className="relative py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Chip size="small" color="primary" className="mb-3 text-white bg-[#811745]" label="Gallery" />
          <Typography variant="h4" className="font-bold mb-3">
            Explore Our <span className="text-yellow-600">Photo Gallery</span>
          </Typography>
          <Typography variant="body1" className="text-gray-600 max-w-xl mx-auto">
            Browse through our collection of memorable moments and experiences.
          </Typography>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categoryList.map((category) => (
            <button
              key={category}
              onClick={() => changeCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                currentCategory === category
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="relative h-[500px] overflow-hidden rounded-xl mx-[10vw]">
          <button
            onClick={() => rotateImages(-1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white w-10 h-10 flex items-center justify-center rounded-full z-10 hover:bg-black/70 transition-colors"
            aria-label="Previous images"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => rotateImages(1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white w-10 h-10 flex items-center justify-center rounded-full z-10 hover:bg-black/70 transition-colors"
            aria-label="Next images"
          >
            <ChevronRight size={24} />
          </button>

          <AnimatePresence initial={false} custom={animationDirection}>
            <motion.div
              key={displayImages.join('')}
              className="grid grid-cols-2 md:grid-cols-3 gap-3 h-full"
              initial={{ x: animationDirection > 0 ? '100%' : '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: animationDirection > 0 ? '-100%' : '100%', opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              {displayImages.map((img, index) => (
                <div
                  key={img}
                  className={`relative overflow-hidden rounded-lg ${
                    index === 0 || index === 7 ? 'md:row-span-2' : ''
                  }`}
                >
                  <img
                    src={img}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <button
                    onClick={() =>
                      openLightbox(categories[currentCategory]?.indexOf(img) ?? 0)
                    }
                    className="absolute inset-0 flex items-center justify-center opacity-0 bg-black bg-opacity-50 text-white text-sm font-medium transition-opacity hover:opacity-100"
                  >
                    <span className="px-3 py-1 bg-black/70 rounded-md">
                      {formatImageName(img)}
                    </span>
                  </button>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link href="/gallery">
          <button className="px-6 py-2 bg-yellow-600 text-white rounded-full shadow-md hover:bg-yellow-700 transition-colors">
            View All Photos
          </button>
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && categories[currentCategory] && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightboxOpen(false)
            }}
            className="absolute top-4 right-4 text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors duration-200 shadow-lg z-50"
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateLightbox(-1)
            }}
            className="absolute left-4 text-white hover:text-gray-300 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-200"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateLightbox(1)
            }}
            className="absolute right-4 text-white hover:text-gray-300 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-200"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-800">
                <img
                  src={categories[currentCategory][currentImageIndex]}
                  alt={`Gallery image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-4 text-white text-center">
                <p className="text-xl font-medium">
                  {formatImageName(categories[currentCategory][currentImageIndex])}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  {currentImageIndex + 1} of {categories[currentCategory].length}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}

export default GalleryLanding
