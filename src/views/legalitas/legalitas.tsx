'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { db } from '@/services/init';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import CircularProgress from '@mui/material/CircularProgress';

interface ImageData {
  url: string;
  alt: string;
}

interface PageSectionProps {
  id?: string;
  titleImage?: string;
  mainTitle?: string;
  mainDescription?: string;
  contentSections?: {
    title: string;
    description: string;
    image: string[];
  }[];
}

const Legalitas: React.FC = () => {
  const [pageData, setPageData] = useState<PageSectionProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLegalitasData = async () => {
      try {
        setLoading(true);
        // Query the most recently created/updated page section
        const q = query(
          collection(db, 'legalitasPageSections'),
          orderBy('updatedAt', 'desc'),
          limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setPageData({
            id: doc.id,
            ...doc.data() as Omit<PageSectionProps, 'id'>
          });
        } else {
          // Use default data if no documents found
          setPageData({
            titleImage: "/images/gallery/3 Februari/IMG-20250205-WA0051.jpg",
            mainTitle: 'Legalitas',
            contentSections: []
          });
        }
      } catch (err) {
        console.error('Error fetching legalitas data:', err);
        setError('Failed to load legalitas data. Please refresh the page.');

        // Set default data on error
        setPageData({
          titleImage: "/images/gallery/3 Februari/IMG-20250205-WA0051.jpg",
          mainTitle: 'Legalitas',
          contentSections: [
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLegalitasData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <CircularProgress size={60} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#811745] text-white rounded-lg"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return null;
  }

  const { titleImage, mainTitle, contentSections } = pageData;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Title */}
      <div className="relative h-96 bg-[#811745]">
        <div className="absolute inset-0">
          <Image
            src={titleImage || "/images/gallery/3 Februari/IMG-20250205-WA0051.jpg"}
            alt="Background"
            fill
            className="object-cover opacity-40"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/api/placeholder/800/600';
            }}
          />
        </div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white text-center">
            {mainTitle || 'Legalitas'}
          </h1>
        </div>
      </div>

      {contentSections && contentSections.map((section, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-12 my-12 px-4"
        >
          <div className="flex flex-wrap gap-8 w-full justify-center">
            {section.image && section.image.map((img, imgIndex) => (
              <div key={imgIndex} className="relative w-full sm:w-1/3 h-64">
                <Image
                  src={img}
                  alt={`${section.title} - Image ${imgIndex + 1}`}
                  fill
                  className="object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/api/placeholder/400/300';
                  }}
                />
                <h3 className="text-xl font-medium text-center mt-4">
                  {`Image ${imgIndex + 1}`}
                </h3>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 text-center max-w-4xl">
            <h2 className="text-xl font-bold text-[#811745]">{section.title}</h2>
            {section.description && (
              <p className="text-gray-700">{section.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Legalitas;
