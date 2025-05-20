'use client'
// Next Imports
import Link from 'next/link'
import { SetStateAction, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'

// Styled Component Imports
import { GalleryProvider } from '@/contexts/GalleryContext'
import GalleryManagement from '@views/admin/gallery/AddGallery'
import CustomTextField from '@core/components/mui/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import { useGallery } from '@/hooks/useGallery'
import { GroupPhoto, Photo } from '@/types/gallery'

// Type for GalleryList Props
interface GalleryListProps {
  onEditItem: (id: string | null) => void // `id` should be a string or null
}

const getRandomGroupPhotoSrc = (groupPhotos: GroupPhoto[]): string | undefined => {
  if (groupPhotos.length === 0) return '/images/gallery/3 Februari/IMG-20250205-WA0051.jpg'; // Provide a fallback image
  const randomPhoto = groupPhotos[Math.floor(Math.random() * groupPhotos.length)];
  console.log(randomPhoto);
  if(randomPhoto.imageSrc.slice(0, 6) === 'images') {
    return '/' + randomPhoto.imageSrc;
  }
  return randomPhoto.imageSrc;
};


const GalleryList = ({ onEditItem }: GalleryListProps) => {
  const { photos, filters, isAdmin, loading } = useGallery()
  const [searchTerm, setSearchTerm] = useState<string>('') // State with string type
  const [activeCategory, setActiveCategory] = useState<string>('All Categories') // State with string type
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false) // State with boolean type
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null) // `selectedPhotoId` can be string or null

  const handleCategoryChange = (event: any, newValue: string) => { // New value is string
    setActiveCategory(newValue)
  }

  const handleSearchChange = (e: { target: { value: string } }) => { // Target value is string
    setSearchTerm(e.target.value)
  }

  const handleEditClick = (photoId: string) => { // photoId should be string
    setSelectedPhotoId(photoId)
    setEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false)
    setSelectedPhotoId(null)
  }

  const handleConfirmEdit = () => {
    if (selectedPhotoId) {
      onEditItem(selectedPhotoId) // Pass the selected photo id to the onEditItem callback
    }
    setEditDialogOpen(false)
  }

  // Filter photos based on search term and active category
  const filteredPhotos = photos.filter((photo: Photo) => {
    const matchesSearch = !searchTerm ||
      photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = activeCategory === 'All Categories' || photo.category === activeCategory

    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <Box component="div" display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <CustomTextField
                fullWidth
                placeholder="Search by title, description, or tags..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <i className="tabler-search mr-2" />
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box component="div" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={activeCategory}
                  onChange={handleCategoryChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="gallery categories"
                >
                  {filters.categories.map((category: string) => (
                    <Tab key={category} label={category} value={category} />
                  ))}
                </Tabs>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box component="div" mt={6}>
        <Grid container spacing={4}>
          {filteredPhotos.length > 0 ? (
            filteredPhotos.map((photo: Photo) => (
              <Grid item xs={12} sm={6} md={4} key={photo.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={getRandomGroupPhotoSrc(photo.groupPhotos)}
                    alt={photo.title}
                    sx={{ objectFit: 'cover', backgroundColor: photo.color || '#f5f5f5' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box component="div" display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" component="h3" noWrap>
                        {photo.title}
                      </Typography>
                      {isAdmin && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditClick(photo.id)}
                        >
                          <i className="tabler-edit" />
                        </IconButton>
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 1 }}>
                      {photo.description.length > 100
                        ? `${photo.description.substring(0, 100)}...`
                        : photo.description}
                    </Typography>
                    <Box component="div" display="flex" flexWrap="wrap" gap={1}>
                      <Chip
                        size="small"
                        label={photo.category}
                        color="primary"
                        variant="outlined"
                      />
                      {photo.tags.slice(0, 2).map(tag => (
                        <Chip
                          key={tag}
                          size="small"
                          label={tag}
                          color="default"
                          variant="outlined"
                        />
                      ))}
                      {photo.tags.length > 2 && (
                        <Chip
                          size="small"
                          label={`+${photo.tags.length - 2}`}
                          variant="outlined"
                        />
                      )}
                    </Box>
                    {photo.groupPhotos && photo.groupPhotos.length > 0 && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        {photo.groupPhotos.length} related photo{photo.groupPhotos.length !== 1 ? 's' : ''}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box component="div" textAlign="center" py={4}>
                <i className="tabler-photo-off text-5xl mb-2 text-gray-400" />
                <Typography variant="h6">No photos found</Typography>
                <Typography variant="body2" color="text.secondary">
                  Try changing your search criteria or add new photos to the gallery
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Gallery Item</DialogTitle>
        <DialogContent>
          <Typography>Do you want to edit this gallery item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmEdit}>Edit</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const GalleryPage = () => {
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list') // Correct mode types
  const [editId, setEditId] = useState<string | null>(null) // editId can be string or null

  const handleCreateNew = () => {
    setMode('create')
    setEditId(null)
  }

  const handleEditItem = (id: string | null) => {
    setMode('edit')
    setEditId(id)
  }

  const handleBackToList = () => {
    setMode('list')
    setEditId(null)
  }

  return (
    <GalleryProvider>
      <Grid container spacing={6}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h5'>
            {mode === 'list' ? 'Gallery Management' : mode === 'create' ? 'Create Gallery Item' : 'Edit Gallery Item'}
          </Typography>
          {mode === 'list' ? (
            <Button variant="contained" startIcon={<i className="tabler-plus" />} onClick={handleCreateNew}>
              Add New Photo
            </Button>
          ) : (
            <Button variant="outlined" startIcon={<i className="tabler-arrow-left" />} onClick={handleBackToList}>
              Back to Gallery
            </Button>
          )}
        </Grid>

        {mode === 'list' && (
          <Grid item xs={12}>
            <GalleryList onEditItem={handleEditItem} />
          </Grid>
        )}

        {(mode === 'create' || mode === 'edit') && (
          <Grid item xs={12}>
            <GalleryManagement editId={editId} />
          </Grid>
        )}
      </Grid>
    </GalleryProvider>
  )
}

export default GalleryPage
