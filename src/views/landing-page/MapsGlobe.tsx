'use client'

import dynamic from 'next/dynamic';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

const Globe = dynamic(
  () => import('@/components/globe'),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center h-screen">
        <CircularProgress color="primary" />
        <Typography className="mt-4 text-white">Loading globe visualization...</Typography>
      </div>
    )
  }
);

const MapsGlobe = () => {
  return (
    <div className="relative min-h-screen pt-8 w-full bg-black overflow-hidden">

      {/* Globe component */}
      <Globe />
    </div>
  );
};

export default MapsGlobe;
