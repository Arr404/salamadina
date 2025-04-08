'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

import { motion, AnimatePresence } from "framer-motion";

// MUI Imports
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";


const images = [
  "images/gallery/3 Februari/IMG-20250205-WA0051.jpg",
  "images/gallery/3 Februari/IMG-20250205-WA0068.jpg",
  "images/gallery/3 Februari/IMG-20250205-WA0074.jpg",
  "images/gallery/3 Februari/IMG-20250205-WA0093.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0018.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0019.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0079.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0083.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0092.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0143.jpg",
  "images/gallery/3 Februari/IMG-20250208-WA0095.jpg",
  "images/gallery/3 Februari/IMG-20250209-WA0007.jpg",
  "images/gallery/3 Februari/IMG-20250209-WA0020.jpg",
  "images/gallery/3 Februari/IMG-20250209-WA0039.jpg",
  "images/gallery/3 Februari/IMG-20250209-WA0051.jpg",
  "images/gallery/3 Februari/IMG-20250211-WA0004.jpg",
  "images/gallery/3 Februari/WhatsApp Image 2025-02-09 at 07.57.10_7f459ee6.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241009-WA0026.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241009-WA0054.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241010-WA0014.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241014-WA0051.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241015-WA0005.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241108-WA0032.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241108-WA0035.jpg",
  "images/gallery/5 oktober 24 umroh corporate/WhatsApp Image 2023-05-11 at 19.58.22.jpeg",
  "images/gallery/5 oktober 24 umroh corporate/WhatsApp Image 2024-11-07 at 15.05.51_998b0c75.jpg",
  "images/gallery/5 oktober 24 umroh corporate/WhatsApp Image 2024-11-07 at 15.14.43_b685204a.jpg",
  "images/gallery/5 oktober 24 umroh corporate/WhatsApp Image 2024-11-07 at 15.21.18_1c49e39e.jpg",
  "images/gallery/19 Desember/IMG-20241222-WA0043.jpg",
  "images/gallery/19 Desember/IMG-20241223-WA0034.jpg",
  "images/gallery/19 Desember/IMG-20241223-WA0035.jpg",
  "images/gallery/19 Desember/IMG-20241224-WA0050.jpg",
  "images/gallery/19 Desember/IMG-20241224-WA0055.jpg",
  "images/gallery/19 Desember/IMG-20241227-WA0034.jpg",
  "images/gallery/19 Desember/IMG-20241228-WA0043.jpg",
  "images/gallery/19 Desember/IMG-20241228-WA0045.jpg",
  "images/gallery/19 Desember/IMG-20241228-WA0047.jpg",
  "images/gallery/19 Desember/IMG-20241228-WA0054.jpg",
  "images/gallery/19 Desember/IMG-20241228-WA0055.jpg",
  "images/gallery/19 Desember/WhatsApp Image 2024-12-23 at 19.20.39_2e0a8a1a.jpg",
  "images/gallery/19 Desember/WhatsApp Image 2024-12-23 at 19.20.40_fc46fd99.jpg",
  "images/gallery/19 Desember/WhatsApp Image 2024-12-28 at 17.24.58_8781c8a3.jpg",
  "images/gallery/22 Januari/IMG-20250129-WA0107.jpg",
  "images/gallery/22 Januari/IMG-20250201-WA0080.jpg",
  "images/gallery/22 Januari/IMG-20250202-WA0001.jpg",
  "images/gallery/28 Januari/IMG-20250201-WA0057.jpg",
  "images/gallery/28 Januari/IMG-20250204-WA0059.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-02 at 20.34.36_0244155c.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-03 at 09.20.35_166533e2.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-03 at 09.20.38_d1d9c67d.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-03 at 09.20.39_82bc6ee4.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-03 at 09.20.40_f13273f8.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-07 at 13.02.58_dd12cd61.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-07 at 13.14.36_614600d9.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-07 at 13.16.32_447f54cc.jpg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-06-25 at 00.00.13.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-06-28 at 14.55.46.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-06-28 at 14.55.49.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-06-28 at 14.56.16.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-07-05 at 12.59.03.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-07-10 at 23.54.52 (1).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-07-11 at 21.05.27.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.20 (1).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.20 (2).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.20 (3).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.21.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.21 (1).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.21 (2).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.22 (1).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.23.jpeg"
];


const Gallery = () => {
  const ref = useRef<null | HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<null | number>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [batch, setBatch] = useState<{ img: string; span: number }[]>([]);
  const [count, setCount] = useState(0);

  const getRowSpan = () => (Math.random() > 0.5 ? 2 : 1);

  const calculateBatchSize = (startIndex: number) => {
    let count = 0;
    let rowsUsed = 0;
    const newBatch: { img: string; span: number }[] = [];

    for (let i = startIndex; i < images.length; i++) {
      if (rowsUsed >= 16) break;
      const span = getRowSpan();

      if (rowsUsed + span > 16) break;

      rowsUsed += span;
      newBatch.push({ img: images[i], span });
      count++;
    }

    return { newBatch, count };
  };

// Recalculate batch and count when currentIndex changes
  useEffect(() => {
    const { newBatch, count } = calculateBatchSize(currentIndex);

    setBatch(newBatch);
    setCount(count);
  }, [currentIndex]);

  const nextImages = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + count) % images.length);
  };

  const prevImages = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - count + images.length) % images.length);
  };


  return (
    <section id="gallery" ref={ref} className="relative h-[600px] flex items-center justify-center text-center overflow-hidden">
      {/* Previous Button */}
      <button onClick={prevImages} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white w-10 h-10 flex items-center justify-center rounded-full z-10">
        <i className='tabler-caret-left' />
      </button>

      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[150px]"
            initial={{ x: direction > 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? "-50%" : "50%", opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            {batch.map(({ img, span }, index) => (
              <div key={index} className={`relative overflow-hidden shadow-md rounded-lg ${span === 2 ? "row-span-2": "row-span-1"}`}>
                <img src={img} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt={`Image ${index}`} />
                <button onClick={() => setLightbox(currentIndex + index)} className="absolute inset-0 flex items-center justify-center opacity-0 bg-black bg-opacity-50 text-white text-lg font-bold transition-opacity hover:opacity-100">
                  {img.split("/").pop()}
                </button>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next Button */}
      <button onClick={nextImages}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white w-10 h-10 flex items-center justify-center rounded-full z-10">
        <i className="tabler-caret-right" />
      </button>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="z-10 fixed inset-0 flex items-center justify-center bg-black bg-opacity-75" onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl w-full p-4">
            <img src={images[lightbox]} className="w-full h-auto cursor-pointer" alt={images[lightbox]} />
            <p className="text-white text-center text-lg mt-2">{images[lightbox].split("/").pop()}</p>
            <button onClick={() => setLightbox(null)} className="absolute top-2 right-2 bg-gray-800 text-white w-8 h-8 flex items-center justify-center rounded-full">X</button>
          </div>
        </div>
      )}

      {/* Text Content */}
      <div className="bg-black bg-opacity-40 p-24 rounded-xl relative flex flex-col gap-6 items-center">
        <Chip size="small" variant="tonal" color="primary" label="Gallery" />
        <Typography color="white" variant="h4" className="font-bold">
          Explore Our <span className="text-yellow-400">Photo Gallery</span>
        </Typography>
        <Typography className="text-white max-w-lg">Browse through these amazing photos.</Typography>
      </div>
    </section>
  );
};

export default Gallery;

