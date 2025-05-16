'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  Autocomplete,
  Icon,
  Paper,
  TextField,
  Typography,
  Snackbar,
  AlertColor,
  Select,
  MenuItem,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Button, SelectChangeEvent
} from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment';
import { umrahPackageservice, UmrahPackagesInput, UmrahPackage } from '@/services/package';
import { uploadImage } from '@/services/cloudinary';
import DynamicFiltersManagement from '@views/package/umrah/dynamicFiltersManagement';
import { fetchFilters } from '@/services/dynamicFilter';
import { GetTablerIconsList } from '@/utils/getTablerIconsList';
import Alert from '@mui/material/Alert';
import { getLanguage } from '@/utils/getLanguage';
import { CloudinaryImage, ImageSelectionModal } from '@/components/ImageUpload';
import ButtonIcon from '@mui/material/Button'; // using MUI Button as needed
import { Upload } from "lucide-react";
import DirectionalIcon from '@components/DirectionalIcon'
import CustomAvatar from '@core/components/mui/Avatar'
import classnames from 'classnames'
import StepperWrapper from '@core/styles/stepper'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
// Initial form data
const initialFormData = {
  // Language-specific fields (for both EN and IND)
  en: {
    title: '',
    subtitle: '',
    features: [
      { label: '', icon: '' },
      { label: '', icon: '' },
      { label: '', icon: '' },
      { label: '', icon: '' },
      { label: '', icon: '' },
      { label: '', icon: '' },
    ]
  },
  ind: {
    title: '',
    subtitle: '',
    features: [
      { label: '', icon: '' },
      { label: '', icon: '' },
      { label: '', icon: '' },
      { label: '', icon: '' },
      { label: '', icon: '' },
      { label: '', icon: '' },
    ]
  },
  // Common fields
  price: '',
  seatsLeft: '',
  totalSeats: '',
  imageUrl: '',
  image: null as File | null,
  tags: [] as string[],
  packageType: '',
  subType: ''
};



const tablerIconsList = GetTablerIconsList;

// Filter type
type FilterData = {
  promos: { id: string; name: string }[];
  airports: { id: string; code: string; name: string }[];
  packageTypes: string[];
};

interface Props {
  packageTypes: { [key: string]: string[] };
  title: string;
  type: string
}

const UmrahPackagesManagement: React.FC<Props> = (props) => {
  const router = useRouter();
  const packageTypes = props.packageTypes
  // Language state from getLanguage()
  const [language, setLanguage] = useState<'en' | 'ind'>(getLanguage());

  // Additional state variables
  const [packages, setPackages] = useState<UmrahPackage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<UmrahPackage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ ...initialFormData });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  type PackageTypeKey = keyof typeof packageTypes;
  const [selectedPackageType, setSelectedPackageType] = useState<string>('');
  const [selectedSubType, setSelectedSubType] = useState<string>('');
  const [filters, setFilters] = useState<FilterData>({
    promos: [],
    airports: [],
    packageTypes: Object.keys(packageTypes)
  });
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loading, setLoading] = useState(true);

  const theme = useTheme()
  // State for controlling the Cloudinary images modal.
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // New state for the stepper active step
  const [activeStep, setActiveStep] = useState(0);

  // Example translation object (replace with your own i18n logic if needed)
  const t = {
    languageLabel: 'Language'
  };

  // Define language-specific step arrays with changed icons
  const steps =
    language === 'en'
      ? [
        {
          icon: 'tabler-book',
          title: 'English Content',
          subtitle: 'Enter content details in English'
        },
        {
          icon: 'tabler-language',
          title: 'Indonesia Content',
          subtitle: 'Enter content details for Indonesian'
        },
        {
          icon: 'tabler-settings',
          title: 'Common Content',
          subtitle: 'Content applicable to both languages'
        }
      ]
      : [
        {
          icon: 'tabler-book',
          title: 'Konten Bahasa Inggris',
          subtitle: 'Masukkan detail konten dalam Bahasa Inggris'
        },
        {
          icon: 'tabler-language',
          title: 'Konten Bahasa Indonesia',
          subtitle: 'Masukkan detail konten dalam Bahasa Indonesia'
        },
        {
          icon: 'tabler-settings',
          title: 'Konten Umum',
          subtitle: 'Konten yang berlaku untuk kedua bahasa'
        }
      ];

  // Handle language change: update state, localStorage, and re-fetch packages.
  const handleLanguageChange = (event: SelectChangeEvent<'en' | 'ind'>) => {
    const newLang = event.target.value as 'en' | 'ind';
    setLanguage(newLang);
    localStorage.setItem('I18N_LANGUAGE', newLang);
    // Re-fetch packages after language change.
    fetchPackages();
  };

  // Show notification
  const showNotification = (message: string, severity: AlertColor = 'success') => {
    setNotification({ open: true, message, severity });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Load filters
  const loadFilters = async () => {
    try {
      setLoading(true);
      const data = await fetchFilters();
      setFilters({
        ...data,
        packageTypes: Object.keys(packageTypes)
      });
      setLoading(false);
    } catch (error) {
      console.error("Failed to load filters:", error);
      setLoading(false);
    }
  };

  // Fetch packages from Firestore (the service merges common and language-specific data)
  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const packagesData = await umrahPackageservice.getPackages(props.type);
      setPackages(packagesData);
    } catch (error) {
      showNotification("Failed to load packages.", 'error');
    }
    setIsLoading(false);
  };

  // Re-fetch packages when language changes
  useEffect(() => {
    fetchPackages();
  }, [language]);

  useEffect(() => {
    fetchPackages();
    loadFilters();
  }, []);

  // Handle form input changes for language-specific fields
  const handleLanguageInputChange = (lang: 'en' | 'ind', field: string, value: string) => {
    setFormData({
      ...formData,
      [lang]: {
        ...formData[lang],
        [field]: value
      }
    });
  };

  // Handle form input changes for common fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      const numericValue = value.replace(/\D/g, '');
      setFormData({
        ...formData,
        [name]: numericValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle select input changes
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'packageType') {
      setSelectedPackageType(value);
      setSelectedSubType('');
    }
  };

  // Handle tag selection
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
  };

  // Handle sub-type selection
  const handleSubTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubType(e.target.value);
  };

  // Handle feature input changes for specific language
  const handleFeatureChange = (
    lang: 'en' | 'ind',
    index: number,
    field: 'label' | 'icon',
    value: string
  ) => {
    if (field === 'icon') {
      // Update icon for both languages
      const updatedEn = [...formData.en.features];
      const updatedInd = [...formData.ind.features];
      updatedEn[index].icon = value;
      updatedInd[index].icon = value;
      setFormData({
        ...formData,
        en: {
          ...formData.en,
          features: updatedEn,
        },
        ind: {
          ...formData.ind,
          features: updatedInd,
        },
      });
    } else {
      // Update label only for the specified language
      const updated = [...formData[lang].features];
      updated[index].label = value;
      setFormData({
        ...formData,
        [lang]: {
          ...formData[lang],
          features: updated,
        },
      });
    }
  };


  // Handle file image upload (new image file)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
      // Clear any previously set imageUrl from Cloudinary selection.
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  // Handler for selecting an image from the Firestore-backed Cloudinary list.
  const handleCloudinaryImageSelect = (image: CloudinaryImage) => {
    // When an image is confirmed, set its URL in formData.
    setFormData({ ...formData, imageUrl: image.secure_url, image: null });
  };

  // Add new package - UPDATED to match the service function
  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Clean and filter features for both languages
    const cleanedEnFeatures = formData.en.features
      .filter(feature => feature.label.trim() !== '')
      .map(feature => ({
        label: feature.label.trim(),
        icon: feature.icon.trim()
      }));

    const cleanedIndFeatures = formData.ind.features
      .filter(feature => feature.label.trim() !== '')
      .map(feature => ({
        label: feature.label.trim(),
        icon: feature.icon.trim()
      }));

    try {
      let imageUrl = formData.imageUrl;
      // If a new file was uploaded, use it
      if (formData.image) {
        const uploadResult = await uploadImage(formData.image);
        imageUrl = uploadResult.secure_url;
      }

      const packageTags = [...selectedTags];
      if (selectedPackageType) {
        packageTags.push(selectedPackageType);
        if (selectedSubType) {
          packageTags.push(selectedSubType);
        }
      }

      // Format data to match the addPackage function's expected structure
      // This is now structured to work with the separated language data model
      const packageData: UmrahPackagesInput = {
        // English language-specific fields
        title: formData.en.title,
        subtitle: formData.en.subtitle,
        features: cleanedEnFeatures,

        // Common fields
        price: parseFloat(formData.price.replace(/[^0-9.-]+/g, "")),
        seatsLeft: parseInt(formData.seatsLeft),
        totalSeats: parseInt(formData.totalSeats),
        imageUrl: imageUrl,
        tags: packageTags,
        packageType: selectedPackageType,
        subType: selectedSubType,

        // Indonesian language data (will be added separately to the languages object)
        indTitle: formData.ind.title,
        indSubtitle: formData.ind.subtitle,
        indFeatures: cleanedIndFeatures
      };

      await umrahPackageservice.addPackage(packageData,props.type);

      setFormData({ ...initialFormData });
      setSelectedTags([]);
      setSelectedPackageType('');
      setSelectedSubType('');
      setShowForm(false);
      setActiveStep(0);
      fetchPackages();
      showNotification("Package added successfully!");
    } catch (error) {
      showNotification("Failed to add package.", 'error');
    }
    setIsLoading(false);
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  // Update an existing package - UPDATED to match the service function structure
  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!currentPackage?.id) {
      setIsLoading(false);
      showNotification("Missing package ID", 'error');
      return;
    }

    try {
      let imageUrl = formData.imageUrl || currentPackage.imageUrl;
      if (formData.image) {
        try {
          const uploadResult = await uploadImage(formData.image);
          imageUrl = uploadResult.secure_url;
        } catch (imageError) {
          console.error("Image upload error:", imageError);
          showNotification("Image upload failed, using existing image", 'warning');
        }
      }

      const packageTags = [...selectedTags];
      if (selectedPackageType) {
        packageTags.push(selectedPackageType);
        if (selectedSubType) {
          packageTags.push(selectedSubType);
        }
      }

      // Clean features for both languages
      const cleanedEnFeatures = formData.en.features
        .filter(feature => feature && feature.label && feature.label.trim() !== '')
        .map(feature => ({
          label: feature.label?.trim() || '',
          icon: feature.icon?.trim() || ''
        }));

      const cleanedIndFeatures = formData.ind.features
        .filter(feature => feature && feature.label && feature.label.trim() !== '')
        .map(feature => ({
          label: feature.label?.trim() || '',
          icon: feature.icon?.trim() || ''
        }));

      // Format data to match the updatePackage function's expected structure
      // Separate language-specific data from common fields
      const packageData: Partial<UmrahPackagesInput> = {
        // English language-specific fields
        title: formData.en.title.trim() || '',
        subtitle: formData.en.subtitle.trim() || '',
        features: cleanedEnFeatures,

        // Indonesian language-specific fields
        indTitle: formData.ind.title.trim() || '',
        indSubtitle: formData.ind.subtitle.trim() || '',
        indFeatures: cleanedIndFeatures,

        // Common fields
        price: parseFloat((formData.price || '0').toString().replace(/[^0-9.-]+/g, "")),
        seatsLeft: parseInt((formData.seatsLeft || '0').toString()),
        totalSeats: parseInt((formData.totalSeats || '0').toString()),
        imageUrl: imageUrl,
        tags: packageTags,
        packageType: selectedPackageType || '',
        subType: selectedSubType || undefined
      };

      await umrahPackageservice.updatePackage(currentPackage.id, props.type, packageData);

      setFormData({ ...initialFormData });
      setSelectedTags([]);
      setSelectedPackageType('');
      setSelectedSubType('');
      setEditMode(false);
      setCurrentPackage(null);
      setShowForm(false);
      setActiveStep(0);
      fetchPackages();
      showNotification("Package updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      let errorMessage = "Failed to update package.";
      if (error instanceof Error) {
        errorMessage += ` ${error.message}`;
      }
      showNotification(errorMessage, 'error');
    }
    setIsLoading(false);
  };

  // Delete a package
  const handleDeletePackage = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      setIsLoading(true);
      try {
        await umrahPackageservice.deletePackage(id,props.type);
        fetchPackages();
        showNotification("Package deleted successfully!");
      } catch (error) {
        showNotification("Failed to delete package.", 'error');
      }
      setIsLoading(false);
    }
  };

  // Edit package—prefill the form with merged data.
  const handleEditPackage = (pkg: UmrahPackage) => {
    setCurrentPackage(pkg);

    // For edit mode, we need to initialize based on the current language's data
    // and possibly fetch both languages data if needed
    setFormData({
      en: {
        title: language === 'en' ? pkg.title : pkg.enTitle || '',
        subtitle: language === 'en' ? pkg.subtitle : pkg.enSubtitle || '',
        features: [
          ...(language === 'en' ? pkg.features : pkg.enFeatures || []),
          ...Array(6 - (language === 'en' ? pkg.features.length : (pkg.enFeatures || []).length)).fill({ label: '', icon: '' })
        ]
      },
      ind: {
        title: language === 'ind' ? pkg.title : pkg.indTitle || '',
        subtitle: language === 'ind' ? pkg.subtitle : pkg.indSubtitle || '',
        features: [
          ...(language === 'ind' ? pkg.features : pkg.indFeatures || []),
          ...Array(6 - (language === 'ind' ? pkg.features.length : (pkg.indFeatures || []).length)).fill({ label: '', icon: '' })
        ]
      },
      price: pkg.price.toString(),
      seatsLeft: pkg.seatsLeft.toString(),
      totalSeats: pkg.totalSeats.toString(),
      imageUrl: pkg.imageUrl,
      image: null,
      tags: pkg.tags || [],
      packageType: pkg.packageType || '',
      subType: pkg.subType || ''
    });

    setSelectedTags(
      pkg.tags?.filter(
        tag =>
          !Object.keys(packageTypes).includes(tag) &&
          !Object.values(packageTypes).flat().includes(tag)
      ) || []
    );

    setSelectedPackageType((pkg.packageType || ''));
    setSelectedSubType(pkg.subType || '');
    setEditMode(true);
    setShowForm(true);
    setActiveStep(0); // Reset stepper on edit start
  };

  // Format price in Indonesian Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Render a tag pill
  const renderTag = (tag: string, isPrimary = false) => {
    const bgColors: Record<string, string> = {
      "Umrah Reguler": "bg-blue-600",
      "Umrah Edu Trip": "bg-purple-600",
      "Umrah Corporate": "bg-orange-600",
      "Umrah Plus Mancanegara": "bg-green-600",
      "Umrah Prestige": "bg-yellow-600",
      "Umrah Mandiri": "bg-gray-600",
      "Umrah Custom/Community": "bg-rose-600",
      default: isPrimary ? "bg-blue-600" : "bg-gray-500"
    };

    const bgColor = Object.keys(packageTypes).includes(tag)
      ? bgColors[tag]
      : bgColors.default;

    return (
      <span className={`${bgColor} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
        {tag}
      </span>
    );
  };

  // Render different content based on the stepper step index.
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // English Content
        return (
          <Grid container spacing={4} className='mt-4'>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                English Language Content
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <label className="block text-gray-700 mb-2">
                Package Title (EN) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.en.title}
                onChange={(e) => handleLanguageInputChange('en', 'title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g., Budget Umrah Plus Taif"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label className="block text-gray-700 mb-2">
                Package Subtitle (EN) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.en.subtitle}
                onChange={(e) => handleLanguageInputChange('en', 'subtitle', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g., 9 days from Jakarta, By Oman Air"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Features in English (up to 6)
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Use icons in &nbsp;
                <a target="_blank" className='text-blue-500' href="https://tabler.io/icons">
                  https://tabler.io/icons
                </a>
              </Typography>
              <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.paper' }}>
                <Grid container spacing={3}>
                  {formData.en.features.map((feature, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <FormControl fullWidth variant="outlined">
                              <TextField
                                fullWidth
                                label={`Feature ${index + 1}`}
                                value={feature.label}
                                onChange={(e) => handleFeatureChange('en', index, 'label', e.target.value)}
                                variant="outlined"
                                size="small"
                              />
                            </FormControl>
                            <FormControl sx={{ width: '40%' }} variant="outlined">
                              <Autocomplete
                                freeSolo
                                options={tablerIconsList}
                                value={feature.icon}
                                onInputChange={(event, newInputValue) => {
                                  handleFeatureChange('en', index, 'icon', newInputValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Icon"
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: feature.icon ? (
                                        <InputAdornment position="end">
                                          <Icon className={`tabler-${feature.icon}`} fontSize="small" />
                                        </InputAdornment>
                                      ) : null,
                                    }}
                                  />
                                )}
                              />
                            </FormControl>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        );
      case 1: // Indonesian Content
        return (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Indonesian Language Content
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <label className="block text-gray-700 mb-2">
                Package Title (IND) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.ind.title}
                onChange={(e) => handleLanguageInputChange('ind', 'title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="contoh: Umroh Hemat Plus Thaif"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label className="block text-gray-700 mb-2">
                Package Subtitle (IND) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.ind.subtitle}
                onChange={(e) => handleLanguageInputChange('ind', 'subtitle', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="contoh: Start Jakarta 9 hari, By Oman Air"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Features in Indonesian (up to 6)
              </Typography>
              <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.paper' }}>
                <Grid container spacing={3}>
                  {formData.ind.features.map((feature, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <FormControl fullWidth variant="outlined">
                              <TextField
                                fullWidth
                                label={`Fitur ${index + 1}`}
                                value={feature.label}
                                onChange={(e) => handleFeatureChange('ind', index, 'label', e.target.value)}
                                variant="outlined"
                                size="small"
                              />
                            </FormControl>
                            <FormControl sx={{ width: '40%' }} variant="outlined">
                              <Autocomplete
                                freeSolo
                                options={tablerIconsList}
                                value={feature.icon}
                                onInputChange={(event, newInputValue) => {
                                  handleFeatureChange('ind', index, 'icon', newInputValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Icon"
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: feature.icon ? (
                                        <InputAdornment position="end">
                                          <Icon className={`tabler-${feature.icon}`} fontSize="small" />
                                        </InputAdornment>
                                      ) : null,
                                    }}
                                  />
                                )}
                              />
                            </FormControl>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        );
      case 2: // Common Fields
        return (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Common Package Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <label className="block text-gray-700 mb-2">
                Price (IDR) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="price"
                value={formData.price ? formatPrice(Number(formData.price)) : ''}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g., 31.500.000"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Package Image
              </Typography>
              <div className="flex gap-4 mt-2">
                <Button variant="outlined" onClick={() => setIsImageModalOpen(true)}>
                  Select from Cloudinary
                </Button>
                {editMode && currentPackage?.imageUrl && !formData.image && !formData.imageUrl && (
                  <p className="text-sm text-gray-500 mt-1">
                    Current image will be kept if no new image is selected
                  </p>
                )}
                {formData.imageUrl && (
                  <Box component="img" src={formData.imageUrl} alt="Selected" sx={{ height: 60, borderRadius: 1 }} />
                )}
                {formData.image && (
                  <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2">
                      {formData.image.name} ({Math.round(formData.image.size / 1024)} KB)
                    </Typography>
                  </Box>
                )}
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <label className="block text-gray-700 mb-2">
                Available Seats <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="seatsLeft"
                value={formData.seatsLeft}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g., 15"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label className="block text-gray-700 mb-2">
                Total Seats <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g., 40"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label className="block text-gray-700 mb-2">
                Package Type <span className="text-red-500">*</span>
              </label>
              <select
                name="packageType"
                value={selectedPackageType}
                onChange={handleSelectChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Package Type</option>
                {Object.keys(packageTypes).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </Grid>
            {selectedPackageType && packageTypes[selectedPackageType].length > 0 && (
              <Grid item xs={12} md={6}>
                <label className="block text-gray-700 mb-2">Sub Type</label>
                <select
                  value={selectedSubType}
                  onChange={handleSubTypeChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Sub Type</option>
                  {packageTypes[selectedPackageType].map(subType => (
                    <option key={subType} value={subType}>{subType}</option>
                  ))}
                </select>
              </Grid>
            )}
            <Grid item xs={12}>
              <label className="block text-gray-700 mb-2">Additional Tags</label>
              <div className="flex flex-wrap gap-2">
                {filters.promos.map(promo => (
                  <button
                    key={promo.id}
                    type="button"
                    onClick={() => handleTagToggle(promo.name)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTags.includes(promo.name)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {promo.name}
                  </button>
                ))}
              </div>
              <label className="block text-gray-700 mb-2 mt-4">Departure Airport</label>
              <div className="flex flex-wrap gap-2">
                {filters.airports.map(airport => (
                  <button
                    key={airport.id}
                    type="button"
                    onClick={() => handleTagToggle(airport.code)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTags.includes(airport.code)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {airport.code} - {airport.name}
                  </button>
                ))}
              </div>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Language Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControl size="small">
          <InputLabel id="language-select-label">{t.languageLabel}</InputLabel>
          <Select
            labelId="language-select-label"
            value={language}
            onChange={handleLanguageChange}
            label={t.languageLabel}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ind">Indonesia</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <h1 className="text-3xl font-bold text-center mb-8">{props.title}</h1>
      {/* Admin Controls */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors"
          onClick={() => {
            setEditMode(false);
            setCurrentPackage(null);
            setFormData({ ...initialFormData });
            setSelectedTags([]);
            setSelectedPackageType('');
            setSelectedSubType('');
            setShowForm(!showForm);
            setActiveStep(0);
          }}
        >
          {showForm ? 'Cancel' : 'Add New Package'}
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-lg transition-colors"
          onClick={() => {
            fetchPackages();
            loadFilters();
          }}
        >
          Refresh
        </button>
      </div>

      {/* Add/Edit Form wrapped in a Stepper */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">{editMode ? 'Edit Package' : 'Add New Package'}</h2>
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
                    <div>
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
                    </div>
                  </Step>
                )
              })}
            </Stepper>
          </StepperWrapper>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (activeStep === steps.length - 1) {
                // Final step: submit form (add or update package)
                editMode ? handleUpdatePackage(e) : handleAddPackage(e);
              } else {
                setActiveStep((prev) => prev + 1);
              }
            }}
          >
            {renderStepContent(activeStep)}
            <div className="mt-8 flex justify-between">
              {activeStep > 0 && (
                <Button variant="tonal" onClick={() => setActiveStep((prev) => prev - 1)}>
                  {language === 'en' ? 'Back' : 'Kembali'}
                </Button>
              )}
              <Button type="submit" variant="contained">
                {activeStep === steps.length - 1
                  ? editMode
                    ? language === 'en'
                      ? 'Update Package'
                      : 'Perbarui Paket'
                    : language === 'en'
                      ? 'Add Package'
                      : 'Tambah Paket'
                  : language === 'en'
                    ? 'Next'
                    : 'Lanjut'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {isLoading && !showForm && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2">Loading packages...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div className="relative aspect-[3/2] bg-gray-200">
              <img
                className="w-full h-full object-contain"
                src={plan.imageUrl || "/api/placeholder/400/320"}
                alt="package"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEditPackage(plan)}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                  title="Edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => plan.id && handleDeletePackage(plan.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {plan.packageType && renderTag(plan.packageType, true)}
                {plan.subType && renderTag(plan.subType)}
                {plan.tags
                  ?.filter((tag) => tag !== plan.packageType && tag !== plan.subType)
                  .map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
              <h3 className="text-xl font-bold text-center mb-2">{plan.title}</h3>
              <p className="text-gray-500 text-center italic mb-4">{plan.subtitle}</p>
              <p className="text-2xl font-bold text-center text-rose-800 mb-6">
                {formatPrice(plan.price)}
              </p>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {feature.icon === '' ? (
                      <span
                        className={`w-5 h-5 flex items-center justify-center rounded-full text-white ${
                          idx < 3
                            ? 'bg-blue-500'
                            : idx < 6
                              ? 'bg-green-500'
                              : 'bg-yellow-500'
                        }`}
                      >
                        ✓
                      </span>
                    ) : (
                      <i className={`tabler-${feature.icon} text-blue-600 text-lg`} />
                    )}
                    <span className="text-gray-600">{feature.label}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="mb-6">
                <p className="font-bold mb-2">{plan.seatsLeft} seats left!</p>
                <div className="h-2 bg-rose-100 rounded-full">
                  <div
                    className="h-full bg-rose-800 rounded-full"
                    style={{
                      width: `${(plan.seatsLeft / plan.totalSeats) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
              <button
                className="w-full bg-rose-800 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => router.push(`/package/umrah/details?id=${plan.id}`)}
              >
                <i className="tabler-user-search"></i>
                Detail Paket
              </button>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && packages.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">
            No packages found
          </h3>
          <p className="mt-2 text-gray-500">
            Get started by creating your first travel package.
          </p>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors"
            onClick={() => setShowForm(true)}
          >
            Add Package
          </button>
        </div>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled">
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Cloudinary Image Selection Modal */}
      <ImageSelectionModal
        open={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSelect={handleCloudinaryImageSelect}
      />
    </div>
  );
};

export default UmrahPackagesManagement;

