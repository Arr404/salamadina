'use client'

// React Imports
import { useEffect, useState } from 'react'

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
import type { StepProps } from '@mui/material/Step'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'

// Third-party Imports
import { toast } from 'react-toastify'
import classnames from 'classnames'

// Firebase Imports
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/services/init'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import DirectionalIcon from '@components/DirectionalIcon'
import CustomTextField from '@core/components/mui/TextField'
import { uploadImage } from '@/services/cloudinary'

// Styles Component Imports
import StepperWrapper from '@core/styles/stepper'

// Interfaces
interface IAgent {
  id?: string;
  number: number;
  name: string;
  address: string;
  phone: string | null;
  lat: number | null;
  long: number | null;
  profileImage?: string;
}

interface FormDataType {
  name: string;
  address: string;
  phone: string;
  lat: string;
  long: string;
  profileImage?: File | null;
  profileImageUrl?: string;
  isEdit: boolean;
  editId?: string;
}

// Vars
const steps = [
  {
    title: 'Agent Details',
    subtitle: 'Enter Agent Information',
    icon: 'tabler-user'
  },
  {
    title: 'Location',
    subtitle: 'Set Agent Location',
    icon: 'tabler-map-pin'
  },
  {
    title: 'Profile Image',
    subtitle: 'Upload Agent Profile Image',
    icon: 'tabler-photo'
  }
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

const AddAgents = () => {
  // States
  const [activeStep, setActiveStep] = useState(0)
  const [agents, setAgents] = useState<IAgent[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  const defaultFormData: FormDataType = {
    name: '',
    address: '',
    phone: '',
    lat: '',
    long: '',
    profileImage: null,
    profileImageUrl: '',
    isEdit: false,
    editId: ''
  }

  const [formData, setFormData] = useState<FormDataType>(defaultFormData)

  // Fetch agents on mount
  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'agents'))
      const agentData: IAgent[] = []

      querySnapshot.forEach((doc) => {
        agentData.push({ id: doc.id, ...doc.data() } as IAgent)
      })

      setAgents(agentData)
    } catch (error) {
      console.error('Error fetching agents:', error)
      toast.error('Failed to fetch agents')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setActiveStep(0)
    setFormData(defaultFormData)
    setSelectedFile(null)
    setImagePreview(null)
  }

  const handleNext = () => {
    // Form validation depending on the current step
    if (activeStep === 0) {
      if (!formData.name || !formData.address || !formData.phone) {
        toast.error('Please fill in all required fields')
        return
      }
    } else if (activeStep === 1) {
      if (!formData.lat || !formData.long) {
        toast.error('Please enter latitude and longitude')
        return
      }

      // Validate latitude and longitude
      const lat = parseFloat(formData.lat)
      const long = parseFloat(formData.long)

      if (isNaN(lat) || lat < -90 || lat > 90) {
        toast.error('Please enter a valid latitude (-90 to 90)')
        return
      }

      if (isNaN(long) || long < -180 || long > 180) {
        toast.error('Please enter a valid longitude (-180 to 180)')
        return
      }
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1)

    if (activeStep === steps.length - 1) {
      handleSubmit()
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setSelectedFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      setFormData({ ...formData, profileImage: file })
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      let profileImageUrl = formData.profileImageUrl

      // Upload image if selected
      if (selectedFile) {
        setUploading(true)
        try {
          const uploadResult = await uploadImage(selectedFile)
          profileImageUrl = uploadResult.secure_url
          setUploading(false)
        } catch (error) {
          console.error('Error uploading image:', error)
          toast.error('Failed to upload image')
          setUploading(false)
          setLoading(false)
          return
        }
      }

      const agentData: Omit<IAgent, 'id'> = {
        number: agents.length + 1,
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        lat: parseFloat(formData.lat),
        long: parseFloat(formData.long),
        ...(profileImageUrl && { profileImage: profileImageUrl })
      }

      if (formData.isEdit && formData.editId) {
        // Update existing agent
        await updateDoc(doc(db, 'agents', formData.editId), agentData)
        toast.success('Agent updated successfully')
      } else {
        // Add new agent
        await addDoc(collection(db, 'agents'), agentData)
        toast.success('Agent added successfully')
      }

      // Refresh agents list
      await fetchAgents()
      handleReset()

    } catch (error) {
      console.error('Error adding/updating agent:', error)
      toast.error('Failed to save agent information')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (agent: IAgent) => {
    if (!agent.id) return

    setFormData({
      name: agent.name,
      address: agent.address,
      phone: agent.phone || '',
      lat: agent.lat ? agent.lat.toString() : '',
      long: agent.long ? agent.long.toString() : '',
      profileImageUrl: agent.profileImage || '',
      profileImage: null,
      isEdit: true,
      editId: agent.id
    })

    if (agent.profileImage) {
      setImagePreview(agent.profileImage)
    }

    setActiveStep(0)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return

    setLoading(true)
    try {
      await deleteDoc(doc(db, 'agents', id))
      toast.success('Agent deleted successfully')
      await fetchAgents()
    } catch (error) {
      console.error('Error deleting agent:', error)
      toast.error('Failed to delete agent')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                required
                label='Agent Name'
                placeholder='John Doe'
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                required
                label='Address'
                placeholder='123 Main St, City, Country'
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                required
                label='Phone Number'
                placeholder='+1234567890'
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position='start'><i className='tabler-phone' /></InputAdornment>
                }}
              />
            </Grid>
          </>
        )
      case 1:
        return (
          <>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                required
                label='Latitude'
                placeholder='-7.30910'
                value={formData.lat}
                onChange={e => setFormData({ ...formData, lat: e.target.value })}
                helperText='Value between -90 and 90'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                required
                label='Longitude'
                placeholder='112.7731'
                value={formData.long}
                onChange={e => setFormData({ ...formData, long: e.target.value })}
                helperText='Value between -180 and 180'
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' className='mb-2'>
                Tip: You can find latitude and longitude values by right-clicking on a location in Google Maps and selecting "What's here?"
              </Typography>
            </Grid>
          </>
        )
      case 2:
        return (
          <>
            <Grid item xs={12} className='flex flex-col items-center'>
              {imagePreview && (
                <Box component="div" className='mb-4'>
                  <Avatar
                    src={imagePreview}
                    alt="Agent Preview"
                    sx={{ width: 120, height: 120 }}
                  />
                </Box>
              )}

              <Button
                variant='contained'
                component='label'
                className='mb-4'
                startIcon={<i className='tabler-upload' />}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Profile Image'}
                <input
                  type='file'
                  hidden
                  accept='image/*'
                  onChange={handleFileChange}
                />
              </Button>

              <Typography variant='body2' color='text.secondary'>
                Profile image will be displayed on the agent's card. Max file size: 5MB.
              </Typography>
            </Grid>
          </>
        )
      default:
        return 'Unknown step'
    }
  }

  return (
    <>
      <Card className='mb-6'>
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
                  Add New Agent
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
                      disabled={loading || uploading}
                      endIcon={
                        activeStep === steps.length - 1 ? (
                          loading || uploading ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <i className='tabler-check' />
                          )
                        ) : (
                          <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
                        )
                      }
                    >
                      {activeStep === steps.length - 1 ? (formData.isEdit ? 'Update' : 'Submit') : 'Next'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </>
          )}
        </CardContent>
      </Card>

      {/* Agents List Card */}
      <Card>
        <CardContent>
          <Typography variant='h6' className='mb-4'>
            Manage Agents
          </Typography>

          {loading ? (
            <Box component="div" className='flex justify-center p-6'>
              <CircularProgress />
            </Box>
          ) : agents.length === 0 ? (
            <Typography className='text-center p-6'>
              No agents found. Add your first agent using the form above.
            </Typography>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {agents.map((agent) => (
                <Card key={agent.id} variant='outlined' className='relative'>
                  <CardContent className='flex flex-col items-center p-4'>
                    <Avatar
                      src={agent.profileImage || ''}
                      alt={agent.name}
                      sx={{ width: 80, height: 80, mb: 2 }}
                    >
                      {agent.name.split(' ').map(word => word[0]).join('')}
                    </Avatar>
                    <Typography variant='h6' className='text-center'>{agent.name}</Typography>
                    <Typography variant='body2' className='text-center text-gray-600 mb-2'>{agent.address}</Typography>
                    <Typography variant='body2' className='text-center mb-4'>
                      <i className='tabler-phone mr-1' /> {agent.phone || 'N/A'}
                    </Typography>

                    <div className='flex gap-2 mt-2'>
                      <Button
                        size='small'
                        variant='outlined'
                        color='primary'
                        onClick={() => agent.id && handleEdit(agent)}
                        startIcon={<i className='tabler-edit' />}
                      >
                        Edit
                      </Button>
                      <Button
                        size='small'
                        variant='outlined'
                        color='error'
                        onClick={() => agent.id && handleDelete(agent.id)}
                        startIcon={<i className='tabler-trash' />}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default AddAgents
