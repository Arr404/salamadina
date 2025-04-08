'use client'
import React, { useState } from 'react';
import { ChevronRight, Users, Calendar, Clock, MapPin, ChevronDown } from 'lucide-react';

const PackageViewDetails = () => {
  const [expandedSection, setExpandedSection] = useState('');

  const packageDetails = {
    price: 35000000,
    seatsLeft: 15,
    seatsTotal: 30,
    departureDate: '15 April 2025',
    duration: '9 Hari',
    nextManasik: '1 April 2025',
    image: 'path-to-image.jpg',
    airline: 'Saudi Airlines',
    packageType: 'Quad (4 orang/kamar)'
  };
  const includedItems = [
    "Tiket kelas ekonomi Saudi Airlines Surabaya-Madinah//Jeddah-Surabaya (PP)",
    "Visa Umrah",
    "Akomodasi selama di Arab Saudi",
    "Hotel bintang 4/5 di Makkah dan Madinah",
    "Muthawwif/pembimbing selama di Arab Saudi",
    "Tour leader selama keberangkatan sampai kembali ke tanah air",
    "Makan buffet 3 kali sehari fullboard hotel",
    "Manasik Umrah, selama di Indonesia dilakukan 2 kali",
    "Handling di Indonesia dan Arab Saudi",
    "City Tour",
    "Lounge Eksekutif di bandara Indonesia",
    "Team Medis",
    "Perlengkapan jamaah Umrah",
    "Administrasi dan SISKOPATUH Kemenag"
  ];
  const excludedItems = [
    "Paspor baik penerbitan paspor baru, perpanjangan maupun penambahan nama pada paspor",
    "Suntik vaksin meningitis maupun vaksinasi lainnya"
  ];

  const hotels = [
    {
      city: "Makkah",
      name: "Azka Al Safa Hotel",
      distance: "350m dari Masjidil Haram",
      rating: 4,
      mapUrl: "https://maps.google.com/?q=Azka+Al+Safa+Hotel+Makkah"
    },
    {
      city: "Madinah",
      name: "Gloria Al Madinah Hotel",
      distance: "200m dari Masjid Nabawi",
      rating: 5,
      mapUrl: "https://maps.google.com/?q=Gloria+Al+Madinah+Hotel"
    }
  ];

  const sections = [
    {
      id: 'included',
      title: 'Biaya Paket Termasuk',
      content: (
        <ul className="space-y-2">
          {includedItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-600">
              <span className="text-green-500 mt-1">✓</span>
              {item}
            </li>
          ))}
        </ul>
      )
    },
    {
      id: 'itinerary',
      title: 'Itinerary',
      content: (
        <div className="space-y-4">
          <div className="border-l-2 border-[#811745] pl-4">
            <h4 className="font-semibold">Hari 1: Madinah</h4>
            <p className="text-gray-600">Tiba di Madinah, check-in hotel, istirahat</p>
          </div>
          {/* Add more days */}
        </div>
      )
    },
    {
      id: 'facilities',
      title: 'Fasilitas',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Hotel</h4>
            <p className="text-gray-600">Hotel bintang 5 dengan lokasi strategis</p>
          </div>
          {/* Add more facilities */}
        </div>
      )
    },
    {
      id: 'requirements',
      title: 'Persyaratan Peserta',
      content: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-gray-600">
            <span className="text-[#811745] mt-1">•</span>
            Paspor dengan masa berlaku minimal 7 bulan
          </li>
          {/* Add more requirements */}
        </ul>
      )
    },
    {
      id: 'terms',
      title: 'Syarat dan Ketentuan',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Syarat dan ketentuan yang berlaku untuk program umrah reguler
          </p>
          {/* Add more terms */}
        </div>
      )
    }
  ];

  return (
    <section className="flex flex-col justify-center items-center gap-6 bg-white py-10 px-4 md:px-10">
      {/* Breadcrumbs */}
      <div className="self-start flex items-center gap-2 text-sm mb-4">
        <a href="/umrah" className="text-[var(--mui-palette-primary-mainChannel] hover:underline">Umrah</a>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-600">Umrah Reguler</span>
      </div>

      {/* Title Section */}
      <h1 className="text-3xl font-bold text-center text-[#811745]">Umrah Reguler</h1>

      {/* Package Image and Details */}
      <div className="w-full max-w-7xl bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="aspect-video bg-gray-200">
          {/* Replace with actual image */}
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Package Image
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800">Jenis Paket</h3>
              <p className="text-gray-600">{packageDetails.packageType}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800">Maskapai</h3>
              <p className="text-gray-600">{packageDetails.airline}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800">Durasi</h3>
              <p className="text-gray-600">{packageDetails.duration}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Package Quick Info */}
      <div className="w-full max-w-7xl bg-gray-50 rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <p className="text-gray-600">Harga Mulai Dari</p>
          <p className="text-2xl font-bold text-[#811745]">
            Rp {packageDetails.price.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Users className="w-5 h-5 text-[#811745]" />
            <span className="text-gray-600">Sisa Kursi</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-[#811745] h-2.5 rounded-full"
              style={{ width: `${(packageDetails.seatsLeft / packageDetails.seatsTotal) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{packageDetails.seatsLeft} dari {packageDetails.seatsTotal} kursi</p>
        </div>
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5 text-[#811745]" />
            <span className="text-gray-600">{packageDetails.departureDate}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-[#811745]" />
            <span className="text-gray-600">{packageDetails.duration}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {/* Left Side - Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-800">Akomodasi Hotel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotels.map((hotel, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 border">
                  <h3 className="font-semibold text-[#811745]">{hotel.city}</h3>
                  <p className="text-gray-800">{hotel.name}</p>
                  <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.distance}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(hotel.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <a
                    href={hotel.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#811745] text-sm hover:underline mt-2 inline-block"
                  >
                    Lihat di Maps →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Expandable Sections */}
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
        </div>

        {/* Right Side - Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Biaya Paket Tidak Termasuk:</h2>
            <ul className="space-y-2">
              {excludedItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <span className="text-red-500 mt-1">×</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#811745] mb-4">Jadwal Manasik Berikutnya</h3>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <Calendar className="w-5 h-5" />
              <span>{packageDetails.nextManasik}</span>
            </div>
            <button className="w-full bg-[#811745] text-white py-3 px-4 rounded-lg hover:bg-[#6a1238] transition">
              Daftar Sekarang
            </button>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#811745] mb-2">Butuh Informasi Lebih Lanjut?</h3>
            <p className="text-[#811745] mb-4">Hubungi tim kami untuk konsultasi dan pemesanan.</p>
            <button className="w-full bg-[#811745] text-white py-2 px-4 rounded-lg hover:bg-[#6a1238] transition">
              Hubungi Kami
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackageViewDetails;
