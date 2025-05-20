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
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import MuiStep from '@mui/material/Step'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import type { StepProps } from '@mui/material/Step'

// Firebase Imports
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  getDoc
} from 'firebase/firestore'
import { db } from '@/services/init' // You'll need to create this file

// Third-party Imports
import { toast } from 'react-toastify'
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import DirectionalIcon from '@components/DirectionalIcon'
import CustomTextField from '@core/components/mui/TextField'

// Styles Component Imports
import StepperWrapper from '@core/styles/stepper'

// Types
type VideoFormData = {
  title: string
  videoId: string
  description: string
}

type VideoData = VideoFormData & {
  id: string
  createdAt: any
}

// Vars
const steps = [
  {
    icon: 'tabler-file-analytics',
    title: 'Video Details',
    subtitle: 'Enter video information'
  }
]

const categories = [
  { value: 'umrah', label: 'Umrah' },
  { value: 'hajj', label: 'Hajj' },
  { value: 'tour', label: 'Tour Package' },
  { value: 'other', label: 'Other' }
]

const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
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

// Tab Panel Component
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
      id={`video-tabpanel-${index}`}
      aria-labelledby={`video-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box component="div" sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

const AddTestimoni = () => {
  // States
  const [activeStep, setActiveStep] = useState(0)
  const [tabValue, setTabValue] = useState(0)
  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null)

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    videoId: '',
    description: ''
  })

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    setLoading(true)
    try {
      const videosQuery = query(collection(db, 'testimonialVideos'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(videosQuery)

      const videoList: VideoData[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        videoList.push({
          id: doc.id,
          title: data.title || '',
          videoId: data.videoId || '',
          description: data.description || '',
          createdAt: data.createdAt
        })
      })

      setVideos(videoList)
    } catch (error) {
      console.error('Error fetching videos:', error)
      toast.error('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setActiveStep(0)
    setFormData({
      title: '',
      videoId: '',
      description: ''
    })
    setEditMode(false)
    setCurrentVideoId(null)
  }

  const handleNext = () => {
    const nextStep = activeStep + 1

    // Validate current step
    if (activeStep === 0) {
      if (!formData.title || !formData.videoId) {
        toast.error('Please fill all required fields')
        return
      }
    }

    // If we're at the final step, submit the form
    if (nextStep === steps.length) {
      handleSubmit()
    } else {
      setActiveStep(nextStep)
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const videoData = {
        ...formData,
        createdAt: serverTimestamp()
      }

      if (editMode && currentVideoId) {
        // Update existing document
        const videoRef = doc(db, 'testimonialVideos', currentVideoId)
        await updateDoc(videoRef, videoData)
        toast.success('Testimonial video updated successfully!')
      } else {
        // Create new document
        await addDoc(collection(db, 'testimonialVideos'), videoData)
        toast.success('Testimonial video added successfully!')
      }

      // Reset form and fetch updated videos
      handleReset()
      fetchVideos()
      setTabValue(1) // Switch to the list tab
    } catch (error) {
      console.error('Error saving video:', error)
      toast.error('Failed to save testimonial video')
    } finally {
      setSaving(false)
    }
  }

  const handleEditVideo = async (videoId: string) => {
    try {
      setLoading(true)
      const videoRef = doc(db, 'testimonialVideos', videoId)
      const videoSnap = await getDoc(videoRef)

      if (videoSnap.exists()) {
        const data = videoSnap.data() as VideoFormData
        setFormData({
          title: data.title || '',
          videoId: data.videoId || '',
          description: data.description || ''
        })

        setEditMode(true)
        setCurrentVideoId(videoId)
        setActiveStep(0)
        setTabValue(0) // Switch to form tab
      } else {
        toast.error('Video not found')
      }
    } catch (error) {
      console.error('Error fetching video details:', error)
      toast.error('Failed to load video details')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (videoId: string) => {
    setVideoToDelete(videoId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!videoToDelete) return

    try {
      setLoading(true)
      await deleteDoc(doc(db, 'testimonialVideos', videoToDelete))
      toast.success('Video deleted successfully')
      fetchVideos()
    } catch (error) {
      console.error('Error deleting video:', error)
      toast.error('Failed to delete video')
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
      setVideoToDelete(null)
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const renderStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                required
                label='Video Title'
                placeholder='Testimonial from John Doe'
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                required
                label='YouTube Video ID'
                placeholder='e.g. oAMNlzUCytM'
                helperText="Extract from YouTube URL (e.g., https://www.youtube.com/watch?v=oAMNlzUCytM)"
                value={formData.videoId}
                onChange={e => setFormData({ ...formData, videoId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                multiline
                rows={4}
                label='Video Description'
                placeholder='Description of the testimonial video'
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
          </>
        )
      default:
        return 'Unknown step'
    }
  }

  const renderVideoList = () => {
    if (loading) {
      return (
        <Box component="div" display="flex" justifyContent="center" alignItems="center" p={4}>
          <CircularProgress />
        </Box>
      )
    }

    if (videos.length === 0) {
      return (
        <Box component="div" p={4} textAlign="center">
          <Typography>No testimonial videos found. Add your first video!</Typography>
        </Box>
      )
    }

    return (
      <List>
        {videos.map((video) => (
          <ListItem
            key={video.id}
            divider
            secondaryAction={
              <Box component="div">
                <IconButton
                  edge="end"
                  onClick={() => handleEditVideo(video.id)}
                  aria-label="edit"
                >
                  <i className="tabler-edit" />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteClick(video.id)}
                  aria-label="delete"
                  color="error"
                >
                  <i className="tabler-trash" />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={video.title}
            />
          </ListItem>
        ))}
      </List>
    )
  }

  return (
    <>
      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="video testimonial tabs">
            <Tab label="Add Testimonial" />
            <Tab label="Video List" />
          </Tabs>
        </CardContent>

        <TabPanel value={tabValue} index={0}>
          <CardContent>
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
                {steps.map((step, index) => {
                  return (
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
                  )
                })}
              </Stepper>
            </StepperWrapper>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <CardContent>
            {activeStep === steps.length ? (
              <>
                <Typography className='mlb-2 mli-1'>All steps are completed!</Typography>
                <div className='flex justify-end mt-4'>
                  <Button variant='contained' onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </>
            ) : (
              <>
                <form onSubmit={e => e.preventDefault()}>
                  <Grid container spacing={6}>
                    <Grid item xs={12}>
                      <Typography className='font-medium' color='text.primary'>
                        {editMode ? 'Edit Testimonial Video' : 'Add New Testimonial Video'}
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
                      <div>
                        {editMode && currentVideoId && (
                          <Button
                            variant='tonal'
                            color='secondary'
                            onClick={handleReset}
                            className='mr-2'
                          >
                            Cancel Edit
                          </Button>
                        )}
                        <Button
                          variant='contained'
                          onClick={handleNext}
                          disabled={saving}
                          endIcon={
                            saving ? (
                              <CircularProgress size={20} color='inherit' />
                            ) : activeStep === steps.length - 1 ? (
                              <i className='tabler-check' />
                            ) : (
                              <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
                            )
                          }
                        >
                          {activeStep === steps.length - 1 ? (editMode ? 'Update' : 'Submit') : 'Next'}
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </form>
              </>
            )}
          </CardContent>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <CardContent>
            <Box component="div" display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Testimonial Videos</Typography>
              <Button
                variant="contained"
                startIcon={<i className="tabler-plus" />}
                onClick={() => {
                  handleReset()
                  setTabValue(0)
                }}
              >
                Add New Video
              </Button>
            </Box>
            {renderVideoList()}
          </CardContent>
        </TabPanel>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this testimonial video? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddTestimoni
