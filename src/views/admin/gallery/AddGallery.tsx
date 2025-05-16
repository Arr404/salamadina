'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import MuiStep from '@mui/material/Step'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// Third-party Imports
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Context Imports
import { useGallery } from '@/hooks/useGallery'
import { GroupPhoto, Photo } from '@/types/gallery'

// Firebase & Cloudinary Imports
import { uploadImage } from '@/services/cloudinary'
import { Timestamp } from 'firebase/firestore'
import StepperWrapper from '@/@core/styles/stepper'
import CustomAvatar from '@/@core/components/mui/Avatar'
import DirectionalIcon from '@/components/DirectionalIcon'
import classnames from 'classnames'

// Vars
const steps = [
  {
    icon: 'tabler-image',
    title: 'Photo Details',
    subtitle: 'Enter basic photo information'
  },
  {
    icon: 'tabler-category',
    title: 'Categories & Tags',
    subtitle: 'Set categorization data'
  },
  {
    icon: 'tabler-photo',
    title: 'Group Photos',
    subtitle: 'Add related photos'
  }
]

const Step = styled(MuiStep)(({ theme }) => ({
  paddingInline: theme.spacing(7),
  '&:first-of-type': {
    paddingLeft: 0
  },
  '&:last-of-type': {
    paddingRight: 0
  },
  '& .MuiStepLabel-iconContainer': {
    display: 'none'
  },
  '&.Mui-completed .step-title , &.Mui-completed .step-subtitle': {
    color: 'var(--mui-palette-text-disabled)'
  },

  [theme.breakpoints.down('md')]: {
    padding: 0,
    ':not(:last-of-type)': {
      marginBlockEnd: theme.spacing(6)
    }
  }
}))

const GalleryManagement = ({ editId = null }: { editId?: string | null }) => {
  // Get gallery context (from useGallery)
  const {
    photos,
    addPhoto,
    updatePhoto,
    deletePhoto,
    isAdmin,
    setEditingPhoto,
    filters
  } = useGallery()

  // States
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Photo & {
    newTag?: string;
    currentGroupPhotoFile?: File | null;
    currentGroupPhotoImageSrc?: string;
    currentGroupPhotoCaption?: string;
  }>({
    id: '',
    title: '',
    description: '',
    color: `hsl(${Math.random() * 360}, 70%, 75%)`,
    category: '',
    tags: [],
    group: '',
    groupPhotos: [],
    dateAdded: Timestamp.now(),
  })

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  // Fetch photo data if in edit mode
  useEffect(() => {
    const fetchPhotoData = async () => {
      if (editId) {
        setLoading(true)
        setIsEditing(true)
        try {
          // Find the photo in the photos array
          const photoToEdit = photos.find(photo => photo.id === editId)

          if (photoToEdit) {
            setFormData({
              ...photoToEdit,
              newTag: '',
              currentGroupPhotoCaption: ''
            })
            // Also set the editing photo in the context
            setEditingPhoto(photoToEdit)
          } else {
            toast.error('Photo not found')
          }
        } catch (error) {
          console.error('Error fetching photo:', error)
          toast.error('Failed to fetch photo data')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchPhotoData()
  }, [editId, photos, setEditingPhoto])

  const handleReset = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      color: `hsl(${Math.random() * 360}, 70%, 75%)`,
      category: '',
      tags: [],
      group: '',
      groupPhotos: [],
      dateAdded: Timestamp.now(),
      newTag: '',
    })
    setActiveStep(0)
    setIsEditing(false)
    setEditingPhoto(null)
  }

  const handleDelete = async () => {
    if (!formData.id) return

    setLoading(true)
    try {
      await deletePhoto(formData.id)

      toast.success('Gallery photo deleted successfully!')
      handleReset()
    } catch (error) {
      console.error('Error deleting photo:', error)
      toast.error('Failed to delete gallery photo. Please try again.')
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        setLoading(true)


        const groupPhotos = [...formData.groupPhotos]

        if (isEditing) {
          const photoData: Partial<Photo> = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            tags: formData.tags,
            group: formData.group,
            color: formData.color,
            groupPhotos
          }

          await updatePhoto(formData.id, photoData)
          toast.success('Gallery photo updated successfully!')
        } else {
          // Create new photo
          const newPhotoData = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            tags: formData.tags,
            group: formData.group,
            color: formData.color,
            groupPhotos
          }

          await addPhoto(newPhotoData)
          toast.success('Gallery photo added successfully!')
        }

        handleReset()
      } catch (error) {
        console.error('Error saving photo:', error)
        toast.error('Failed to save gallery photo. Please try again.')
      } finally {
        setLoading(false)
      }
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const addTag = () => {
    if (formData.newTag && !formData.tags.includes(formData.newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag],
        newTag: ''
      })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }


  const handleGroupPhotoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData({
        ...formData,
        currentGroupPhotoFile: file,
        currentGroupPhotoImageSrc: URL.createObjectURL(file)
      })
    }
  }

  const addGroupPhoto = async () => {
    if (formData.currentGroupPhotoCaption && (formData.currentGroupPhotoFile || formData.currentGroupPhotoImageSrc)) {
      try {
        setLoading(true)

        let imageSrc = formData.currentGroupPhotoImageSrc || ''
        if (formData.currentGroupPhotoFile) {
          const cloudinaryImageSrc = await uploadImage(formData.currentGroupPhotoFile)
          imageSrc = cloudinaryImageSrc.secure_url
        }

        const newGroupPhoto: GroupPhoto = {
          id: uuidv4(),
          caption: formData.currentGroupPhotoCaption || '',
          imageSrc,
          color: `hsl(${Math.random() * 360}, 70%, 75%)`
        }

        setFormData({
          ...formData,
          groupPhotos: [...formData.groupPhotos, newGroupPhoto],
          currentGroupPhotoCaption: '',
          currentGroupPhotoFile: null,
          currentGroupPhotoImageSrc: ''
        })
      } catch (error) {
        console.error('Error adding group photo:', error)
        toast.error('Failed to upload group photo image.')
      } finally {
        setLoading(false)
      }
    }
  }

  const removeGroupPhoto = (index: number) => {
    const updatedGroupPhotos = [...formData.groupPhotos]
    updatedGroupPhotos.splice(index, 1)
    setFormData({
      ...formData,
      groupPhotos: updatedGroupPhotos
    })
  }

  const renderStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='Title'
                placeholder='Enter photo title'
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='Color (optional)'
                placeholder='hsl(270, 70%, 75%)'
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
                helperText="Color theme for this photo"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          backgroundColor: formData.color
                        }}
                      />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                multiline
                rows={4}
                label='Description'
                placeholder='Enter photo description'
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Grid>
          </>
        )
      case 1:
        return (
          <>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Category'
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <MenuItem value=''>Select Category</MenuItem>
                {filters.categories
                  .filter(cat => cat !== 'All Categories')
                  .map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                <MenuItem value='new-category'>
                  <Typography color='primary'>+ Add New Category</Typography>
                </MenuItem>
              </CustomTextField>
            </Grid>
            {formData.category === 'new-category' && (
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='New Category'
                  placeholder='Enter new category name'
                  value={formData.category === 'new-category' ? '' : formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Group (optional)'
                placeholder='Enter group name'
                value={formData.group}
                onChange={e => setFormData({ ...formData, group: e.target.value })}
                helperText="Group photos by theme or event"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography className='mb-2' variant='body2'>
                Tags
              </Typography>
              <div className='flex flex-wrap gap-2 mb-2'>
                {formData.tags.map(tag => (
                  <div
                    key={tag}
                    className='px-3 py-1 rounded-full bg-primary-100 flex items-center gap-2'
                  >
                    <span>{tag}</span>
                    <i
                      className='tabler-x cursor-pointer'
                      onClick={() => removeTag(tag)}
                    />
                  </div>
                ))}
              </div>
              <div className='flex gap-2'>
                <CustomTextField
                  fullWidth
                  label='Add Tag'
                  placeholder='Enter new tag'
                  value={formData.newTag || ''}
                  onChange={e => setFormData({ ...formData, newTag: e.target.value })}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button variant='contained' onClick={addTag}>
                  Add
                </Button>
              </div>
            </Grid>
          </>
        )
      case 2:
        return (
          <>
            <Grid item xs={12}>
              <Typography variant='body2' className='mb-2'>
                Add Group Photos (Optional)
              </Typography>
              {formData.groupPhotos.length > 0 && (
                <div className='mb-4'>
                  <Typography variant='subtitle2' className='mb-2'>
                    Current Group Photos:
                  </Typography>
                  <div className='flex flex-wrap gap-4'>
                    {formData.groupPhotos.map((photo, index) => (
                      <div
                        key={index}
                        className='border rounded p-3 flex flex-col items-center'
                        style={{ backgroundColor: photo.color }}
                      >
                        <div className='h-32 w-32 bg-gray-200 mb-2 flex items-center justify-center'>
                          {photo.imageSrc ? (
                            <img
                              src={photo.imageSrc}
                              alt={photo.caption}
                              className='max-h-full max-w-full object-cover'
                            />
                          ) : (
                            <i className='tabler-photo text-4xl' />
                          )}
                        </div>
                        <Typography variant='caption' className='text-center mb-2'>
                          {photo.caption}
                        </Typography>
                        <Button
                          size='small'
                          color='error'
                          variant='text'
                          onClick={() => removeGroupPhoto(index)}
                        >
                          <i className='tabler-trash-x mr-1' /> Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className='border rounded p-4'>
                <Typography variant='subtitle2' className='mb-2'>
                  Add New Group Photo
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <div className='flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 mb-3 relative'>
                      {formData.currentGroupPhotoImageSrc ? (
                        <div className='flex flex-col items-center'>
                          <img
                            src={formData.currentGroupPhotoImageSrc}
                            alt="Group photo preview"
                            className='max-h-48 max-w-full object-contain mb-3'
                          />
                          <Button
                            variant='outlined'
                            color='error'
                            onClick={() => setFormData({...formData, currentGroupPhotoImageSrc: '', currentGroupPhotoFile: null})}
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <div className='flex flex-col items-center py-6'>
                          <i className='tabler-upload text-3xl mb-2' />
                          <Typography variant='body2' className='mb-2'>Drop an image or click to browse</Typography>
                          <Button
                            variant='contained'
                            component='label'
                            size='small'
                          >
                            Upload Image
                            <input
                              type='file'
                              hidden
                              accept='image/*'
                              onChange={handleGroupPhotoImageChange}
                            />
                          </Button>
                        </div>
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextField
                      fullWidth
                      label='Caption'
                      placeholder='Enter image caption'
                      value={formData.currentGroupPhotoCaption || ''}
                      onChange={e => setFormData({ ...formData, currentGroupPhotoCaption: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      color='secondary'
                      onClick={addGroupPhoto}
                      disabled={!formData.currentGroupPhotoCaption || (!formData.currentGroupPhotoFile && !formData.currentGroupPhotoImageSrc) || loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <>
                          <i className='tabler-plus mr-1' /> Add Group Photo
                        </>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </>
        )
      default:
        return 'Unknown step'
    }
  }

  // Dialog for delete confirmation
  const DeleteConfirmationDialog = () => (
    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this gallery photo? This action cannot be undone.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">Cancel</Button>
        <Button onClick={handleDelete} variant="contained" color="error" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Card>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Typography variant='h6'>
              {isEditing ? 'Edit Gallery Photo' : 'Add New Gallery Photo'}
            </Typography>
            {isEditing && (
              <Button
                variant='outlined'
                color='error'
                onClick={() => setDeleteDialogOpen(true)}
                startIcon={<i className='tabler-trash' />}
              >
                Delete
              </Button>
            )}
          </div>
          <StepperWrapper>
            <Stepper
              activeStep={activeStep}
              connector={
                !isSmallScreen ? (
                  <DirectionalIcon
                    ltrIconClass='tabler-chevron-right'
                    rtlIconClass='tabler-chevron-left'
                    className='text-xl'
                  />
                ) : null
              }
            >
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>
                    <div className='step-label'>
                      <CustomAvatar
                        variant='rounded'
                        skin={activeStep === index ? 'filled' : 'light'}
                        {...(activeStep >= index && { color: 'primary' })}
                        {...(activeStep === index && { className: 'shadow-primarySm' })}
                        size={38}
                      >
                        <i className={classnames(step.icon)} />
                      </CustomAvatar>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </StepperWrapper>
        </CardContent>
        <Divider sx={{ m: '0 !important' }} />
        <CardContent>
          {activeStep === steps.length ? (
            <>
              <Typography className='mb-2 ml-1'>
                Photo {isEditing ? 'updated' : 'added'} successfully!
              </Typography>
              <div className='flex justify-end mt-4'>
                <Button variant='contained' onClick={handleReset}>
                  {isEditing ? 'Back to Edit Mode' : 'Add Another Photo'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={e => e.preventDefault()}>
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <Typography className='font-medium' color='text.primary'>
                      {steps[activeStep].title}
                    </Typography>
                    <Typography variant='body2'>{steps[activeStep].subtitle}</Typography>
                  </Grid>
                  {renderStepContent(activeStep)}
                  <Grid item xs={12} className='flex justify-between'>
                    <Button
                      variant='tonal'
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      startIcon={<DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />}
                      color='secondary'
                    >
                      Back
                    </Button>
                    <Button
                      variant='contained'
                      onClick={handleNext}
                      disabled={loading}
                      endIcon={
                        loading ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : activeStep === steps.length - 1 ? (
                          <i className='tabler-check' />
                        ) : (
                          <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
                        )
                      }
                    >
                      {activeStep === steps.length - 1 ? (isEditing ? 'Update' : 'Submit') : 'Next'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </>
          )}
        </CardContent>
      </Card>
      <DeleteConfirmationDialog />
    </>
  )
}

export default GalleryManagement
