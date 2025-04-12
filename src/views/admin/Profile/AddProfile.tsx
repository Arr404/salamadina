'use client'

// React Imports
import React, { useState } from 'react'
import Image from 'next/image'

// Firebase Imports
import { db } from '@/services/init'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

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

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Toast Notification
import { toast } from 'react-toastify'

interface ContentSection {
  title: string
  description: string
  image: string
}

interface PageSectionProps {
  titleImage?: string
  mainTitle?: string
  mainDescription?: string
  contentSections?: ContentSection[]
}

interface FormData extends PageSectionProps {
  preferredLanguage: 'id' | 'en'
}

const translations = {
  en: {
    pageTitle: 'Add Page Section',
    mainTitleLabel: 'Main Title',
    mainTitlePlaceholder: 'Enter main title',
    mainDescriptionLabel: 'Main Description',
    mainDescriptionPlaceholder: 'Enter main description',
    titleImageLabel: 'Title Image URL',
    titleImagePlaceholder: 'Enter image URL',
    contentSectionTitle: 'Content Sections',
    sectionTitleLabel: 'Section Title',
    sectionTitlePlaceholder: 'Enter section title',
    sectionDescriptionLabel: 'Section Description',
    sectionDescriptionPlaceholder: 'Enter section description',
    sectionImageLabel: 'Section Image URL',
    sectionImagePlaceholder: 'Enter section image URL',
    addSectionButton: 'Add Section',
    removeSectionButton: 'Remove',
    submitButton: 'Save Page Section',
    resetButton: 'Reset Form',
    successMessage: 'Page section successfully saved to Firestore!',
    errorMessage: 'Failed to save page section. Please try again.'
  },
  id: {
    pageTitle: 'Tambah Bagian Halaman',
    mainTitleLabel: 'Judul Utama',
    mainTitlePlaceholder: 'Masukkan judul utama',
    mainDescriptionLabel: 'Deskripsi Utama',
    mainDescriptionPlaceholder: 'Masukkan deskripsi utama',
    titleImageLabel: 'URL Gambar Judul',
    titleImagePlaceholder: 'Masukkan URL gambar',
    contentSectionTitle: 'Bagian Konten',
    sectionTitleLabel: 'Judul Bagian',
    sectionTitlePlaceholder: 'Masukkan judul bagian',
    sectionDescriptionLabel: 'Deskripsi Bagian',
    sectionDescriptionPlaceholder: 'Masukkan deskripsi bagian',
    sectionImageLabel: 'URL Gambar Bagian',
    sectionImagePlaceholder: 'Masukkan URL gambar bagian',
    addSectionButton: 'Tambah Bagian',
    removeSectionButton: 'Hapus',
    submitButton: 'Simpan Bagian Halaman',
    resetButton: 'Atur Ulang Formulir',
    successMessage: 'Bagian halaman berhasil disimpan ke Firestore!',
    errorMessage: 'Gagal menyimpan bagian halaman. Silakan coba lagi.'
  }
}

const AddPageSection = () => {
  const [loading, setLoading] = useState(false)

  const defaultContentSection: ContentSection = {
    title: '',
    description: '',
    image: ''
  }

  const [formData, setFormData] = useState<FormData>({
    titleImage: '',
    mainTitle: '',
    mainDescription: '',
    contentSections: [{ ...defaultContentSection }],
    preferredLanguage: 'en'
  })

  const t = translations[formData.preferredLanguage]

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
      updatedSections[index] = {
        ...updatedSections[index],
        [field]: value
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
        createdAt: serverTimestamp()
      }

      // Add to Firestore
      await addDoc(collection(db, 'pageSections'), firestoreData)

      toast.success(t.successMessage)

      // Reset form after successful submission
      handleReset()
    } catch (error) {
      console.error('Error adding document: ', error)
      toast.error(t.errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      titleImage: '',
      mainTitle: '',
      mainDescription: '',
      contentSections: [{ ...defaultContentSection }],
      preferredLanguage: formData.preferredLanguage // Preserve language setting
    })
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
                  className="object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/api/placeholder/800/300';
                  }}
                />
              </div>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg">
            <h1 className="text-2xl font-bold text-white">{data.mainTitle || '(No Title)'}</h1>
          </div>
        </div>

        {data.contentSections && data.contentSections.length > 0 && (
          <div className="space-y-3">
            {data.contentSections.map((section, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3 p-3 bg-white rounded-lg">
                <div className="w-full sm:w-1/3 relative h-24 bg-gray-200 rounded">
                  {section.image && (
                    <div className="relative h-full w-full">
                      <Image
                        src={section.image}
                        alt={section.title}
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
                <div className="w-full sm:w-2/3">
                  <h3 className="font-semibold">{section.title || '(No Title)'}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {section.description || '(No Description)'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
            <PreviewPageSection data={formData} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" className="mb-3">{t.mainTitleLabel}</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <CustomTextField
                  fullWidth
                  name="titleImage"
                  label={t.titleImageLabel}
                  placeholder={t.titleImagePlaceholder}
                  value={formData.titleImage || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTextField
                  fullWidth
                  name="mainTitle"
                  label={t.mainTitleLabel}
                  placeholder={t.mainTitlePlaceholder}
                  value={formData.mainTitle || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
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
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
            <Typography variant="h6" className="my-3">{t.contentSectionTitle}</Typography>

            {formData.contentSections && formData.contentSections.map((section, index) => (
              <Grid container spacing={3} key={index} className="mb-4 pb-4 border-b border-gray-200">
                <Grid item xs={12}>
                  <div className="flex justify-between">
                    <Typography variant="subtitle1">Section {index + 1}</Typography>
                    {formData.contentSections && formData.contentSections.length > 1 && (
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => removeContentSection(index)}
                      >
                        {t.removeSectionButton}
                      </Button>
                    )}
                  </div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    fullWidth
                    label={t.sectionTitleLabel}
                    placeholder={t.sectionTitlePlaceholder}
                    value={section.title}
                    onChange={(e) => handleContentSectionChange(index, 'title', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    fullWidth
                    label={t.sectionDescriptionLabel}
                    placeholder={t.sectionDescriptionPlaceholder}
                    value={section.description}
                    onChange={(e) => handleContentSectionChange(index, 'description', e.target.value)}
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    fullWidth
                    label={t.sectionImageLabel}
                    placeholder={t.sectionImagePlaceholder}
                    value={section.image}
                    onChange={(e) => handleContentSectionChange(index, 'image', e.target.value)}
                  />
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

export default AddPageSection
