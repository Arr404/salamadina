'use client'

// React Imports
import React, { useState, useEffect } from 'react'

// MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Rating from '@mui/material/Rating'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { toast } from 'react-toastify'
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'

// Firebase Import (assuming you have this configured)
import { db } from '@/services/init'
import { uploadImage } from '@/services/cloudinary'
// Type Imports
import { Testimonial } from '@/types/testimonial'
import Image from 'next/image'
import { ImagePlus as AddPhotoAlternateIcon } from 'lucide-react'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`testimonial-tabpanel-${index}`}
      aria-labelledby={`testimonial-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const TestimonialManagement = () => {
  // States
  const [tabValue, setTabValue] = useState(0)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [dialogLanguage, setDialogLanguage] = useState<'en' | 'ind'>('en')
  const [avatarImage, setAvatarImage] = useState<string>('/images/avatars/1.png')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState<Testimonial>({
    name: '',
    position: '',
    avatarSrc: '/images/avatars/1.png',
    rating: 5,
    desc: {
      en: '',
      ind: ''
    }
  })

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  // Fetch testimonials from Firestore
  const fetchTestimonials = async () => {
    try {
      const testimonialsCollection = collection(db, 'testimonials')
      const testimonialsSnapshot = await getDocs(testimonialsCollection)
      const testimonialsList: Testimonial[] = []

      testimonialsSnapshot.forEach((doc) => {
        testimonialsList.push({ id: doc.id, ...doc.data() } as Testimonial)
      })

      setTestimonials(testimonialsList)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      toast.error('Failed to fetch testimonials')
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Open dialog for creating new testimonial
  const handleAddTestimonial = () => {
    setFormData({
      name: '',
      position: '',
      avatarSrc: '/images/avatars/1.png',
      rating: 5,
      desc: {
        en: '',
        ind: ''
      }
    })
    setAvatarImage('/images/avatars/1.png')
    setIsEditing(false)
    setOpenDialog(true)
  }

  // Open dialog for editing existing testimonial
  const handleEditTestimonial = (testimonial: Testimonial) => {
    setFormData({ ...testimonial })
    setAvatarImage(testimonial.avatarSrc || '/images/avatars/1.png')
    setIsEditing(true)
    setOpenDialog(true)
  }

  // Image upload handler
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      try {
        setUploading(true)
        setUploadProgress(0)

        const file = event.target.files[0]

        // Simulating upload progress - in a real app, you'd get this from your upload service
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 300)

        // Upload image to Cloudinary
        const uploadResult = await uploadImage(file)

        // Clear interval and set progress to 100%
        clearInterval(progressInterval)
        setUploadProgress(100)

        // Update state with the new image URL
        setAvatarImage(uploadResult.secure_url)
        setFormData(prev => ({ ...prev, avatarSrc: uploadResult.secure_url }))

        setTimeout(() => {
          setUploading(false)
          setUploadProgress(0)
        }, 500)

      } catch (error) {
        console.error('Error uploading image:', error)
        toast.error('Failed to upload image')
        setUploading(false)
        setUploadProgress(0)
      }
    }
  }

  // View testimonial details
  const handleViewTestimonial = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial)
  }

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false)
    setCurrentTestimonial(null)
  }

  // Save testimonial (create or update)
  const handleSaveTestimonial = async () => {
    try {
      if (isEditing && formData.id) {
        // Update existing testimonial
        const testimonialRef = doc(db, 'testimonials', formData.id)
        await updateDoc(testimonialRef, {
          name: formData.name,
          position: formData.position,
          avatarSrc: formData.avatarSrc,
          rating: formData.rating,
          desc: formData.desc,
          updatedAt: new Date()
        })
        toast.success('Testimonial updated successfully')
      } else {
        // Create new testimonial
        await addDoc(collection(db, 'testimonials'), {
          name: formData.name,
          position: formData.position,
          avatarSrc: formData.avatarSrc,
          rating: formData.rating,
          desc: formData.desc,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        toast.success('Testimonial added successfully')
      }

      handleCloseDialog()
      fetchTestimonials()
    } catch (error) {
      console.error('Error saving testimonial:', error)
      toast.error('Failed to save testimonial')
    }
  }

  // Delete testimonial
  const handleDeleteTestimonial = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteDoc(doc(db, 'testimonials', id))
        toast.success('Testimonial deleted successfully')
        fetchTestimonials()
      } catch (error) {
        console.error('Error deleting testimonial:', error)
        toast.error('Failed to delete testimonial')
      }
    }
  }

  // Toggle language in dialog
  const handleToggleLanguage = () => {
    setDialogLanguage(dialogLanguage === 'en' ? 'ind' : 'en')
  }

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h6" component="h2">
              Testimonial Management
            </Typography>
            <Button variant="contained" onClick={handleAddTestimonial} startIcon={<i className="tabler-plus" />}>
              Add Testimonial
            </Button>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="testimonial management tabs">
              <Tab label="All Testimonials" />
              <Tab label="Preview" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="testimonials table">
                <TableHead>
                  <TableRow>
                    <TableCell>Profile</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell>
                        <CustomAvatar src={testimonial.avatarSrc} alt={testimonial.name} />
                      </TableCell>
                      <TableCell>{testimonial.name}</TableCell>
                      <TableCell>{testimonial.position}</TableCell>
                      <TableCell>
                        <Rating value={testimonial.rating} readOnly />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleViewTestimonial(testimonial)}
                          title="View"
                        >
                          <i className="tabler-eye" />
                        </IconButton>
                        <IconButton
                          color="info"
                          onClick={() => handleEditTestimonial(testimonial)}
                          title="Edit"
                        >
                          <i className="tabler-edit" />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => testimonial.id && handleDeleteTestimonial(testimonial.id)}
                          title="Delete"
                        >
                          <i className="tabler-trash" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {testimonials.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No testimonials found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={6}>
              {testimonials.map((testimonial) => (
                <Grid item xs={12} md={6} key={testimonial.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <CustomAvatar src={testimonial.avatarSrc} alt={testimonial.name} sx={{ mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle1">{testimonial.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.position}
                          </Typography>
                        </Box>
                      </Box>
                      <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                      <Typography variant="body2" paragraph>
                        {testimonial.desc.en}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {testimonials.length === 0 && (
                <Grid item xs={12}>
                  <Typography align="center">No testimonials to preview</Typography>
                </Grid>
              )}
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="flex flex-col">
                <div className="relative h-40 bg-gray-100 rounded-lg mb-2 overflow-hidden">
                  {avatarImage ? (
                    <Image
                      src={avatarImage}
                      alt="Avatar"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/api/placeholder/800/300';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Typography variant="body2" color="textSecondary">No image</Typography>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <CustomTextField
                    fullWidth
                    label="Avatar URL"
                    value={formData.avatarSrc || ''}
                    onChange={(e) => {
                      const url = e.target.value;
                      setAvatarImage(url);
                      setFormData({ ...formData, avatarSrc: url });
                    }}
                  />
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      component="span"
                      variant="contained"
                      color="primary"
                      disabled={uploading}
                      startIcon={<AddPhotoAlternateIcon />}
                    >
                      {uploading ? `${uploadProgress}%` : 'Upload'}
                    </Button>
                  </label>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="testimonial-rating"
                value={formData.rating}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, rating: newValue || 5 })
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography component="legend">Testimonial Description</Typography>
                <Button size="small" onClick={handleToggleLanguage}>
                  Switch to {dialogLanguage === 'en' ? 'Indonesian' : 'English'}
                </Button>
              </Box>
              <CustomTextField
                fullWidth
                multiline
                rows={6}
                label={dialogLanguage === 'en' ? 'English Description' : 'Indonesian Description'}
                value={formData.desc[dialogLanguage]}
                onChange={(e) => setFormData({
                  ...formData,
                  desc: {
                    ...formData.desc,
                    [dialogLanguage]: e.target.value
                  }
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveTestimonial}>
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Testimonial Dialog */}
      {currentTestimonial && (
        <Dialog open={Boolean(currentTestimonial)} onClose={() => setCurrentTestimonial(null)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Testimonial Details
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CustomAvatar src={currentTestimonial.avatarSrc} alt={currentTestimonial.name} sx={{ width: 64, height: 64, mr: 2 }} />
              <Box>
                <Typography variant="h6">{currentTestimonial.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentTestimonial.position}
                </Typography>
                <Rating value={currentTestimonial.rating} readOnly sx={{ mt: 1 }} />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>English</Typography>
            <Typography variant="body2" paragraph>
              {currentTestimonial.desc.en}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>Indonesian</Typography>
            <Typography variant="body2" paragraph>
              {currentTestimonial.desc.ind}
            </Typography>

            {currentTestimonial.createdAt && (
              <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                Created: {new Date(currentTestimonial.createdAt as any).toLocaleString()}
              </Typography>
            )}
            {currentTestimonial.updatedAt && (
              <Typography variant="caption" display="block">
                Last Updated: {new Date(currentTestimonial.updatedAt as any).toLocaleString()}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCurrentTestimonial(null)}>
              Close
            </Button>
            <Button
              color="info"
              variant="contained"
              onClick={() => {
                handleEditTestimonial(currentTestimonial)
                setCurrentTestimonial(null)
              }}
            >
              Edit
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default TestimonialManagement
