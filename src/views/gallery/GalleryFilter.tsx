import React, { useState } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GroupPhoto {
  color: string;
  caption: string;
}

interface Photo {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  group: string;
  groupPhotos: GroupPhoto[];
  color: string;
}

const photos: Photo[] = [
  {
    id: 1,
    title: 'Masjid Al-Haram',
    category: 'Makkah',
    description: 'The Great Mosque of Mecca',
    tags: ['architecture', 'spiritual', 'holy'],
    group: 'makkah-series',
    groupPhotos: [
      { color: 'hsl(340, 70%, 75%)', caption: 'External View' },
      { color: 'hsl(350, 70%, 75%)', caption: 'Interior View' },
      { color: 'hsl(360, 70%, 75%)', caption: 'Night View' },
    ]
  },
  {
    id: 2,
    title: 'Masjid Nabawi',
    category: 'Madinah',
    description: "The Prophet's Mosque",
    tags: ['historical', 'spiritual', 'architecture'],
    group: 'madinah-series',
    groupPhotos: [
      { color: 'hsl(120, 70%, 75%)', caption: 'Main Entrance' },
      { color: 'hsl(140, 70%, 75%)', caption: 'Green Dome' },
      { color: 'hsl(160, 70%, 75%)', caption: 'Prayer Hall' },
    ]
  },
  {
    id: 3,
    title: 'Mount Uhud',
    category: 'Landmarks',
    description: 'Historical battlefield site',
    tags: ['nature', 'historical'],
    group: 'landmarks-series',
    groupPhotos: [
      { color: 'hsl(220, 70%, 75%)', caption: 'Panoramic View' },
      { color: 'hsl(240, 70%, 75%)', caption: 'Sunset View' },
      { color: 'hsl(260, 70%, 75%)', caption: 'Historical Markers' },
    ]
  }
].map(photo => ({
  ...photo,
  color: `hsl(${Math.random() * 360}, 70%, 75%)`
}));

const filters = {
  categories: ['All Categories', 'Makkah', 'Madinah', 'Landmarks'],
  tags: ['All Tags', 'architecture', 'spiritual', 'historical', 'nature', 'holy'],
};

const PhotoCard: React.FC<{ photo: Photo; onClick: () => void }> = ({ photo, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg"
      onClick={onClick}
    >
      <div className="aspect-square w-full" style={{ backgroundColor: photo.color }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-bold">{photo.title}</h3>
          <p className="text-sm opacity-90">{photo.description}</p>
          <div className="flex gap-2 mt-2">
            {photo.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 bg-white/20 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Carousel: React.FC<{ photos: GroupPhoto[]; currentIndex: number; setCurrentIndex: (index: number | ((prev: number) => number)) => void; onClose: () => void }> = ({ photos, currentIndex, setCurrentIndex, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 z-50">
        <span className="absolute top-2 right-2 bg-gray-800 text-white w-8 h-8 flex items-center justify-center rounded-full">X</span>
      </button>

      <button
        onClick={() => setCurrentIndex((prev ):number => (prev > 0 ? prev - 1 : photos.length - 1))}
        className="absolute left-4 text-white hover:text-gray-300 p-2 rounded-full bg-black/50"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
        className="absolute right-4 text-white hover:text-gray-300 p-2 rounded-full bg-black/50"
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
          <div className="aspect-video w-full rounded-lg overflow-hidden" style={{ backgroundColor: photos[currentIndex].color }} />
          <div className="mt-4 text-white text-center">
            <p className="text-xl font-medium">{photos[currentIndex].caption}</p>
            <p className="text-sm text-gray-300 mt-2">{currentIndex + 1} of {photos.length}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default function PhotoGallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedTag, setSelectedTag] = useState('All Tags');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<any>(0);

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || photo.category === selectedCategory;
    const matchesTag = selectedTag === 'All Tags' || photo.tags.includes(selectedTag);
    return matchesSearch && matchesCategory && matchesTag;
  });

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
}
