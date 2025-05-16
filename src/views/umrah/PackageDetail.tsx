'use client'
import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Calendar, Clock, MapPin, ChevronDown, Loader2 } from 'lucide-react';
import { packageDetailsService, UmrahPackageTranslation } from '@/services/packageDetails';
import LoadingWrapper from '@views/loading'
import { UmrahPackage, umrahPackageservice } from '@/services/package'
import { getLanguage } from '@/utils/getLanguage';
import BreadCrumbCustom from '@components/BreadCrumbsCustom'

const PackageViewDetails = ({ packageId, type }: { packageId: string, type:string }) => {
  const [expandedSection, setExpandedSection] = useState('');
  const [packageSelected, setPackageSelected] = useState<UmrahPackage | null>(null);
  const [packageDetails, setPackageDetails] = useState<UmrahPackageTranslation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      setLoading(true);
      try {
        // Default to Indonesian language, but you can make this configurable
        const language = getLanguage();
        const details = await packageDetailsService.getPackageTranslation(packageId, language);
        const packages = await umrahPackageservice.getPackageById(packageId,type);
        setPackageSelected(packages);

        if (details) {
          setPackageDetails(details);
        } else {
          setError('Package details not found');
        }
      } catch (err) {
        console.error('Error fetching package details:', err);
        setError('Failed to load package details');
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchPackageDetails();
    }
  }, [packageId]);

  // Helper function to check if array is empty or undefined
  const isEmpty = (arr?: any[] | null): boolean => {
    return !arr || arr.length === 0 || arr[0] === '' || arr[0]?.name === '' || arr[0].title === '';
  };

  // Define sections dynamically based on available data
  const sections = [
    ...(isEmpty(packageDetails?.includedItems) ? [] : [{
      id: 'included',
      title: 'Biaya Paket Termasuk',
      content: (
        <ul className="space-y-2">
          {packageDetails?.includedItems?.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-600">
              <span className="text-green-500 mt-1">✓</span>
              {item}
            </li>
          ))}
        </ul>
      )
    }]),
    ...(isEmpty(packageDetails?.itinerary) ? [] : [{
      id: 'itinerary',
      title: 'Itinerary',
      content: (
        <div className="space-y-4">
          {packageDetails?.itinerary?.map((day, index) => (
            <div key={index} className="border-l-2 border-[#811745] pl-4">
              <h4 className="font-semibold">Hari {day.day}: {day.title}</h4>
              <p className="text-gray-600">{day.description}</p>
              {!isEmpty(day.activities) && (
                <ul className="mt-2 space-y-1">
                  {day.activities?.map((activity, idx) => (
                    <li key={idx} className="text-gray-600 text-sm">• {activity}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )
    }]),
    ...(isEmpty(packageDetails?.facilities) ? [] : [{
      id: 'facilities',
      title: 'Fasilitas',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packageDetails?.facilities?.map((facility, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{facility.title}</h4>
              <p className="text-gray-600">{facility.description}</p>
            </div>
          ))}
        </div>
      )
    }]),
    ...(isEmpty(packageDetails?.requirements) ? [] : [{
      id: 'requirements',
      title: 'Persyaratan Peserta',
      content: (
        <ul className="space-y-2">
          {packageDetails?.requirements?.map((requirement, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-600">
              <span className="text-[#811745] mt-1">•</span>
              {requirement}
            </li>
          ))}
        </ul>
      )
    }]),
    ...(isEmpty(packageDetails?.terms) ? [] : [{
      id: 'terms',
      title: 'Syarat dan Ketentuan',
      content: (
        <div className="space-y-4">
          {packageDetails?.terms?.map((term, index) => (
            <p key={index} className="text-gray-600">{term}</p>
          ))}
        </div>
      )
    }])
  ];

  if (error && !loading) {
    return (
      <div className="flex flex-col justify-center items-center gap-6 bg-white py-10 px-4 md:px-10 h-96">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#811745] text-white rounded-lg hover:bg-[#6a1238]"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => (
    <section className="flex flex-col justify-center items-center gap-6 bg-white py-10 px-4 md:px-10">
      {/* Breadcrumbs */}
      <BreadCrumbCustom packageType={packageSelected?.packageType} subType={packageSelected?.subType} />

      {/* Title Section */}
      <h1 className="text-3xl font-bold text-center text-[#811745]">{packageSelected?.title}</h1>

      {!loading && packageSelected && (
        <>
          {/* Package Image and Details */}
          <div className="w-full max-w-7xl bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-[3/2] bg-gray-200">
              {packageSelected.imageUrl ? (
                <img
                  className="w-full h-full object-contain"
                  src={packageSelected.imageUrl}
                  alt="package"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Package Image Not Available
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packageDetails?.peopleInRoom && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800">Jumlah dalam kamar</h3>
                    <p className="text-gray-600">{packageDetails.peopleInRoom}</p>
                  </div>
                )}
                {packageDetails?.airline && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800">Maskapai</h3>
                    <p className="text-gray-600">{packageDetails.airline}</p>
                  </div>
                )}
                {packageDetails?.duration && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800">Durasi</h3>
                    <p className="text-gray-600">{packageDetails.duration}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Package Quick Info */}
          <div className="w-full max-w-7xl bg-gray-50 rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-gray-600">Harga Mulai Dari</p>
              <p className="text-2xl font-bold text-[#811745]">
                Rp {packageSelected.price.toLocaleString('id-ID')}
              </p>
            </div>
            {packageSelected.totalSeats > 0 && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-5 h-5 text-[#811745]" />
                  <span className="text-gray-600">Sisa Kursi</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-[#811745] h-2.5 rounded-full"
                    style={{ width: `${(packageSelected.seatsLeft / packageSelected.totalSeats) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {packageSelected.seatsLeft} dari {packageSelected.totalSeats} kursi
                </p>
              </div>
            )}
            <div className="text-center space-y-2">
              {packageDetails?.departureDate && (
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5 text-[#811745]" />
                  <span className="text-gray-600">{packageDetails.departureDate}</span>
                </div>
              )}
              {packageDetails?.duration && (
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-[#811745]" />
                  <span className="text-gray-600">{packageDetails.duration}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl">
            {/* Left Side - Content */}
            <div className="lg:col-span-2 space-y-6">
              {!isEmpty(packageDetails?.hotels) && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold text-gray-800">Akomodasi Hotel</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packageDetails?.hotels?.map((hotel, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm p-4 border">
                        <h3 className="font-semibold text-[#811745]">{hotel.city}</h3>
                        <p className="text-gray-800">{hotel.name}</p>
                        {hotel.distance && (
                          <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{hotel.distance}</span>
                          </div>
                        )}
                        {hotel.rating > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            {[...Array(hotel.rating)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        )}
                        {hotel.mapUrl && (
                          <a
                            href={hotel.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#811745] text-sm hover:underline mt-2 inline-block"
                          >
                            Lihat di Maps →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expandable Sections - Only show if there are sections with content */}
              {sections.length > 0 && (
                <div className="space-y-4">
                  {sections.map((section) => (
                    <div key={section.id} className="border rounded-lg">
                      <button
                        className="w-full px-6 py-4 flex items-center justify-between text-left"
                        onClick={() => setExpandedSection(expandedSection === section.id ? '' : section.id)}
                      >
                        <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            expandedSection === section.id ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      {expandedSection === section.id && (
                        <div className="px-6 py-4 border-t">{section.content}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Show a message if no content sections are available */}
              {sections.length === 0 && !isEmpty(packageDetails?.hotels) && (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-600">Informasi detail paket belum tersedia.</p>
                </div>
              )}

              {sections.length === 0 && isEmpty(packageDetails?.hotels) && (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-600">Maaf, informasi detail paket belum tersedia saat ini.</p>
                  <p className="text-gray-600 mt-2">Silakan hubungi kami untuk informasi lebih lanjut.</p>
                </div>
              )}
            </div>

            {/* Right Side - Sidebar */}
            <div className="space-y-6">
              {!isEmpty(packageDetails?.excludedItems) && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Biaya Paket Tidak Termasuk:</h2>
                  <ul className="space-y-2">
                    {packageDetails?.excludedItems?.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <span className="text-red-500 mt-1">×</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {packageDetails?.nextManasik && (
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#811745] mb-4">Jadwal Manasik Berikutnya</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Calendar className="w-5 h-5" />
                    <span>{packageDetails.nextManasik}</span>
                  </div>
                  <button  onClick={() =>
                    window.open(`https://wa.me/${packageDetails.phone}`, "_blank", "noopener,noreferrer")
                  } className="w-full bg-[#811745] text-white py-3 px-4 rounded-lg hover:bg-[#6a1238] transition">
                    Daftar Sekarang
                  </button>
                </div>
              )}

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-[#811745] mb-2">Butuh Informasi Lebih Lanjut?</h3>
                <p className="text-[#811745] mb-4">Hubungi tim kami untuk konsultasi dan pemesanan.</p>
                <button  onClick={() =>
                  window.open(`https://wa.me/${packageDetails?.phone}`, "_blank", "noopener,noreferrer")
                } className="w-full bg-[#811745] text-white py-2 px-4 rounded-lg hover:bg-[#6a1238] transition">
                  Hubungi Kami
                </button>
              </div>

              {packageDetails?.additionalInformation && (
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#811745] mb-2">Informasi Tambahan</h3>
                  <p className="text-gray-600">{packageDetails.additionalInformation}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );

  return loading ? <LoadingWrapper /> : renderContent();
};

export default PackageViewDetails;
