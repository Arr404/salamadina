'use client'

// React Imports
import { useState, useEffect, SyntheticEvent } from 'react'

// Firebase Imports
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/services/init' // Assuming you have Firebase configured

// MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import OutlinedInput from '@mui/material/OutlinedInput'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'

// Third-party Imports
import { toast } from 'react-toastify'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Types
interface Translation {
  question: string
  answer: string
}

interface FAQ {
  id: string
  categories: string[]
  translations: {
    [key: string]: Translation
  }
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

interface Language {
  code: string
  name: string
}

// Define available languages
const availableLanguages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ind', name: 'Indonesian' }
]

// TabPanel component for language tabs
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`language-tabpanel-${index}`}
      aria-labelledby={`language-tab-${index}`}
      {...other}
    >
      {value === index && <Box component="div" sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const getTabProps = (index: number) => {
  return {
    id: `language-tab-${index}`,
    'aria-controls': `language-tabpanel-${index}`
  }
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const FaqManagement = () => {
  // States
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'delete'>('create')
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [categories, setCategories] = useState<string[]>([
    'umrah',
    'requirements',
    'visa',
    'travel',
    'accommodation',
    'health',
    'general'
  ])

  // New category states
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [newCategory, setNewCategory] = useState<string>('')

  // Form states
  const [formData, setFormData] = useState<FAQ>({
    id: '',
    categories: [],
    translations: {
      en: { question: '', answer: '' },
      ind: { question: '', answer: '' }
    }
  })

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const openPopover = Boolean(anchorEl)

  // Fetch FAQs from Firestore
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const faqCollection = collection(db, 'faq')
        const faqSnapshot = await getDocs(faqCollection)
        const faqList = faqSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as FAQ))

        // Extract unique categories from FAQs
        const uniqueCategories = new Set<string>(categories)
        faqList.forEach(faq => {
          if (faq.categories && Array.isArray(faq.categories)) {
            faq.categories.forEach(category => uniqueCategories.add(category))
          }
        })

        setCategories(Array.from(uniqueCategories))
        setFaqs(faqList)
      } catch (error) {
        console.error('Error fetching FAQs:', error)
        toast.error('Failed to load FAQs')
      } finally {
        setLoading(false)
      }
    }

    fetchFaqs()
  }, [])

  // Handle dialog open for create
  const handleCreateDialogOpen = () => {
    setDialogMode('create')
    setFormData({
      id: '',
      categories: [],
      translations: {
        en: { question: '', answer: '' },
        ind: { question: '', answer: '' }
      }
    })
    setOpenDialog(true)
  }

  // Handle dialog open for edit
  const handleEditDialogOpen = (faq: FAQ) => {
    setDialogMode('edit')
    setSelectedFaq(faq)
    setFormData({
      id: faq.id,
      categories: faq.categories || [],
      translations: {
        en: faq.translations?.en || { question: '', answer: '' },
        ind: faq.translations?.ind || { question: '', answer: '' }
      }
    })
    setOpenDialog(true)
  }

  // Handle dialog open for delete
  const handleDeleteDialogOpen = (faq: FAQ) => {
    setDialogMode('delete')
    setSelectedFaq(faq)
    setOpenDialog(true)
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setOpenDialog(false)
    setSelectedFaq(null)
  }

  // Handle tab change
  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  // Handle form input change for translations
  const handleTranslationChange = (language: string, field: keyof Translation, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      translations: {
        ...prevData.translations,
        [language]: {
          ...prevData.translations[language],
          [field]: value
        }
      }
    }))
  }

  // Handle category selection change
  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string[]
    setFormData(prevData => ({
      ...prevData,
      categories: value
    }))
  }

  // Open popover for adding new category
  const handleAddCategoryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  // Close popover
  const handlePopoverClose = () => {
    setAnchorEl(null)
    setNewCategory('')
  }

  // Handle new category input change
  const handleNewCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(event.target.value)
  }

  // Add new category
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      const updatedCategories = [...categories, newCategory]
      setCategories(updatedCategories)

      // Add the new category to the form data selection if in edit/create mode
      if (dialogMode === 'create' || dialogMode === 'edit') {
        setFormData(prevData => ({
          ...prevData,
          categories: [...prevData.categories, newCategory]
        }))
      }

      toast.success(`Category "${newCategory}" added successfully`)
    } else if (categories.includes(newCategory)) {
      toast.warning('This category already exists')
    }

    handlePopoverClose()
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        // Create new FAQ
        const docRef = await addDoc(collection(db, 'faq'), {
          categories: formData.categories,
          translations: formData.translations
        })

        const { id, ...restFormData } = formData;
        const newFaq: FAQ = {
          id: docRef.id,
          ...restFormData
        }

        setFaqs(prevFaqs => [...prevFaqs, newFaq])
        toast.success('FAQ created successfully')
      } else if (dialogMode === 'edit' && selectedFaq) {
        // Update existing FAQ
        const faqRef = doc(db, 'faqs', selectedFaq.id)
        await updateDoc(faqRef, {
          categories: formData.categories,
          translations: formData.translations
        })

        setFaqs(prevFaqs =>
          prevFaqs.map(faq =>
            faq.id === selectedFaq.id ? { ...formData } : faq
          )
        )
        toast.success('FAQ updated successfully')
      }

      handleDialogClose()
    } catch (error) {
      console.error('Error saving FAQ:', error)
      toast.error('Failed to save FAQ')
    }
  }

  // Handle FAQ deletion
  const handleDelete = async () => {
    try {
      if (selectedFaq) {
        await deleteDoc(doc(db, 'faqs', selectedFaq.id))
        setFaqs(prevFaqs => prevFaqs.filter(faq => faq.id !== selectedFaq.id))
        toast.success('FAQ deleted successfully')
        handleDialogClose()
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      toast.error('Failed to delete FAQ')
    }
  }

  // Render dialog content based on mode
  const renderDialogContent = () => {
    if (dialogMode === 'delete') {
      return (
        <>
          <DialogTitle>Delete FAQ</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </Typography>
            {selectedFaq && (
              <Box component="div" sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.primary">
                  Question: {selectedFaq.translations?.en?.question || 'N/A'}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </>
      )
    }

    return (
      <>
        <DialogTitle>{dialogMode === 'create' ? 'Create New FAQ' : 'Edit FAQ'}</DialogTitle>
        <DialogContent>
          <Box component="div" sx={{ mb: 4, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="categories-label">Categories</InputLabel>
              <Select
                labelId="categories-label"
                multiple
                value={formData.categories}
                onChange={handleCategoryChange as any} // This will update the categories in the formData
                input={<OutlinedInput label="Categories" />}
                renderValue={(selected) => (
                  <Box component="div" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
                endAdornment={
                  <Button
                    size="small"
                    onClick={handleAddCategoryClick} // This will trigger the popover to add new category
                    sx={{ mr: 1 }}
                  >
                    <i className="tabler-plus" />
                  </Button>
                }
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box component="div" sx={{ width: '100%' }}>
            <Box component="div" sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="language tabs">
                {availableLanguages.map((lang, index) => (
                  <Tab key={lang.code} label={lang.name} {...getTabProps(index)} />
                ))}
              </Tabs>
            </Box>

            {availableLanguages.map((lang, index) => (
              <TabPanel key={lang.code} value={activeTab} index={index}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <CustomTextField
                      fullWidth
                      label="Question"
                      value={formData.translations[lang.code]?.question || ''}
                      onChange={(e) => handleTranslationChange(lang.code, 'question', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextField
                      fullWidth
                      label="Answer"
                      multiline
                      rows={6}
                      value={formData.translations[lang.code]?.answer || ''}
                      onChange={(e) => handleTranslationChange(lang.code, 'answer', e.target.value)}
                      placeholder="Enter answer with bullet points using • for each point"
                    />
                  </Grid>
                </Grid>
              </TabPanel>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialogMode === 'create' ? 'Create' : 'Save Changes'}
          </Button>
        </DialogActions>
      </>
    )
  }

  // Helper function to truncate text
  const truncateText = (text: string | undefined, maxLength = 100) => {
    if (!text) return 'N/A'
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  return (
    <>
      <Card>
        <CardContent>
          <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h5" component="h1">
              FAQ Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<i className="tabler-plus" />}
              onClick={handleCreateDialogOpen}
            >
              Add New FAQ
            </Button>
          </Box>

          {loading ? (
            <Box component="div" sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="FAQ table">
                <TableHead>
                  <TableRow>
                    <TableCell>Question (EN)</TableCell>
                    <TableCell>Categories</TableCell>
                    <TableCell>Languages</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {faqs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography sx={{ py: 4 }}>No FAQs found. Create your first FAQ.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    faqs.map((faq) => (
                      <TableRow key={faq.id}>
                        <TableCell>
                          {truncateText(faq.translations?.en?.question)}
                        </TableCell>
                        <TableCell>
                          <Box component="div" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {faq.categories?.map((category) => (
                              <Chip key={category} label={category} size="small" />
                            )) || 'N/A'}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box component="div" sx={{ display: 'flex', gap: 0.5 }}>
                            {Object.keys(faq.translations || {}).map((langCode) => (
                              <Chip
                                key={langCode}
                                label={availableLanguages.find(l => l.code === langCode)?.name || langCode}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditDialogOpen(faq)}
                            size="small"
                          >
                            <i className="tabler-edit" />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteDialogOpen(faq)}
                            size="small"
                          >
                            <i className="tabler-trash" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit/Delete Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
      >
        {renderDialogContent()}
      </Dialog>

      {/* Add New Category Popover */}
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box component="div" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            label="New Category"
            size="small"
            value={newCategory}
            onChange={handleNewCategoryChange}  // This updates the newCategory state as the user types
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddCategory(); // Trigger the category addition
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddCategory} // Trigger the category addition when the user clicks
            size="small"
          >
            Add
          </Button>
        </Box>
      </Popover>

    </>
  )
}

export default FaqManagement
