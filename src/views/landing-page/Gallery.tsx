// React Imports
import { useEffect, useRef } from 'react'

import { motion } from "framer-motion";

// MUI Imports
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'


// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'


const images = [
  "/images/landing/paul.png",
  "/images/landing/paul.png",
  "/images/landing/paul.png",
  "/images/landing/paul.png",
  "/images/landing/paul.png",
  "/images/landing/paul.png",
];

const Gallery = () => {
  const skipIntersection = useRef(true);
  const ref = useRef<null | HTMLDivElement>(null);
  const { updateIntersections } = useIntersection();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (skipIntersection.current) {
          skipIntersection.current = false;

          return;
        }

        updateIntersections({ [entry.target.id]: entry.isIntersecting });
      },
      { threshold: 0.35 }
    );

    ref.current && observer.observe(ref.current as HTMLDivElement);
  }, []);

  const repeatedImages = [...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images];

  return (
    <section
      id="gallery"
      ref={ref}
      className="relative h-[600px] flex items-center justify-center text-center overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="flex flex-wrap gap-6"
          animate={{
            x: ["0%", "-50%", "0%"], // Moves the grid from right to left infinitely
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ display: "flex", width: "200%" }} // Makes sure we have enough space for looping
        >
          {/* Duplicate images to ensure seamless looping */}
          {[...repeatedImages, ...repeatedImages].map((src, index) => (
            <div
              key={index}
              className="w-32 h-32 bg-cover bg-center rounded-lg shadow-lg"
              style={{
                backgroundImage: `url(${src})`,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>

      {/* Text Content */}
      <div className="relative flex flex-col gap-6 items-center z-10">
        <Chip size="small" variant="tonal" color="primary" label="Gallery" />
        <Typography color="white" variant="h4" className="font-bold">
          Explore Our <span className="text-yellow-400">Photo Gallery</span>
        </Typography>
        <Typography className="text-white max-w-lg">
          Browse through these amazing photos.
        </Typography>
      </div>
    </section>
  );
};

export default Gallery;
