import { useState, useEffect } from 'react';
import { Typography, Chip } from '@mui/material';
import { Search, ChevronDown } from 'lucide-react';
import { umrahPackageservice, UmrahPackage } from '@/services/package';
import { fetchFilters } from '@/services/dynamicFilter'

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
const IntegratedPackages = () => {
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

  // Package types (hardcoded for now, could also be fetched)
  const packageTypes = ['All Packages', 'UMRAH CERIA', 'UMRAH ISTIMEWA', 'UMRAH CERMAT'];

  // Fetch packages and filters from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch packages and filters in parallel
        const [packagesData, filtersData] = await Promise.all([
          umrahPackageservice.getPackages(),
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPackages.length > 0 ? (
            filteredPackages.map((plan) => (
              <div key={plan.id} className="bg-white h-full rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-transform duration-300 hover:scale-105">
                {/* Card Image */}
                <div className="relative h-48 bg-gray-200">
                  <img className="h-full w-full object-cover" src={plan.imageUrl || imageUrl || "/api/placeholder/400/320"} alt="package" />
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
                  <button className="w-full bg-rose-800 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">
                    <i className="tabler-user-search"></i>
                    Detail Paket
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500 text-lg">No packages found matching your criteria</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegratedPackages;
