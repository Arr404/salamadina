import React, { useContext, useState } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryContext } from '@/contexts/GalleryContext';
import { Photo, GroupPhoto } from '@/types/gallery';

const PhotoCard: React.FC<{ photo: Photo; onClick: () => void }> = ({ photo, onClick }) => {
  const [imageError, setImageError] = useState(false);

  // Get a representative image from groupPhotos (first image or random)
  const thumbnailImage = photo.groupPhotos.length > 0 ? photo.groupPhotos[0] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg"
      onClick={onClick}
    >
      <div
        className="aspect-square w-full"
        style={{ backgroundColor: photo.color || thumbnailImage?.color || '#f0f0f0' }}
      >
        {thumbnailImage?.imageSrc && !imageError && (
          <img
            src={thumbnailImage.imageSrc}
            alt={photo.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-bold">{photo.title}</h3>
          <p className="text-sm opacity-90">{photo.description}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {photo.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 bg-white/20 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Carousel: React.FC<{
  photos: GroupPhoto[];
  currentIndex: number;
  setCurrentIndex: (index: number | ((prev: number) => number)) => void;
  onClose: () => void
}> = ({ photos, currentIndex, setCurrentIndex, onClose }) => {
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors duration-200 shadow-lg z-50"
        aria-label="Close gallery"
      >
        <X size={24} />
      </button>

      <button
        onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1))}
        className="absolute left-4 text-white hover:text-gray-300 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-200"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => setCurrentIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0))}
        className="absolute right-4 text-white hover:text-gray-300 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-200"
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl w-full mx-4"
        >
          <div
            className="aspect-video w-full rounded-lg overflow-hidden"
            style={{ backgroundColor: photos[currentIndex]?.color || '#f0f0f0' }}
          >
            {photos[currentIndex]?.imageSrc && !imageError[currentIndex] && (
              <img
                src={photos[currentIndex].imageSrc}
                alt={photos[currentIndex].caption}
                className="w-full h-full object-cover"
                onError={() => handleImageError(currentIndex)}
              />
            )}
          </div>
          <div className="mt-4 text-white text-center">
            <p className="text-xl font-medium">{photos[currentIndex]?.caption}</p>
            <p className="text-sm text-gray-300 mt-2">{currentIndex + 1} of {photos.length}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default function PhotoGallery() {
  const galleryContext = useContext(GalleryContext);

  if (!galleryContext) {
    throw new Error("PhotoGallery must be used within a GalleryProvider");
  }

  const {
    filteredPhotos,
    selectedPhoto,
    currentPhotoIndex,
    searchTerm,
    selectedCategory,
    selectedTag,
    filters,
    setSearchTerm,
    setSelectedCategory,
    setSelectedTag,
    setSelectedPhoto,
    setCurrentPhotoIndex,
    loading,
    error
  } = galleryContext;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 p-4 md:p-8 flex items-center justify-center">
        <div className="text-xl text-rose-700">Loading gallery...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 p-4 md:p-8 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-rose-900 text-center mb-8">Gallery Journal</h1>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search photos..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filters.categories.length > 0 && (
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-rose-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {filters.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            )}

            {filters.tags.length > 0 && (
              <div className="relative">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-rose-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {filters.tags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            )}
          </div>
        </div>

        {/* Photo Grid */}
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={() => {
                setSelectedPhoto(photo);
                setCurrentPhotoIndex(0);
              }}
            />
          ))}
        </motion.div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-lg">
            No photos found matching your criteria
          </div>
        )}

        {/* Carousel Modal */}
        {selectedPhoto && (
          <Carousel
            photos={selectedPhoto.groupPhotos}
            currentIndex={currentPhotoIndex}
            setCurrentIndex={setCurrentPhotoIndex}
            onClose={() => setSelectedPhoto(null)}
          />
        )}
      </div>
    </div>
  );
};
