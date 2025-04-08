'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { umrahPackageservice, UmrahPackagesInput, UmrahPackage } from '@/services/package'
import { uploadImage } from '@/services/cloudinary';
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
  Snackbar, AlertColor
} from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import DynamicFiltersManagement from '@views/package/umrah/dynamicFiltersManagement'
import { fetchFilters } from '@/services/dynamicFilter'
import { GetTablerIconsList } from '@/utils/getTablerIconsList'
import Alert from '@mui/material/Alert'

// Initial form data
const initialFormData = {
  title: '',
  subtitle: '',
  price: '',
  features: [
    { label: '', icon: '' },
    { label: '', icon: '' },
    { label: '', icon: '' },
    { label: '', icon: '' },
    { label: '', icon: '' },
    { label: '', icon: '' },
  ],
  seatsLeft: '',
  totalSeats: '',
  imageUrl: '',
  image: null as File | null,
  tags: [] as string[], // Added tags field
  packageType: '' // Added packageType field
};

// Package types configuration
const packageTypes = {
  "Umrah Reguler": ["Umrah Ceria", "Umrah Cermat", "Umrah Istimewa"],
  "Umrah Edu Trip": ["Manajemen", "Daurah Pelajar"],
  "Umrah Corporate": ["Bronze", "Silver", "Premium"],
  "Umrah Plus Mancanegara": ["Turki", "Mesir"],
  "Umrah Prestige": ["Gold", "Platinum"],
  "Umrah Mandiri": [],
  "Umrah Custom/Community": []
};

const tablerIconsList = GetTablerIconsList

// Filter type
type FilterData = {
  promos: { id: string; name: string }[];
  airports: { id: string; code: string; name: string }[];
  packageTypes: string[];
};

const UmrahPackagesManagement: React.FC = () => {
  const router = useRouter();
  const [packages, setPackages] = useState<UmrahPackage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<UmrahPackage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ ...initialFormData });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  type PackageTypeKey = keyof typeof packageTypes;
  const [selectedPackageType, setSelectedPackageType] = useState<PackageTypeKey | ''>('');
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
    severity: 'success',
  });

  // Show notification
  const showNotification = (message: any, severity:AlertColor = 'success') => {
    setNotification({ open: true, message, severity });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Loading state
  const [loading, setLoading] = useState(true);

  const loadFilters = async () => {
    try {
      setLoading(true);
      const data = await fetchFilters();
      setFilters({
        ...data,
        packageTypes: Object.keys(packageTypes),
      });
      setLoading(false);
    } catch (error) {
      console.error("Failed to load filters:", error);
      setLoading(false);
    }
  };

  // Fetch packages from Firestore
  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const packagesData = await umrahPackageservice.getPackages();
      setPackages(packagesData);
    } catch (error) {
      showNotification("Failed to load packages.",'error');
    }
    setIsLoading(false);
  };


  useEffect(() => {
    fetchPackages();
    loadFilters();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'price') {
      // Remove non-digit characters first
      const numericValue = value.replace(/\D/g, '');
      // Set the numeric value into formData
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
      setSelectedPackageType(value as typeof selectedPackageType);
      setSelectedSubType('');
    }
  };

  // Handle tag selection
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  // Handle sub-type selection
  const handleSubTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubType(e.target.value);
  };

  // Handle feature input changes
  const handleFeatureChange = (index: number, field: 'label' | 'icon', value: string) => {
    const updated = [...formData.features];
    updated[index][field] = value;
    setFormData({ ...formData, features: updated });
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  // Add new package to Firestore
  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const cleanedFeatures = formData.features
      .filter(feature => feature.label.trim() !== '')
      .map(feature => ({
        label: feature.label.trim(),
        icon: feature.icon.trim(),
      }));

    try {
      let imageUrl = '';
      if (formData.image) {
        const uploadResult = await uploadImage(formData.image);
        imageUrl = uploadResult.secure_url;
      }

      // Prepare tags array
      const packageTags = [...selectedTags];
      if (selectedPackageType) {
        packageTags.push(selectedPackageType);
        if (selectedSubType) {
          packageTags.push(selectedSubType);
        }
      }

      const packageData: UmrahPackagesInput = {
        title: formData.title,
        subtitle: formData.subtitle,
        price: parseFloat(formData.price.replace(/[^0-9.-]+/g, "")),
        features: cleanedFeatures,
        seatsLeft: parseInt(formData.seatsLeft),
        totalSeats: parseInt(formData.totalSeats),
        imageUrl: imageUrl,
        tags: packageTags,
        packageType: selectedPackageType,
        subType: selectedSubType
      };

      await umrahPackageservice.addPackage(packageData);

      // Reset form and refresh packages
      setFormData({ ...initialFormData });
      setSelectedTags([]);
      setSelectedPackageType('');
      setSelectedSubType('');
      setShowForm(false);
      fetchPackages();
      showNotification("Package added successfully!");
    } catch (error) {
      showNotification("Failed to add package.",'error');
    }

    setIsLoading(false);
  };

  // Improved handleUpdatePackage function with better error handling
  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!currentPackage?.id) {
      setIsLoading(false);
      showNotification("Missing package ID", 'error');
      return;
    }

    try {
      let imageUrl = currentPackage.imageUrl;
      if (formData.image) {
        try {
          const uploadResult = await uploadImage(formData.image);
          imageUrl = uploadResult.secure_url;
        } catch (imageError) {
          console.error("Image upload error:", imageError);
          showNotification("Image upload failed, using existing image", 'warning');
        }
      }

      // Prepare tags array
      const packageTags = [...selectedTags];
      if (selectedPackageType) {
        packageTags.push(selectedPackageType);
        if (selectedSubType) {
          packageTags.push(selectedSubType);
        }
      }

      // Safely handle features with null checking
      const cleanedFeatures = formData.features
        .filter(feature => feature && feature.label && feature.label.trim() !== '')
        .map(feature => ({
          label: feature.label?.trim() || '',
          icon: feature.icon?.trim() || '',
        }));

      // Safe string operations with null checking
      const packageData: Partial<UmrahPackagesInput> = {
        title: formData.title?.trim() || '',
        subtitle: formData.subtitle?.trim() || '',
        price: parseFloat((formData.price || '0').toString().replace(/[^0-9.-]+/g, "")),
        features: cleanedFeatures,
        seatsLeft: parseInt((formData.seatsLeft || '0').toString()),
        totalSeats: parseInt((formData.totalSeats || '0').toString()),
        imageUrl: imageUrl,
        tags: packageTags,
        packageType: selectedPackageType || '',
        subType: selectedSubType || undefined
      };

      console.log(`Updating package with ID: ${currentPackage.id}`, packageData);
      await umrahPackageservice.updatePackage(currentPackage.id, packageData);

      // Success handling
      setFormData({ ...initialFormData });
      setSelectedTags([]);
      setSelectedPackageType('');
      setSelectedSubType('');
      setEditMode(false);
      setCurrentPackage(null);
      setShowForm(false);
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

  // Delete package from Firestore
  const handleDeletePackage = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      setIsLoading(true);
      try {
        await umrahPackageservice.deletePackage(id);
        fetchPackages();
        showNotification("Package deleted successfully!");
      } catch (error) {
        showNotification("Failed to delete package.",'error');
      }
      setIsLoading(false);
    }
  };

  // Edit package
  const handleEditPackage = (pkg: UmrahPackage) => {
    setCurrentPackage(pkg);
    setFormData({
      title: pkg.title,
      subtitle: pkg.subtitle,
      price: pkg.price.toString(),
      features: [...pkg.features, ...Array(6 - pkg.features.length).fill('')],
      seatsLeft: pkg.seatsLeft.toString(),
      totalSeats: pkg.totalSeats.toString(),
      imageUrl: pkg.imageUrl,
      image: null,
      tags: pkg.tags || [],
      packageType: pkg.packageType || ''
    });

    // Set selected tags and package type
    setSelectedTags(pkg.tags?.filter(tag =>
      !Object.keys(packageTypes).includes(tag) &&
      !Object.values(packageTypes).flat().includes(tag)) || []);

    setSelectedPackageType((pkg.packageType || '') as typeof selectedPackageType);
    setSelectedSubType(pkg.subType || '');

    setEditMode(true);
    setShowForm(true);
  };

  // Format price as Indonesian Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Render tag pill
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Travel Package Management</h1>

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

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">{editMode ? 'Edit Package' : 'Add New Package'}</h2>
          <form onSubmit={editMode ? handleUpdatePackage : handleAddPackage}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Package Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="e.g., Umroh Hemat Plus Thaif"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Package Subtitle <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="e.g., Start jakarta 9 hari, By oman air"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Price (IDR) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="price"
                  value={formData.price ? formatPrice(Number(formData.price)) : ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="e.g., 31.500.000"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Package Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {editMode && currentPackage?.imageUrl && !formData.image && (
                  <p className="text-sm text-gray-500 mt-1">Current image will be kept if no new image is selected</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Available Seats <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="seatsLeft"
                  value={formData.seatsLeft}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="e.g., 15"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Total Seats <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="totalSeats"
                  value={formData.totalSeats}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="e.g., 40"
                  required
                />
              </div>
            </div>

            {/* Package Type and Sub-type Selection */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Package Type <span className="text-red-500">*</span></label>
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
              </div>

              {selectedPackageType && packageTypes[selectedPackageType].length > 0 && (
                <div>
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
                </div>
              )}
            </div>

            {/* Additional Tags */}
            <div className="mt-6">
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
            </div>


            <Box sx={{ mt: 4, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Package Features (up to 6)
              </Typography>

              <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.paper' }}>
                <Grid container spacing={3}>
                  {formData.features.map((feature, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <FormControl fullWidth variant="outlined">
                              <TextField
                                fullWidth
                                label={`Feature ${index + 1}`}
                                value={feature.label}
                                onChange={(e) => handleFeatureChange(index, 'label', e.target.value)}
                                variant="outlined"
                                size="small"
                              />
                            </FormControl>

                            <FormControl sx={{ width: '40%' }} variant="outlined">
                              <Autocomplete
                                freeSolo // Allows typing custom input
                                options={tablerIconsList}
                                value={feature.icon}
                                onInputChange={(event, newInputValue) => {
                                  handleFeatureChange(index, 'icon', newInputValue);
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
            </Box>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className={`px-6 py-3 rounded-lg text-white ${
                  editMode
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : editMode ? 'Update Package' : 'Add Package'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && !showForm && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2">Loading packages...</p>
        </div>
      )}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-transform duration-300 hover:scale-105">
            {/* Card Image */}
            <div className="relative h-48 bg-gray-200">
              <img className="h-full w-full object-cover" src={plan.imageUrl || "/api/placeholder/400/320"} alt="package" />

              {/* Admin Controls Overlay */}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEditPackage(plan)}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => plan.id && handleDeletePackage(plan.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {plan.packageType && renderTag(plan.packageType, true)}
                {plan.subType && renderTag(plan.subType)}
                {plan.tags?.filter(tag =>
                  tag !== plan.packageType &&
                  tag !== plan.subType
                ).map(tag => (
                  <span key={tag} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-center mb-2">{plan.title}</h3>
              <p className="text-gray-500 text-center italic mb-4">{plan.subtitle}</p>

              {/* Price */}
              <p className="text-2xl font-bold text-center text-rose-800 mb-6">
                {formatPrice(plan.price)}
              </p>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {feature.icon === '' ? (
                      <span
                        className={`w-5 h-5 flex items-center justify-center rounded-full text-white ${
                          idx < 3 ? 'bg-blue-500' : idx < 6 ? 'bg-green-500' : 'bg-yellow-500'
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


              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Seats */}
              <div className="mb-6">
                <p className="font-bold mb-2">{plan.seatsLeft} seats left!</p>
                <div className="h-2 bg-rose-100 rounded-full">
                  <div
                    className="h-full bg-rose-800 rounded-full"
                    style={{ width: `${(plan.seatsLeft/plan.totalSeats) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Button */}
              <button
                className="w-full bg-rose-800 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => router.push(`/package/umrah/${plan.id}`)}
              >
                <i className="tabler-user-search"></i>
                Detail Paket
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && packages.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">No packages found</h3>
          <p className="mt-2 text-gray-500">Get started by creating your first travel package.</p>
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
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UmrahPackagesManagement;
