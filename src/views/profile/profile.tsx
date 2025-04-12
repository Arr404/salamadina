import React from 'react';
import Image from 'next/image';

interface ContentSection {
  title: string;
  description: string;
  image: string;
}

interface PageSectionProps {
  titleImage?: string;
  mainTitle?: string;
  mainDescription?: string;
  contentSections?: ContentSection[];
}

const Profile: React.FC<PageSectionProps> = ({
                                               titleImage = "/images/gallery/3 Februari/IMG-20250205-WA0051.jpg",
                                               mainTitle = 'Profile',
                                               contentSections = [
                                                 {
                                                   title: 'Tentang Salamadina',
                                                   description: 'Dengan Tagline Umrah "Umrah Jadi Baik", dan Haji khusus "Mabrur Lebih Dekat" kami ingin menginspirasi setiap jamaah untuk menjadikan perjalanan umrah sebagai momentum perubahan spiritual yang berdampak pada kehidupan pribadi dan profesional mereka.',
                                                   image: '/images/gallery/3 Februari/IMG-20250205-WA0051.jpg'
                                                 },
                                                 {
                                                   title: 'Tentang Salamadina',
                                                   description: 'Dengan Tagline Umrah "Umrah Jadi Baik", dan Haji khusus "Mabrur Lebih Dekat" kami ingin menginspirasi setiap jamaah untuk menjadikan perjalanan umrah sebagai momentum perubahan spiritual yang berdampak pada kehidupan pribadi dan profesional mereka.',
                                                   image: '/images/gallery/3 Februari/IMG-20250205-WA0051.jpg'
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

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 space-y-24 py-16">
        {contentSections.map((section, index) => (
          <div
            key={index}
            className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12`}
          >
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-[#811745] mb-6">
                {section.title}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {section.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
