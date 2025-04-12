import { useState, useEffect } from 'react';
import { Typography, Chip, Grid } from '@mui/material'
import { Search, ChevronDown } from 'lucide-react';
import { umrahPackageservice, UmrahPackage } from '@/services/package';
import { fetchFilters } from '@/services/dynamicFilter'
import PlanCard from '@components/PlanCard'

// Define interfaces for filters
interface Promo {
  id: string;
  name: string;
}

interface Airport {
  id: string;
  code: string;
  name: string;
}

interface Filters {
  promos: Promo[];
  airports: Airport[];
}

interface DropdownProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  displayKey?: keyof T; // For objects
  valueKey?: keyof T;   // For objects
}

// Main component that integrates PackageFilter with PricingPlan
const IntegratedPackages = ({tipePaket}: {tipePaket : string}) => {
  // State for packages
  const [packages, setPackages] = useState<UmrahPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  // State for filters
  const [filters, setFilters] = useState<Filters | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPromo, setSelectedPromo] = useState<string>('All Promos');
  const [selectedAirport, setSelectedAirport] = useState<string>('All Airports');
  const [selectedPackageType, setSelectedPackageType] = useState<string>('All Packages');

  const [packageTypes, setPackageTypes] = useState<string[]>(['All Packages']);

  useEffect(() => {
    const uniqueSubTypes = Array.from(
      new Set(packages.map(pkg => pkg.subType).filter(Boolean))
    );
    if(!uniqueSubTypes){
      setPackageTypes(['All Packages', ...uniqueSubTypes]);
    }
  }, [packages]);

  // Fetch packages and filters from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch packages and filters in parallel
        const [packagesData, filtersData] = await Promise.all([
          umrahPackageservice.getPackages(tipePaket),
          fetchFilters()
        ]);

        setPackages(packagesData);
        setFilters(filtersData);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cloudinary setup
  useEffect(() => {
    const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;

    if (!cloudinaryUrl) {
      console.error("CLOUDINARY_URL is not defined in environment variables");
      return;
    }

    const cloudNameMatch = cloudinaryUrl.match(/@([a-z0-9-]+)/i);
    const cloudName = cloudNameMatch ? cloudNameMatch[1] : null;

    if (cloudName) {
      const url = `https://res.cloudinary.com/${cloudName}/image/upload/salamadina/IMG-20250201-WA0057_qwru42`;
      setImageUrl(url);
    }
  }, []);

  // Filter packages based on selected filters
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.subtitle && pkg.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPromo = selectedPromo === 'All Promos' ||
      (pkg.tags && pkg.tags.some(tag => {
        const promoMatch = filters?.promos.find(p => p.name === tag);
        return promoMatch && promoMatch.name === selectedPromo;
      }));

    const matchesAirport = selectedAirport === 'All Airports' ||
      (pkg.tags && pkg.tags.some(tag => {
        const airportMatch = filters?.airports.find(a => `${a.code}` === tag);
        return airportMatch && `${airportMatch.code} (${airportMatch.name})` === selectedAirport;
      }));

    const matchesPackageType = selectedPackageType === 'All Packages' ||
      pkg?.subType?.toLowerCase() === selectedPackageType.toLowerCase();

    return matchesSearch && matchesPromo && matchesAirport && matchesPackageType;
  });

  // Helper function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Helper function to render tags
  const renderTag = (tag: string, isPrimary = false) => (
    <span
      className={`text-xs px-2 py-1 rounded-full ${
        isPrimary
          ? 'bg-rose-100 text-rose-800'
          : 'bg-blue-100 text-blue-800'
      }`}
    >
      {tag}
    </span>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading packages and filters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl border border-[#811745] p-12 rounded mx-auto">
        {/* Filters Section */}
        <div className="bg-white rounded-xl p-6 mb-8 border border-[#811745] shadow-sm">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search packages..."
                  className="w-full pl-10 pr-4 py-2 border border-[#811745] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Dropdowns */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Promo</label>
              <div className="relative border border-[#811745] rounded-lg bg-white">
                <select
                  value={selectedPromo}
                  onChange={(e) => setSelectedPromo(e.target.value)}
                  className="w-full px-4 py-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                >
                  <option value="All Promos">All Promos</option>
                  {filters?.promos.map(promo => (
                    <option key={promo.id} value={promo.name}>
                      {promo.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Airport</label>
              <div className="relative border border-[#811745] rounded-lg bg-white">
                <select
                  value={selectedAirport}
                  onChange={(e) => setSelectedAirport(e.target.value)}
                  className="w-full px-4 py-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                >
                  <option value="All Airports">All Airports</option>
                  {filters?.airports.map(airport => (
                    <option key={airport.id} value={`${airport.code} (${airport.name})`}>
                      {airport.code} ({airport.name})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Type</label>
              <div className="relative border border-[#811745] rounded-lg bg-white">
                <select
                  value={selectedPackageType}
                  onChange={(e) => setSelectedPackageType(e.target.value)}
                  className="w-full px-4 py-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                >
                  {packageTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Package Cards */}
        <Grid container spacing={6} justifyContent="center" alignItems="stretch">

          {filteredPackages.length > 0 ? (
            filteredPackages.map((plan) => (
              <PlanCard plan={plan}/>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500 text-lg">No packages found matching your criteria</div>
          )}
        </Grid>
      </div>
    </div>
  );
};

export default IntegratedPackages;
