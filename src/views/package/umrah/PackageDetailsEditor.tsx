'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  Snackbar,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import { Trash2 as DeleteIcon, Plus as AddIcon, Save as SaveIcon } from 'lucide-react';
import {
  packageDetailsService,
  UmrahPackageDetails,
  UmrahPackageDetailsInput,
  UmrahPackageTranslation
} from '@/services/packageDetails';
import { umrahPackageservice, UmrahPackage } from '@/services/package';
import { getLanguage } from '@/utils/getLanguage'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`package-details-tabpanel-${index}`}
      aria-labelledby={`package-details-tab-${index}`}
      {...other}
    >
      {value === index && <Box component="div" sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `package-details-tab-${index}`,
    'aria-controls': `package-details-tabpanel-${index}`,
  };
}

const initialTranslationState: UmrahPackageTranslation = {
  airline: '',
  phone: '',
  peopleInRoom: '',
  duration: '',
  departureDate: '',
  nextManasik: '',
  includedItems: [''],
  excludedItems: [''],
  hotels: [
    {
      city: '',
      name: '',
      distance: '',
      rating: 0,
      mapUrl: ''
    }
  ],
  itinerary: [
    {
      day: 1,
      title: '',
      description: '',
      activities: ['']
    }
  ],
  requirements: [''],
  terms: [''],
  facilities: [
    {
      title: '',
      description: ''
    }
  ],
  additionalInformation: ''
};

// Define translations for UI elements
const translations = {
  en: {
    headerTitle: (hasDetails: boolean) => hasDetails ? 'Edit Package Details' : 'Create Package Details',
    packageSelectLabel: 'Package',
    languageLabel: 'Language',
    addIncluded: 'Add Included Item',
    addExcluded: 'Add Excluded Item',
    saveButton: 'Save Package Details',
    addHotel: 'Add Hotel',
    addFacility: 'Add Facility',
    addItineraryDay: 'Add Itinerary Day',
    addActivity: 'Add Activity',
    basicInfo: 'Basic Info',
    inclusionsExclusions: 'Inclusions & Exclusions',
    hotels: 'Hotels',
    itinerary: 'Itinerary',
    requirementsTerms: 'Requirements & Terms',
    facilities: 'Facilities',
    airline: 'Airline',
    peopleInRoom: 'People In Room',
    duration: 'Duration',
    departureDate: 'Departure Date',
    nextManasik: 'Next Manasik Date',
    additionalInfo: 'Additional Information',
    includedItems: 'Included Items',
    excludedItems: 'Excluded Items',
    hotel: 'Hotel',
    day: 'Day',
    city: 'City',
    hotelName: 'Hotel Name',
    distance: 'Distance',
    mapUrl: 'Map URL',
    rating: 'Rating',
    title: 'Title',
    description: 'Description',
    activity: 'Activity',
    facility: 'Facility',
    remove: 'Remove',
    removeDay: 'Remove Day',
    cancel: 'Cancel',
    addTerm: 'Add Term',
    addRequirement: 'Add Requirement',
    terms: 'Terms',
    requirements: 'Requirements',
    term: 'Term',
    requirement: 'Requirement',
    phone: 'Phone Number'
  },
  ind: {
    headerTitle: (hasDetails: boolean) => hasDetails ? 'Ubah Detail Paket' : 'Buat Detail Paket',
    packageSelectLabel: 'Paket',
    languageLabel: 'Bahasa',
    addIncluded: 'Tambah Item Termasuk',
    addExcluded: 'Tambah Item Tidak Termasuk',
    saveButton: 'Simpan Detail Paket',
    addHotel: 'Tambah Hotel',
    addFacility: 'Tambah Fasilitas',
    addItineraryDay: 'Tambah Hari Itinerary',
    addActivity: 'Tambah Aktivitas',
    basicInfo: 'Informasi Dasar',
    inclusionsExclusions: 'Termasuk & Tidak Termasuk',
    hotels: 'Hotel',
    itinerary: 'Itinerary',
    requirementsTerms: 'Persyaratan & Ketentuan',
    facilities: 'Fasilitas',
    airline: 'Maskapai',
    peopleInRoom: 'Orang Dalam Kamar',
    duration: 'Durasi',
    departureDate: 'Tanggal Keberangkatan',
    nextManasik: 'Tanggal Manasik Berikutnya',
    additionalInfo: 'Informasi Tambahan',
    includedItems: 'Item Termasuk',
    excludedItems: 'Item Tidak Termasuk',
    hotel: 'Hotel',
    day: 'Hari',
    city: 'Kota',
    hotelName: 'Nama Hotel',
    distance: 'Jarak',
    mapUrl: 'URL Peta',
    rating: 'Rating',
    title: 'Judul',
    description: 'Deskripsi',
    activity: 'Aktivitas',
    facility: 'Fasilitas',
    remove: 'Hapus',
    removeDay: 'Hapus Hari',
    cancel: 'Batal',
    addTerm: 'Tambahkan Ketentuan',
    addRequirement: 'Tambahkan Persyaratan',
    term: 'Ketentuan',
    requirement: 'Persyaratan',
    terms: 'Ketentuan',
    requirements: 'Persyaratan',
    phone: 'Nomor HP'
  }
};
export default function PackageDetailsEditor({ packageId, tipePaket }: { packageId: string, tipePaket:string }) {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' });

  // Track translations for both languages
  const [enPackageData, setEnPackageData] = useState<UmrahPackageTranslation>(initialTranslationState);
  const [indPackageData, setIndPackageData] = useState<UmrahPackageTranslation>(initialTranslationState);

  const [packageInfo, setPackageInfo] = useState<UmrahPackage | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [allPackages, setAllPackages] = useState<UmrahPackage[]>([]);
  const [language, setLanguage] = useState<'en' | 'ind'>(getLanguage());
  const [selectedPackageId, setSelectedPackageId] = useState<string>(packageId || '');
  const [allTranslations, setAllTranslations] = useState<{
    en?: UmrahPackageTranslation;
    ind?: UmrahPackageTranslation;
  }>({});

  // Get translated text based on current language
  const t = translations[language];

  // Function to handle language change
  const handleLanguageChange = (event: SelectChangeEvent<'en' | 'ind'>) => {
    const newLang = event.target.value as 'en' | 'ind';
    localStorage.setItem('I18N_LANGUAGE', newLang);
    setLanguage(newLang);
  };

  // Helper to get the current language's data
  const getCurrentLanguageData = (): UmrahPackageTranslation => {
    return language === 'en' ? enPackageData : indPackageData;
  };

  // Helper to set the current language's data
  const setCurrentLanguageData = (data: UmrahPackageTranslation) => {
    if (language === 'en') {
      setEnPackageData(data);
    } else {
      setIndPackageData(data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch all packages for dropdown
        const packages = await umrahPackageservice.getPackages(tipePaket);
        setAllPackages(packages);

        if (packageId) {
          // Try to get the package info
          const packageData = packages.find(p => p.id === packageId);
          if (packageData) {
            setPackageInfo(packageData);
            setSelectedPackageId(packageId);

            // Check if details already exist for this package
            const details = await packageDetailsService.getPackageDetails(packageId);
            if (details) {
              setAllTranslations(details.translations || {});
              setDetailsId(details.id || null);

              // Set data for both languages
              setEnPackageData(details.translations?.en || initialTranslationState);
              setIndPackageData(details.translations?.ind || initialTranslationState);
            } else {
              setEnPackageData(initialTranslationState);
              setIndPackageData(initialTranslationState);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showNotification("Error loading data", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [packageId]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ open: true, message, type });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // General form input handlers
  const handleInputChange = (field: keyof UmrahPackageTranslation, value: any) => {
    setCurrentLanguageData({ ...getCurrentLanguageData(), [field]: value });
  };

  // Handle array field changes (includedItems, excludedItems, requirements, terms)
  const handleArrayItemChange = (
    field: keyof UmrahPackageTranslation,
    index: number,
    value: string
  ) => {
    const currentData = getCurrentLanguageData();
    const array = [...(currentData[field] as string[])];
    array[index] = value;
    setCurrentLanguageData({ ...currentData, [field]: array });
  };

  // Add new item to an array field
  const handleAddArrayItem = (field: keyof UmrahPackageTranslation) => {
    const currentData = getCurrentLanguageData();
    const array = [...(currentData[field] as any[]), ''];
    setCurrentLanguageData({ ...currentData, [field]: array });
  };

  // Remove item from an array field
  const handleRemoveArrayItem = (field: keyof UmrahPackageTranslation, index: number) => {
    const currentData = getCurrentLanguageData();
    const array = [...(currentData[field] as any[])];
    array.splice(index, 1);
    setCurrentLanguageData({ ...currentData, [field]: array });
  };

  // Handle hotel changes
  const handleHotelChange = (index: number, field: keyof UmrahPackageTranslation['hotels'][0], value: any) => {
    const currentData = getCurrentLanguageData();
    const hotels = [...currentData.hotels];
    hotels[index] = { ...hotels[index], [field]: value };
    setCurrentLanguageData({ ...currentData, hotels });
  };

  // Add new hotel
  const handleAddHotel = () => {
    const currentData = getCurrentLanguageData();
    setCurrentLanguageData({
      ...currentData,
      hotels: [
        ...currentData.hotels,
        {
          city: '',
          name: '',
          distance: '',
          rating: 0,
          mapUrl: ''
        }
      ]
    });
  };

  // Remove hotel
  const handleRemoveHotel = (index: number) => {
    const currentData = getCurrentLanguageData();
    const hotels = [...currentData.hotels];
    hotels.splice(index, 1);
    setCurrentLanguageData({ ...currentData, hotels });
  };

  // Handle itinerary changes
  const handleItineraryChange = (
    index: number,
    field: keyof UmrahPackageTranslation['itinerary'][0],
    value: any
  ) => {
    const currentData = getCurrentLanguageData();
    const itinerary = [...currentData.itinerary];
    itinerary[index] = { ...itinerary[index], [field]: value };
    setCurrentLanguageData({ ...currentData, itinerary });
  };

  // Handle itinerary activity changes
  const handleItineraryActivityChange = (dayIndex: number, activityIndex: number, value: string) => {
    const currentData = getCurrentLanguageData();
    const itinerary = [...currentData.itinerary];
    const activities = [...(itinerary[dayIndex].activities || [])];
    activities[activityIndex] = value;
    itinerary[dayIndex] = { ...itinerary[dayIndex], activities };
    setCurrentLanguageData({ ...currentData, itinerary });
  };

  // Add new activity to a day
  const handleAddActivity = (dayIndex: number) => {
    const currentData = getCurrentLanguageData();
    const itinerary = [...currentData.itinerary];
    const activities = [...(itinerary[dayIndex].activities || []), ''];
    itinerary[dayIndex] = { ...itinerary[dayIndex], activities };
    setCurrentLanguageData({ ...currentData, itinerary });
  };

  // Remove activity from a day
  const handleRemoveActivity = (dayIndex: number, activityIndex: number) => {
    const currentData = getCurrentLanguageData();
    const itinerary = [...currentData.itinerary];
    const activities = [...(itinerary[dayIndex].activities || [])];
    activities.splice(activityIndex, 1);
    itinerary[dayIndex] = { ...itinerary[dayIndex], activities };
    setCurrentLanguageData({ ...currentData, itinerary });
  };

  // Add new itinerary day
  const handleAddItineraryDay = () => {
    const currentData = getCurrentLanguageData();
    const lastDay = currentData.itinerary.length > 0
      ? currentData.itinerary[currentData.itinerary.length - 1].day
      : 0;

    setCurrentLanguageData({
      ...currentData,
      itinerary: [
        ...currentData.itinerary,
        {
          day: lastDay + 1,
          title: '',
          description: '',
          activities: ['']
        }
      ]
    });
  };

  // Remove itinerary day
  const handleRemoveItineraryDay = (index: number) => {
    const currentData = getCurrentLanguageData();
    const itinerary = [...currentData.itinerary];
    itinerary.splice(index, 1);
    // Reorder days
    setCurrentLanguageData({
      ...currentData,
      itinerary: itinerary.map((day, idx) => ({ ...day, day: idx + 1 }))
    });
  };

  // Handle facility changes
  const handleFacilityChange = (
    index: number,
    field: keyof UmrahPackageTranslation['facilities'][0],
    value: string
  ) => {
    const currentData = getCurrentLanguageData();
    const facilities = [...currentData.facilities];
    facilities[index] = { ...facilities[index], [field]: value };
    setCurrentLanguageData({ ...currentData, facilities });
  };

  // Add new facility
  const handleAddFacility = () => {
    const currentData = getCurrentLanguageData();
    setCurrentLanguageData({
      ...currentData,
      facilities: [
        ...currentData.facilities,
        {
          title: '',
          description: ''
        }
      ]
    });
  };

  // Remove facility
  const handleRemoveFacility = (index: number) => {
    const currentData = getCurrentLanguageData();
    const facilities = [...currentData.facilities];
    facilities.splice(index, 1);
    setCurrentLanguageData({ ...currentData, facilities });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Validate
      if (!selectedPackageId) {
        throw new Error("Package ID is required");
      }

      // Create translations object with both languages
      const translations = {
        en: enPackageData,
        ind: indPackageData
      };

      // Use the new savePackageDetails method that handles both languages
      const newDetailsId = await packageDetailsService.savePackageDetails({
        packageId: selectedPackageId,
        translations
      });

      if (newDetailsId) {
        setDetailsId(newDetailsId);
        setAllTranslations(translations);

        showNotification(
          detailsId
            ? "Package details updated successfully in all languages"
            : "Package details created successfully in all languages",
          "success"
        );
      }

    } catch (error) {
      console.error("Error saving package details:", error);
      let errorMessage = "Failed to save package details";
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      showNotification(errorMessage, "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle package selection change
  const handlePackageChange = async (packageId: string) => {
    try {
      setIsLoading(true);
      setSelectedPackageId(packageId);

      // Reset form for new package
      setAllTranslations({});
      setEnPackageData(initialTranslationState);
      setIndPackageData(initialTranslationState);
      setDetailsId(null);

      // Find package info
      const packageData = allPackages.find(p => p.id === packageId);
      setPackageInfo(packageData || null);

      // Check if details already exist
      const details = await packageDetailsService.getPackageDetails(packageId);
      if (details) {
        setAllTranslations(details.translations || {});
        setDetailsId(details.id || null);

        // Set data for both languages
        setEnPackageData(details.translations?.en || initialTranslationState);
        setIndPackageData(details.translations?.ind || initialTranslationState);
      }

      // Update URL
      router.push(`/admin/packages/${packageId}/edit-details`);

    } catch (error) {
      console.error("Error changing package:", error);
      showNotification("Error loading package details", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box component="div" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Language Switch UI */}
      <Box component="div" sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
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

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t.headerTitle(!!detailsId)}
        </Typography>

        {/* Package Selection */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="package-select-label">{t.packageSelectLabel}</InputLabel>
          <Select
            labelId="package-select-label"
            value={selectedPackageId}
            label={t.packageSelectLabel}
            onChange={(e) => handlePackageChange(e.target.value)}
          >
            {allPackages?.map((pkg) => (
              <MenuItem key={pkg.id} value={pkg.id}>
                {pkg.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Package Info Card */}
        {packageInfo && (
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6">{packageInfo.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {packageInfo.subtitle}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography variant="body2">
                      Price: IDR {packageInfo.price.toLocaleString('id-ID')}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={packageInfo.seatsLeft < 5 ? "error.main" : "text.secondary"}
                    >
                      Seats: {packageInfo.seatsLeft}/{packageInfo.totalSeats}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <Box component="div" sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Box component="div" sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="package details tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label={t.basicInfo} {...a11yProps(0)} />
                <Tab label={t.inclusionsExclusions} {...a11yProps(1)} />
                <Tab label={t.hotels} {...a11yProps(2)} />
                <Tab label={t.itinerary} {...a11yProps(3)} />
                <Tab label={t.requirementsTerms} {...a11yProps(4)} />
                <Tab label={t.facilities} {...a11yProps(5)} />
              </Tabs>
            </Box>

            {/* Basic Info Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t.airline}
                    value={getCurrentLanguageData().airline}
                    onChange={(e) => handleInputChange('airline', e.target.value)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t.peopleInRoom}
                    value={getCurrentLanguageData().peopleInRoom}
                    onChange={(e) => handleInputChange('peopleInRoom', e.target.value)}
                    margin="normal"
                    placeholder={language === 'en' ? "e.g. Quad (4 people/room)" : "contoh: Quad (4 orang/kamar)"}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t.duration}
                    value={getCurrentLanguageData().duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    margin="normal"
                    placeholder={language === 'en' ? "e.g. 9 Days" : "contoh: 9 Hari"}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t.departureDate}
                    value={getCurrentLanguageData().departureDate}
                    onChange={(e) => handleInputChange('departureDate', e.target.value)}
                    margin="normal"
                    placeholder={language === 'en' ? "e.g. April 15, 2025" : "contoh: 15 April 2025"}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t.nextManasik}
                    value={getCurrentLanguageData().nextManasik}
                    onChange={(e) => handleInputChange('nextManasik', e.target.value)}
                    margin="normal"
                    placeholder={language === 'en' ? "e.g. April 1, 2025" : "contoh: 1 April 2025"}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t.phone}
                    value={getCurrentLanguageData().phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    margin="normal"
                    placeholder={language === 'en' ? "e.g. 0890000" : "contoh: 62850000"}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label={t.additionalInfo}
                    value={getCurrentLanguageData().additionalInformation || ''}
                    onChange={(e) => handleInputChange('additionalInformation', e.target.value)}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Inclusions & Exclusions Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box component="div" sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {t.includedItems}
                </Typography>
                {getCurrentLanguageData().includedItems?.map((item, index) => (
                  <Box component="div" key={`included-${index}`} sx={{ display: 'flex', mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`${t.includedItems} ${index + 1}`}
                      value={item}
                      onChange={(e) => handleArrayItemChange('includedItems', index, e.target.value)}
                      margin="normal"
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveArrayItem('includedItems', index)}
                      disabled={getCurrentLanguageData().includedItems.length <= 1}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddArrayItem('includedItems')}
                >
                  {t.addIncluded}
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box component="div">
                <Typography variant="h6" gutterBottom>
                  {t.excludedItems}
                </Typography>
                {getCurrentLanguageData().excludedItems?.map((item, index) => (
                  <Box component="div" key={`excluded-${index}`} sx={{ display: 'flex', mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`${t.excludedItems} ${index + 1}`}
                      value={item}
                      onChange={(e) => handleArrayItemChange('excludedItems', index, e.target.value)}
                      margin="normal"
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveArrayItem('excludedItems', index)}
                      disabled={getCurrentLanguageData().excludedItems.length <= 1}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddArrayItem('excludedItems')}
                >
                  {t.addExcluded}
                </Button>
              </Box>
            </TabPanel>

            {/* Hotels Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                {t.hotels}
              </Typography>
              {getCurrentLanguageData().hotels?.map((hotel, index) => (
                <Card key={`hotel-${index}`} sx={{ mb: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label={t.city}
                          value={hotel.city}
                          onChange={(e) => handleHotelChange(index, 'city', e.target.value)}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label={t.hotelName}
                          value={hotel.name}
                          onChange={(e) => handleHotelChange(index, 'name', e.target.value)}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label={t.distance}
                          value={hotel.distance}
                          onChange={(e) => handleHotelChange(index, 'distance', e.target.value)}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label={t.mapUrl}
                          value={hotel.mapUrl}
                          onChange={(e) => handleHotelChange(index, 'mapUrl', e.target.value)}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography component="legend">{t.rating}</Typography>
                        <Rating
                          value={hotel.rating}
                          onChange={(_, newValue) => handleHotelChange(index, 'rating', newValue)}
                          precision={0.5}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box component="div" sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleRemoveHotel(index)}
                          >
                            {t.remove || 'Remove'}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddHotel}
                sx={{ mb: 4 }}
              >
                {t.addHotel}
              </Button>
            </TabPanel>

            {/* Itinerary Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>
                {t.itinerary}
              </Typography>
              {getCurrentLanguageData().itinerary?.map((day, index) => (
                <Card key={`itinerary-${index}`} sx={{ mb: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={2}>
                        <TextField
                          fullWidth
                          label={t.day}
                          value={day.day}
                          InputProps={{
                            readOnly: true,
                          }}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={10}>
                        <TextField
                          fullWidth
                          label={t.title}
                          value={day.title}
                          onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label={t.description}
                          value={day.description}
                          onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          {t.activity}
                        </Typography>
                        {day.activities?.map((activity, activityIndex) => (
                          <Box component="div" key={`activity-${activityIndex}`} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TextField
                              fullWidth
                              label={`${t.activity} ${activityIndex + 1}`}
                              value={activity}
                              onChange={(e) => handleItineraryActivityChange(index, activityIndex, e.target.value)}
                              margin="normal"
                            />
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveActivity(index, activityIndex)}
                              disabled={(day.activities ?? []).length <= 1}
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ))}
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => handleAddActivity(index)}
                          sx={{ mb: 2 }}
                        >
                          {t.addActivity}
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Box component="div" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleRemoveItineraryDay(index)}
                          >
                            {t.removeDay || 'Remove Day'}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddItineraryDay}
                sx={{ mb: 4 }}
              >
                {t.addItineraryDay}
              </Button>
            </TabPanel>

            {/* Requirements & Terms Tab */}
            <TabPanel value={tabValue} index={4}>
              <Typography variant="h6" gutterBottom>
                {t.requirementsTerms}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%', p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      {t.requirements || 'Requirements'}
                    </Typography>
                    {getCurrentLanguageData().requirements?.map((req, index) => (
                      <Box component="div" key={`requirement-${index}`} sx={{ display: 'flex', mb: 2 }}>
                        <TextField
                          fullWidth
                          label={`${t.requirement || 'Requirement'} ${index + 1}`}
                          value={req}
                          onChange={(e) => handleArrayItemChange('requirements', index, e.target.value)}
                          margin="normal"
                        />
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveArrayItem('requirements', index)}
                          disabled={getCurrentLanguageData().requirements.length <= 1}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddArrayItem('requirements')}
                    >
                      {t.addRequirement || 'Add Requirement'}
                    </Button>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%', p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      {t.terms || 'Terms'}
                    </Typography>
                    {getCurrentLanguageData().terms?.map((term, index) => (
                      <Box component="div" key={`term-${index}`} sx={{ display: 'flex', mb: 2 }}>
                        <TextField
                          fullWidth
                          label={`${t.term || 'Term'} ${index + 1}`}
                          value={term}
                          onChange={(e) => handleArrayItemChange('terms', index, e.target.value)}
                          margin="normal"
                        />
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveArrayItem('terms', index)}
                          disabled={getCurrentLanguageData().terms.length <= 1}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddArrayItem('terms')}
                    >
                      {t.addTerm || 'Add Term'}
                    </Button>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Facilities Tab */}
            <TabPanel value={tabValue} index={5}>
              <Typography variant="h6" gutterBottom>
                {t.facilities}
              </Typography>
              <Grid container spacing={2}>
                {getCurrentLanguageData().facilities?.map((facility, index) => (
                  <Grid item xs={12} md={6} key={`facility-${index}`}>
                    <Card sx={{ mb: 2, borderRadius: 2 }}>
                      <CardContent>
                        <TextField
                          fullWidth
                          label={t.title}
                          value={facility.title}
                          onChange={(e) => handleFacilityChange(index, 'title', e.target.value)}
                          margin="normal"
                        />
                        <TextField
                          fullWidth
                          label={t.description}
                          value={facility.description}
                          onChange={(e) => handleFacilityChange(index, 'description', e.target.value)}
                          margin="normal"
                        />
                        <Box component="div" sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveFacility(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddFacility}
                sx={{ mt: 2, mb: 4 }}
              >
                {t.addFacility}
              </Button>
            </TabPanel>

            {/* Save Button */}
            <Box component="div" sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => window.history.back()}
              >
                {t.cancel || 'Cancel'}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={isSaving}
              >
                {t.saveButton}
              </Button>
            </Box>
          </form>
        )}
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
