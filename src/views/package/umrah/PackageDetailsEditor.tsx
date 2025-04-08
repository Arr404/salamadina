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
  Alert
} from '@mui/material';
import { Trash2 as DeleteIcon, Plus as AddIcon, Save as SaveIcon } from 'lucide-react';
import { packageDetailsService, UmrahPackageDetails, UmrahPackageDetailsInput } from '@/services/packageDetails';
import { umrahPackageservice, UmrahPackage } from '@/services/package';

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `package-details-tab-${index}`,
    'aria-controls': `package-details-tabpanel-${index}`,
  };
}

const initialDetailState: UmrahPackageDetailsInput = {
  packageId: '',
  airline: '',
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

export default function PackageDetailsEditor({ packageId }: { packageId: string }) {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' });
  const [packageDetails, setPackageDetails] = useState<UmrahPackageDetailsInput>(initialDetailState);
  const [packageInfo, setPackageInfo] = useState<UmrahPackage | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [allPackages, setAllPackages] = useState<UmrahPackage[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch all packages for dropdown
        const packages = await umrahPackageservice.getPackages();
        setAllPackages(packages);

        if (packageId) {
          // Try to get the package info
          const packageData = packages.find(p => p.id === packageId);
          if (packageData) {
            setPackageInfo(packageData);
            setPackageDetails(prev => ({ ...prev, packageId: packageId }));

            // Check if [packageId] already exist for this package
            const details = await packageDetailsService.getPackageDetails(packageId);
            if (details) {
              setPackageDetails(details);
              setDetailsId(details.id || null);
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
  const handleInputChange = (field: keyof UmrahPackageDetailsInput, value: any) => {
    setPackageDetails(prev => ({ ...prev, [field]: value }));
  };

  // Handle array field changes (includedItems, excludedItems, etc.)
  const handleArrayItemChange = (
    field: keyof UmrahPackageDetailsInput,
    index: number,
    value: string
  ) => {
    setPackageDetails(prev => {
      const array = [...(prev[field] as string[])];
      array[index] = value;
      return { ...prev, [field]: array };
    });
  };

  // Add new item to an array field
  const handleAddArrayItem = (field: keyof UmrahPackageDetailsInput) => {
    setPackageDetails(prev => {
      const array = [...(prev[field] as any[]), ''];
      return { ...prev, [field]: array };
    });
  };

  // Remove item from an array field
  const handleRemoveArrayItem = (field: keyof UmrahPackageDetailsInput, index: number) => {
    setPackageDetails(prev => {
      const array = [...(prev[field] as any[])];
      array.splice(index, 1);
      return { ...prev, [field]: array };
    });
  };

  // Handle hotel changes
  const handleHotelChange = (index: number, field: keyof UmrahPackageDetails['hotels'][0], value: any) => {
    setPackageDetails(prev => {
      const hotels = [...prev.hotels];
      hotels[index] = { ...hotels[index], [field]: value };
      return { ...prev, hotels };
    });
  };

  // Add new hotel
  const handleAddHotel = () => {
    setPackageDetails(prev => ({
      ...prev,
      hotels: [
        ...prev.hotels,
        {
          city: '',
          name: '',
          distance: '',
          rating: 0,
          mapUrl: ''
        }
      ]
    }));
  };

  // Remove hotel
  const handleRemoveHotel = (index: number) => {
    setPackageDetails(prev => {
      const hotels = [...prev.hotels];
      hotels.splice(index, 1);
      return { ...prev, hotels };
    });
  };

  // Handle itinerary changes
  const handleItineraryChange = (
    index: number,
    field: keyof UmrahPackageDetails['itinerary'][0],
    value: any
  ) => {
    setPackageDetails(prev => {
      const itinerary = [...prev.itinerary];
      itinerary[index] = { ...itinerary[index], [field]: value };
      return { ...prev, itinerary };
    });
  };

  // Handle itinerary activity changes
  const handleItineraryActivityChange = (dayIndex: number, activityIndex: number, value: string) => {
    setPackageDetails(prev => {
      const itinerary = [...prev.itinerary];
      const activities = [...(itinerary[dayIndex].activities || [])];
      activities[activityIndex] = value;
      itinerary[dayIndex] = { ...itinerary[dayIndex], activities };
      return { ...prev, itinerary };
    });
  };

  // Add new activity to a day
  const handleAddActivity = (dayIndex: number) => {
    setPackageDetails(prev => {
      const itinerary = [...prev.itinerary];
      const activities = [...(itinerary[dayIndex].activities || []), ''];
      itinerary[dayIndex] = { ...itinerary[dayIndex], activities };
      return { ...prev, itinerary };
    });
  };

  // Remove activity from a day
  const handleRemoveActivity = (dayIndex: number, activityIndex: number) => {
    setPackageDetails(prev => {
      const itinerary = [...prev.itinerary];
      const activities = [...(itinerary[dayIndex].activities || [])];
      activities.splice(activityIndex, 1);
      itinerary[dayIndex] = { ...itinerary[dayIndex], activities };
      return { ...prev, itinerary };
    });
  };

  // Add new itinerary day
  const handleAddItineraryDay = () => {
    setPackageDetails(prev => {
      const lastDay = prev.itinerary.length > 0
        ? prev.itinerary[prev.itinerary.length - 1].day
        : 0;

      return {
        ...prev,
        itinerary: [
          ...prev.itinerary,
          {
            day: lastDay + 1,
            title: '',
            description: '',
            activities: ['']
          }
        ]
      };
    });
  };

  // Remove itinerary day
  const handleRemoveItineraryDay = (index: number) => {
    setPackageDetails(prev => {
      const itinerary = [...prev.itinerary];
      itinerary.splice(index, 1);
      // Reorder days
      return {
        ...prev,
        itinerary: itinerary.map((day, idx) => ({ ...day, day: idx + 1 }))
      };
    });
  };

  // Handle facility changes
  const handleFacilityChange = (
    index: number,
    field: keyof UmrahPackageDetails['facilities'][0],
    value: string
  ) => {
    setPackageDetails(prev => {
      const facilities = [...prev.facilities];
      facilities[index] = { ...facilities[index], [field]: value };
      return { ...prev, facilities };
    });
  };

  // Add new facility
  const handleAddFacility = () => {
    setPackageDetails(prev => ({
      ...prev,
      facilities: [
        ...prev.facilities,
        {
          title: '',
          description: ''
        }
      ]
    }));
  };

  // Remove facility
  const handleRemoveFacility = (index: number) => {
    setPackageDetails(prev => {
      const facilities = [...prev.facilities];
      facilities.splice(index, 1);
      return { ...prev, facilities };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Validate
      if (!packageDetails.packageId) {
        throw new Error("Package ID is required");
      }

      if (detailsId) {
        // Update existing [packageId]
        await packageDetailsService.updatePackageDetails(detailsId, packageDetails);
        showNotification("Package [packageId] updated successfully", "success");
      } else {
        // Create new [packageId]
        const newDetailsId = await packageDetailsService.addPackageDetails(packageDetails);
        setDetailsId(newDetailsId);
        showNotification("Package [packageId] created successfully", "success");
      }

      // Redirect to package view
      setTimeout(() => {
        router.push(`/admin/packages/${packageDetails.packageId}/details`);
      }, 2000);

    } catch (error) {
      console.error("Error saving package [packageId]:", error);
      let errorMessage = "Failed to save package [packageId]";
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

      // Reset form when changing package
      setPackageDetails({ ...initialDetailState, packageId });
      setDetailsId(null);

      // Find package info
      const packageData = allPackages.find(p => p.id === packageId);
      setPackageInfo(packageData || null);

      // Check if [packageId] already exist
      const details = await packageDetailsService.getPackageDetails(packageId);
      if (details) {
        setPackageDetails(details);
        setDetailsId(details.id || null);
      }

      // Update URL
      router.push(`/admin/packages/${packageId}/edit-details`);

    } catch (error) {
      console.error("Error changing package:", error);
      showNotification("Error loading package [packageId]", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {detailsId ? 'Edit Package Details' : 'Create Package Details'}
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="package-select-label">Package</InputLabel>
          <Select
            labelId="package-select-label"
            value={packageDetails.packageId}
            label="Package"
            onChange={(e) => handlePackageChange(e.target.value)}
          >
            {allPackages?.map((pkg) => (
              <MenuItem key={pkg.id} value={pkg.id}>
                {pkg.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {packageInfo && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6">{packageInfo.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {packageInfo.subtitle}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" align="right">
                    Price: IDR {packageInfo.price.toLocaleString('id-ID')}
                  </Typography>
                  <Typography variant="body2" align="right">
                    Seats: {packageInfo.seatsLeft}/{packageInfo.totalSeats}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="package details tabs">
              <Tab label="Basic Info" {...a11yProps(0)} />
              <Tab label="Inclusions & Exclusions" {...a11yProps(1)} />
              <Tab label="Hotels" {...a11yProps(2)} />
              <Tab label="Itinerary" {...a11yProps(3)} />
              <Tab label="Requirements & Terms" {...a11yProps(4)} />
              <Tab label="Facilities" {...a11yProps(5)} />
            </Tabs>
          </Box>

          {/* Basic Info Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Airline"
                  value={packageDetails.airline}
                  onChange={(e) => handleInputChange('airline', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="People In Room"
                  value={packageDetails.peopleInRoom}
                  onChange={(e) => handleInputChange('peopleInRoom', e.target.value)}
                  margin="normal"
                  placeholder="e.g. Quad (4 orang/kamar)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Duration"
                  value={packageDetails.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  margin="normal"
                  placeholder="e.g. 9 Hari"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Departure Date"
                  value={packageDetails.departureDate}
                  onChange={(e) => handleInputChange('departureDate', e.target.value)}
                  margin="normal"
                  placeholder="e.g. 15 April 2025"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Next Manasik Date"
                  value={packageDetails.nextManasik}
                  onChange={(e) => handleInputChange('nextManasik', e.target.value)}
                  margin="normal"
                  placeholder="e.g. 1 April 2025"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Additional Information"
                  value={packageDetails.additionalInformation || ''}
                  onChange={(e) => handleInputChange('additionalInformation', e.target.value)}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Inclusions & Exclusions Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Included Items
            </Typography>
            {packageDetails?.includedItems?.map((item, index) => (
              <Box key={`included-${index}`} sx={{ display: 'flex', mb: 2 }}>
                <TextField
                  fullWidth
                  label={`Item ${index + 1}`}
                  value={item}
                  onChange={(e) => handleArrayItemChange('includedItems', index, e.target.value)}
                  margin="normal"
                />
                <IconButton
                  onClick={() => handleRemoveArrayItem('includedItems', index)}
                  disabled={packageDetails.includedItems.length <= 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleAddArrayItem('includedItems')}
              sx={{ mb: 4 }}
            >
              Add Included Item
            </Button>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Excluded Items
            </Typography>
            {packageDetails?.excludedItems?.map((item, index) => (
              <Box key={`excluded-${index}`} sx={{ display: 'flex', mb: 2 }}>
                <TextField
                  fullWidth
                  label={`Item ${index + 1}`}
                  value={item}
                  onChange={(e) => handleArrayItemChange('excludedItems', index, e.target.value)}
                  margin="normal"
                />
                <IconButton
                  onClick={() => handleRemoveArrayItem('excludedItems', index)}
                  disabled={packageDetails.excludedItems.length <= 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleAddArrayItem('excludedItems')}
            >
              Add Excluded Item
            </Button>
          </TabPanel>

          {/* Hotels Tab */}
          <TabPanel value={tabValue} index={2}>
            {packageDetails?.hotels?.map((hotel, index) => (
              <Paper key={`hotel-${index}`} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Hotel {index + 1}</Typography>
                  <IconButton
                    onClick={() => handleRemoveHotel(index)}
                    disabled={packageDetails.hotels.length <= 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={hotel.city}
                      onChange={(e) => handleHotelChange(index, 'city', e.target.value)}
                      margin="normal"
                      placeholder="e.g. Makkah"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Hotel Name"
                      value={hotel.name}
                      onChange={(e) => handleHotelChange(index, 'name', e.target.value)}
                      margin="normal"
                      placeholder="e.g. Azka Al Safa Hotel"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Distance"
                      value={hotel.distance}
                      onChange={(e) => handleHotelChange(index, 'distance', e.target.value)}
                      margin="normal"
                      placeholder="e.g. 350m dari Masjidil Haram"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Map URL"
                      value={hotel.mapUrl}
                      onChange={(e) => handleHotelChange(index, 'mapUrl', e.target.value)}
                      margin="normal"
                      placeholder="e.g. https://maps.google.com/?q=Hotel+Name"
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Button variant="outlined" onClick={handleAddHotel}>
              Add Hotel
            </Button>
          </TabPanel>

          {/* Itinerary Tab */}
          <TabPanel value={tabValue} index={3}>
            {/* Map through itinerary days */}
            {packageDetails?.itinerary?.map((day, index) => (
              <Paper key={`day-${index}`} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Day {day.day}</Typography>
                  <IconButton onClick={() => handleRemoveItineraryDay(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <TextField
                  fullWidth
                  label="Title"
                  value={day.title}
                  onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={day.description}
                  onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                  margin="normal"
                />

                {/* Activities */}
                {day?.activities?.map((activity, activityIndex) => (
                  <Box key={`activity-${activityIndex}`} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`Activity ${activityIndex + 1}`}
                      value={activity}
                      onChange={(e) =>
                        handleItineraryActivityChange(index, activityIndex, e.target.value)
                      }
                      margin="normal"
                    />
                    <IconButton onClick={() => handleRemoveActivity(index, activityIndex)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}

                <Button variant="outlined" onClick={() => handleAddActivity(index)}>
                  Add Activity
                </Button>
              </Paper>
            ))}

            <Button variant="outlined" onClick={handleAddItineraryDay}>
              Add Itinerary Day
            </Button>
          </TabPanel>

          {/* Requirements & Terms Tab */}
          <TabPanel value={tabValue} index={4}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Requirements & Terms"
              value={packageDetails.requirements}
              onChange={(e) => setPackageDetails(prev => ({ ...prev, requirements: e.target.value.split('\n') }))}
              margin="normal"
              placeholder="Enter all requirements and terms here..."
            />
          </TabPanel>

          {/* Facilities Tab */}
          <TabPanel value={tabValue} index={5}>
            {packageDetails?.facilities?.map((facility, index) => (
              <Paper key={`facility-${index}`} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Facility {index + 1}</Typography>
                  <IconButton onClick={() => handleRemoveFacility(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <TextField
                  fullWidth
                  label="Title"
                  value={facility.title}
                  onChange={(e) => handleFacilityChange(index, 'title', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={facility.description}
                  onChange={(e) => handleFacilityChange(index, 'description', e.target.value)}
                  margin="normal"
                />
              </Paper>
            ))}

            <Button variant="outlined" onClick={handleAddFacility}>
              Add Facility
            </Button>
          </TabPanel>
        </form>
      </Paper>
    </Container>
    )
}
