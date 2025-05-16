'use client'

// React Imports
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

// Firebase Imports
import { db } from '@/services/init'
import { collection, addDoc, serverTimestamp, getDocs, updateDoc, doc } from 'firebase/firestore'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import { ImagePlus as AddPhotoAlternateIcon, Trash2 as DeleteIcon } from 'lucide-react';

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Toast Notification
import { toast } from 'react-toastify'
import { uploadImage } from '@/services/cloudinary'

interface ContentSection {
  title: string;
  description: string;
  image: string[];
}

interface PageSectionProps {
  id?: string;
  titleImage?: string;
  mainTitle?: string;
  mainDescription?: string;
  contentSections?: ContentSection[];
}

interface FormData extends PageSectionProps {
  preferredLanguage: 'id' | 'en';
}

const translations = {
  en: {
    pageTitle: 'Edit Legalitas Page',
    mainTitleLabel: 'Main Title',
    mainTitlePlaceholder: 'Enter main title',
    mainDescriptionLabel: 'Main Description',
    mainDescriptionPlaceholder: 'Enter main description',
    titleImageLabel: 'Title Banner Image',
    titleImagePlaceholder: 'Upload or enter image URL',
    contentSectionTitle: 'Legal Document Sections',
    sectionTitleLabel: 'Legal Document Title',
    sectionTitlePlaceholder: 'Enter legal document title',
    sectionDescriptionLabel: 'Document Description',
    sectionDescriptionPlaceholder: 'Enter document description',
    sectionImageLabel: 'Document Images',
    sectionImagePlaceholder: 'Upload or enter image URL',
    addSectionButton: 'Add Legal Document Section',
    removeSectionButton: 'Remove',
    addImageButton: 'Add Image',
    removeImageButton: 'Remove Image',
    submitButton: 'Save Changes',
    resetButton: 'Reset Form',
    loadingData: 'Loading existing data...',
    successMessage: 'Legalitas page successfully updated!',
    errorMessage: 'Failed to update page. Please try again.',
    uploadingMessage: 'Uploading image...',
    choosePage: 'Choose Page to Edit',
    createNew: 'Create New Page'
  },
  id: {
    pageTitle: 'Edit Halaman Legalitas',
    mainTitleLabel: 'Judul Utama',
    mainTitlePlaceholder: 'Masukkan judul utama',
    mainDescriptionLabel: 'Deskripsi Utama',
    mainDescriptionPlaceholder: 'Masukkan deskripsi utama',
    titleImageLabel: 'Gambar Banner Judul',
    titleImagePlaceholder: 'Unggah atau masukkan URL gambar',
    contentSectionTitle: 'Bagian Dokumen Legal',
    sectionTitleLabel: 'Judul Dokumen Legal',
    sectionTitlePlaceholder: 'Masukkan judul dokumen legal',
    sectionDescriptionLabel: 'Deskripsi Dokumen',
    sectionDescriptionPlaceholder: 'Masukkan deskripsi dokumen',
    sectionImageLabel: 'Gambar Dokumen',
    sectionImagePlaceholder: 'Unggah atau masukkan URL gambar',
    addSectionButton: 'Tambah Bagian Dokumen Legal',
    removeSectionButton: 'Hapus',
    addImageButton: 'Tambah Gambar',
    removeImageButton: 'Hapus Gambar',
    submitButton: 'Simpan Perubahan',
    resetButton: 'Atur Ulang Formulir',
    loadingData: 'Memuat data yang ada...',
    successMessage: 'Halaman Legalitas berhasil diperbarui!',
    errorMessage: 'Gagal memperbarui halaman. Silakan coba lagi.',
    uploadingMessage: 'Mengunggah gambar...',
    choosePage: 'Pilih Halaman untuk Edit',
    createNew: 'Buat Halaman Baru'
  }
}

const EditLegalPageSection = () => {
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [existingPages, setExistingPages] = useState<PageSectionProps[]>([])
  const [fetchingData, setFetchingData] = useState(true)

  const defaultContentSection: ContentSection = {
    title: '',
    description: '',
    image: ['']
  }

  const [formData, setFormData] = useState<FormData>({
    id: '',
    titleImage: '',
    mainTitle: 'Legalitas',
    mainDescription: '',
    contentSections: [{ ...defaultContentSection }],
    preferredLanguage: 'en'
  })

  const t = translations[formData.preferredLanguage]

  // Fetch existing pages on component mount
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'legalitasPageSections'));
        const pages: PageSectionProps[] = [];

        querySnapshot.forEach((doc) => {
          pages.push({
            id: doc.id,
            ...doc.data() as Omit<PageSectionProps, 'id'>
          });
        });

        setExistingPages(pages);

        // If pages exist, select the first one by default
        if (pages.length > 0) {
          setFormData(prev => ({
            ...prev,
            id: pages[0].id || '',
            titleImage: pages[0].titleImage || '',
            mainTitle: pages[0].mainTitle || 'Legalitas',
            mainDescription: pages[0].mainDescription || '',
            contentSections: pages[0].contentSections || [{ ...defaultContentSection }]
          }));
        }
      } catch (error) {
        console.error("Error fetching pages:", error);
        toast.error('Failed to load existing pages');
      } finally {
        setFetchingData(false);
      }
    };

    fetchPages();
  }, []);

  const handlePageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    if (selectedId === 'new') {
      // Create new page
      setFormData({
        id: '',
        titleImage: '',
        mainTitle: 'Legalitas',
        mainDescription: '',
        contentSections: [{ ...defaultContentSection }],
        preferredLanguage: formData.preferredLanguage
      });
      return;
    }

    // Find selected page
    const selectedPage = existingPages.find(page => page.id === selectedId);

    if (selectedPage) {
      setFormData(prev => ({
        ...prev,
        id: selectedPage.id || '',
        titleImage: selectedPage.titleImage || '',
        mainTitle: selectedPage.mainTitle || 'Legalitas',
        mainDescription: selectedPage.mainDescription || '',
        contentSections: selectedPage.contentSections || [{ ...defaultContentSection }]
      }));
    }
  };

  const handleLanguageToggle = () => {
    setFormData(prevData => ({
      ...prevData,
      preferredLanguage: prevData.preferredLanguage === 'en' ? 'id' : 'en'
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleContentSectionChange = (index: number, field: keyof ContentSection, value: string) => {
    setFormData(prev => {
      const updatedSections = [...(prev.contentSections || [])]
      if (field !== 'image') {
        updatedSections[index] = {
          ...updatedSections[index],
          [field]: value
        }
      }
      return { ...prev, contentSections: updatedSections }
    })
  }

  const handleImageChange = (sectionIndex: number, imageIndex: number, value: string) => {
    setFormData(prev => {
      const updatedSections = [...(prev.contentSections || [])]
      const updatedImages = [...(updatedSections[sectionIndex].image || [''])]
      updatedImages[imageIndex] = value
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        image: updatedImages
      }
      return { ...prev, contentSections: updatedSections }
    })
  }

  const addImage = (sectionIndex: number) => {
    setFormData(prev => {
      const updatedSections = [...(prev.contentSections || [])]
      const updatedImages = [...(updatedSections[sectionIndex].image || []), '']
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        image: updatedImages
      }
      return { ...prev, contentSections: updatedSections }
    })
  }

  const removeImage = (sectionIndex: number, imageIndex: number) => {
    setFormData(prev => {
      const updatedSections = [...(prev.contentSections || [])]
      const updatedImages = [...(updatedSections[sectionIndex].image || [])]
      updatedImages.splice(imageIndex, 1)
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        image: updatedImages.length ? updatedImages : [''] // Always keep at least one image field
      }
      return { ...prev, contentSections: updatedSections }
    })
  }

  const addContentSection = () => {
    setFormData(prev => ({
      ...prev,
      contentSections: [...(prev.contentSections || []), { ...defaultContentSection }]
    }))
  }

  const removeContentSection = (index: number) => {
    setFormData(prev => {
      const updatedSections = [...(prev.contentSections || [])]
      updatedSections.splice(index, 1)
      return { ...prev, contentSections: updatedSections }
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'titleImage' | { sectionIndex: number, imageIndex: number }) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    try {
      setUploadingImage(typeof target === 'string' ? target : `section-${target.sectionIndex}-image-${target.imageIndex}`)
      setUploadProgress(0)

      const result = await uploadImage(file, (progress) => {
        setUploadProgress(progress)
      })

      // Update appropriate state based on target
      if (target === 'titleImage') {
        setFormData(prev => ({
          ...prev,
          titleImage: result.url
        }))
      } else {
        handleImageChange(target.sectionIndex, target.imageIndex, result.url)
      }

      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(null)
      setUploadProgress(0)
      // Clear the file input
      e.target.value = ''
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      // Prepare data for Firestore
      const firestoreData = {
        titleImage: formData.titleImage,
        mainTitle: formData.mainTitle,
        mainDescription: formData.mainDescription,
        contentSections: formData.contentSections,
        language: formData.preferredLanguage,
        updatedAt: serverTimestamp()
      }

      // Add or update in Firestore
      if (formData.id) {
        // Update existing document
        await updateDoc(doc(db, 'legalitasPageSections', formData.id), firestoreData)
      } else {
        // Create new document
        const docRef = await addDoc(collection(db, 'legalitasPageSections'), {
          ...firestoreData,
          createdAt: serverTimestamp()
        })
        // Update formData with new ID
        setFormData(prev => ({ ...prev, id: docRef.id }))
        // Update existingPages list
        setExistingPages(prev => [...prev, { id: docRef.id, ...firestoreData as any }])
      }

      toast.success(t.successMessage)
    } catch (error) {
      console.error('Error saving document: ', error)
      toast.error(t.errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    // If we have an ID, reset to that page's data
    if (formData.id) {
      const currentPage = existingPages.find(page => page.id === formData.id);
      if (currentPage) {
        setFormData({
          id: currentPage.id,
          titleImage: currentPage.titleImage || '',
          mainTitle: currentPage.mainTitle || 'Legalitas',
          mainDescription: currentPage.mainDescription || '',
          contentSections: currentPage.contentSections || [{ ...defaultContentSection }],
          preferredLanguage: formData.preferredLanguage // Preserve language setting
        });
      }
    } else {
      // Reset to empty form for new page
      setFormData({
        id: '',
        titleImage: '',
        mainTitle: 'Legalitas',
        mainDescription: '',
        contentSections: [{ ...defaultContentSection }],
        preferredLanguage: formData.preferredLanguage // Preserve language setting
      });
    }
  }

  // Preview component for the page section
  const PreviewPageSection = ({ data }: { data: PageSectionProps }) => {
    return (
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-2">{t.pageTitle} - Preview</h3>
        <div className="border relative h-48 bg-gray-200 rounded-lg mb-3">
          {data.titleImage && (
            <div className="absolute inset-0">
              <div className="relative h-full w-full">
                <Image
                  src={data.titleImage}
                  alt={data.mainTitle || 'Preview'}
                  fill
                  className="object-cover rounded-lg opacity-40"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/api/placeholder/800/300';
                  }}
                />
              </div>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-[#811745] bg-opacity-70 rounded-lg">
            <h1 className="text-2xl font-bold text-white">{data.mainTitle || '(No Title)'}</h1>
          </div>
        </div>

        {data.contentSections && data.contentSections.length > 0 && (
          <div className="space-y-6">
            {data.contentSections.map((section, index) => (
              <div key={index} className="flex flex-col p-4 bg-white rounded-lg">
                <div className="flex flex-wrap gap-3 justify-center mb-4">
                  {section.image && section.image.map((img, imgIndex) => (
                    <div key={imgIndex} className="relative w-1/3 h-32 bg-gray-200 rounded">
                      {img && (
                        <div className="relative h-full w-full">
                          <Image
                            src={img}
                            alt={`${section.title} - Image ${imgIndex + 1}`}
                            fill
                            className="object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/api/placeholder/300/200';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-[#811745]">{section.title || '(No Title)'}</h3>
                  {section.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {section.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (fetchingData) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-64">
          <CircularProgress />
          <Typography className="ml-4">{t.loadingData}</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <div className="flex items-center justify-between">
              <Typography variant="h5" color="primary">{t.pageTitle}</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.preferredLanguage === 'id'}
                    onChange={handleLanguageToggle}
                    color="primary"
                  />
                }
                label={formData.preferredLanguage === 'id' ? 'Bahasa Indonesia' : 'English'}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" className="mb-3">{t.choosePage}</Typography>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.id || 'new'}
              onChange={handlePageSelect}
            >
              <option value="new">{t.createNew}</option>
              {existingPages.map(page => (
                <option key={page.id} value={page.id}>
                  {page.mainTitle || `Page ${page.id}`}
                </option>
              ))}
            </select>
          </Grid>

          <Grid item xs={12}>
            <PreviewPageSection data={formData} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" className="mb-3">{t.mainTitleLabel}</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <div className="mb-4">
                  <CustomTextField
                    fullWidth
                    name="mainTitle"
                    label={t.mainTitleLabel}
                    placeholder={t.mainTitlePlaceholder}
                    value={formData.mainTitle || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <CustomTextField
                    fullWidth
                    name="mainDescription"
                    label={t.mainDescriptionLabel}
                    placeholder={t.mainDescriptionPlaceholder}
                    value={formData.mainDescription || ''}
                    onChange={handleChange}
                    multiline
                    rows={2}
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography className="mb-2">{t.titleImageLabel}</Typography>
                <div className="flex flex-col">
                  <div className="relative h-40 bg-gray-100 rounded-lg mb-2 overflow-hidden">
                    {formData.titleImage ? (
                      <Image
                        src={formData.titleImage}
                        alt="Banner"
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
                      name="titleImage"
                      placeholder={t.titleImagePlaceholder}
                      value={formData.titleImage || ''}
                      onChange={handleChange}
                    />
                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'titleImage')}
                      />
                      <Button
                        component="span"
                        variant="contained"
                        color="primary"
                        disabled={!!uploadingImage}
                        startIcon={<AddPhotoAlternateIcon />}
                      >
                        {uploadingImage === 'titleImage' ? `${uploadProgress}%` : 'Upload'}
                      </Button>
                    </label>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
            <Typography variant="h6" className="my-3">{t.contentSectionTitle}</Typography>

            {formData.contentSections && formData.contentSections.map((section, sectionIndex) => (
              <Grid container spacing={3} key={sectionIndex} className="mb-6 pb-6 border-b border-gray-200">
                <Grid item xs={12}>
                  <div className="flex justify-between">
                    <Typography variant="subtitle1">Document {sectionIndex + 1}</Typography>
                    {formData.contentSections && formData.contentSections.length > 1 && (
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => removeContentSection(sectionIndex)}
                      >
                        {t.removeSectionButton}
                      </Button>
                    )}
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    fullWidth
                    label={t.sectionTitleLabel}
                    placeholder={t.sectionTitlePlaceholder}
                    value={section.title}
                    onChange={(e) => handleContentSectionChange(sectionIndex, 'title', e.target.value)}
                  />
                  <div className="mt-4">
                    <CustomTextField
                      fullWidth
                      label={t.sectionDescriptionLabel}
                      placeholder={t.sectionDescriptionPlaceholder}
                      value={section.description}
                      onChange={(e) => handleContentSectionChange(sectionIndex, 'description', e.target.value)}
                      multiline
                      rows={3}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography className="mb-2">{t.sectionImageLabel}</Typography>
                  {section.image && section.image.map((img, imageIndex) => (
                    <div key={imageIndex} className="mb-4">
                      <div className="relative h-32 bg-gray-100 rounded-lg mb-2 overflow-hidden">
                        {img ? (
                          <Image
                            src={img}
                            alt={`Image ${imageIndex + 1}`}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/api/placeholder/400/200';
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
                          placeholder={t.sectionImagePlaceholder}
                          value={img}
                          onChange={(e) => handleImageChange(sectionIndex, imageIndex, e.target.value)}
                        />
                        <label>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, { sectionIndex, imageIndex })}
                          />
                          <Button
                            component="span"
                            variant="contained"
                            color="primary"
                            disabled={!!uploadingImage}
                            startIcon={<AddPhotoAlternateIcon />}
                          >
                            {uploadingImage === `section-${sectionIndex}-image-${imageIndex}` ? `${uploadProgress}%` : 'Upload'}
                          </Button>
                        </label>
                        {section.image.length > 1 && (
                          <IconButton
                            color="error"
                            onClick={() => removeImage(sectionIndex, imageIndex)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddPhotoAlternateIcon />}
                    onClick={() => addImage(sectionIndex)}
                    className="mt-2"
                  >
                    {t.addImageButton}
                  </Button>
                </Grid>
              </Grid>
            ))}

            <Button
              variant="outlined"
              color="primary"
              onClick={addContentSection}
              className="mb-4"
            >
              {t.addSectionButton}
            </Button>
          </Grid>

          <Grid item xs={12} className="flex gap-3 justify-end">
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              disabled={loading}
            >
              {t.resetButton}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? '...' : t.submitButton}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default EditLegalPageSection;
