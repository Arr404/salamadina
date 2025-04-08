import React from 'react';
import Image from 'next/image';

interface ImageData {
  url: string;
  alt: string;
}

interface PageSectionProps {
  titleImage?: string;
  mainTitle?: string;
  mainDescription?: string;
  contentSections?: {
    title: string;
    description: string;
    image: string[];
  }[];
}

const Legalitas: React.FC<PageSectionProps> = ({
                                               titleImage = "/images/gallery/3 Februari/IMG-20250205-WA0051.jpg",
                                               mainTitle = 'Legalitas',
                                               contentSections = [
                                                 {
                                                   title: 'S.K. Menteri Hukum dan HAM RI No. AHU-0013511.AH.01.01 Tahun 2021',
                                                   image: ['/images/gallery/3 Februari/IMG-20250205-WA0051.jpg', '/images/gallery/3 Februari/IMG-20250205-WA0051.jpg']
                                                 },
                                                 {
                                                   title: 'S.P. Kemenkumham RI No. AHU-0013511.AH.01.01 Tahun 2021',
                                                   image: ['/images/gallery/3 Februari/IMG-20250205-WA0051.jpg']
                                                 }
                                               ]
                                             }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Title */}
      <div className="relative h-96 bg-[#811745]">
        <div className="absolute inset-0">
          <Image
            src={titleImage}
            alt="Background"
            fill
            className="object-cover opacity-40"
          />
        </div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white text-center">
            {mainTitle}
          </h1>
        </div>
      </div>


      {contentSections.map((section, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-12 my-12"
        >
          <div className="flex flex-row gap-8 w-full justify-center">
            {section.image.map((img, imgIndex) => (
              <div key={imgIndex} className="relative w-1/3 h-64">
                <Image
                  src={img}
                  alt={`${section.title} - Image ${imgIndex + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <h3 className="text-xl font-medium text-center mt-4">
                  {`Image ${imgIndex + 1}`}
                </h3>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-xl font-bold text-[#811745]">{section.title}</h2>
          </div>
        </div>
      ))}

    </div>
  );
};

export default Legalitas;
