import React, { useEffect, useState } from 'react';

const PackageHeader = ( {title} : {title: string}) => {
  const [imageUrl, setImageUrl] = useState("");

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


  return (
    <section className="relative h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${imageUrl})`
        }}
      />
      <div className="absolute inset-0 bg-[#811745] bg-opacity-50" />

      <div className="relative h-full flex flex-col items-center justify-center px-4 py-8 md:py-12">
        <div className=" px-6 py-4 md:px-8 md:py-6 rounded-xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-white">
            Explore our{' '}
            <span className="font-extrabold relative z-[1]">
              {title}
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default PackageHeader;
