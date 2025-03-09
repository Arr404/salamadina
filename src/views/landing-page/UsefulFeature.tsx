// React Imports
import React, { useEffect, useRef } from 'react';

// MUI Imports
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';

// Third-party Imports
import classnames from 'classnames';

// Hook Imports
import { ShieldCheck, CheckCircle, Users, CalendarCheck, MapPin } from "lucide-react";

import { useIntersection } from '@/hooks/useIntersection';

// Styles Imports
import frontCommonStyles from '@views/styles.module.css';

// Data
const features = [
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: 'Legalitas Terjamin',
    description: (
      <>
        Memiliki izin resmi,{' '}
        <strong>Izin Umrah No U-400 Tahun 2021</strong>,{' '}
        <strong>Izin Haji Khusus No. 91200093519110002</strong>
      </>
    )
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: 'Provider Visa Resmi',
    description: (
      <>
        Kami memberikan layanan visa yang <strong>terjamin keamanannya</strong>,
        memastikan kelancaran proses perjalanan jamaah.
      </>
    )
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Pembimbing Kredibel',
    description: (
      <>
        Pembimbing <strong>profesional, bersertifikasi, </strong>{' '}
        dan <strong>berpendidikan</strong> dalam membimbing jemaah
      </>
    )
  },
  {
    icon: <CalendarCheck className="w-8 h-8" />,
    title: 'Program Unggulan',
    description: (
      <>
       Melalui program <strong>Pesantren Umrah</strong>, serta program spesial{' '}
        <strong>Umrah Corporate</strong> dan <strong>Edu Trip</strong> kami berupaya menghadirkan
        pengalaman spiritual yang maksimal.
      </>
    )
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: 'Produk Yang Bervariasi',
    description: (
      <>
        Menawarkan beragam produk perjalanan, mulai dari{' '}
        <strong>Umrah</strong>, <strong>Haji Khusus</strong>, hingga{' '}
        <strong>Halal Tour</strong>
      </>
    )
  }
];

const UsefulFeature = () => {
  // Refs
  const skipIntersection = useRef(true);
  const ref = useRef(null);

  // Hooks
  const { updateIntersections } = useIntersection();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (skipIntersection.current) {
          skipIntersection.current = false

          return
        }

        updateIntersections({ [entry.target.id]: entry.isIntersecting })
      },
      { threshold: 0.35 }
    )

    ref.current && observer.observe(ref.current as HTMLDivElement)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id='features' ref={ref} className='bg-backgroundPaper'>
      <div className={classnames('flex flex-col gap-12 pbs-12 pbe-[100px] mt-24', frontCommonStyles.layoutSpacing)}>
        <div className='flex flex-col gap-y-4 items-center justify-center'>
          <Chip size='small' className="text-white bg-[#811745]" variant='tonal' color='primary' label='Salamadina Tour' />
          <div className='flex flex-col items-center gap-y-1 justify-center flex-wrap'>
            <div className='flex items-center gap-x-2'>
              <Typography variant='h4' className='text-center text-[#811745]'>
                <span className='text-bold  relative z-[1] font-extrabold'>
                  Brand

                </span>{' '}
                Awerness
              </Typography>
            </div>
            <Typography className="text-center text-[#811745]">
              Menghadirkan pelayanan umrah dengan Tagline <b>“Umrah Jadi Baik”</b> serta pelayanan Haji dengan tagline <b>“Mabrur Lebih Dekat”</b>. Kami berupaya memberikan pengalaman Umrah dan Haji yang tidak hanya berkesan, tetapi juga membawa dampak transformasi spiritual dalam kehidupan jamaah.
            </Typography>
          </div>

        </div>
        <Grid container spacing={6} justifyContent="center">
          {/* First Row - 3 Items */}
          {features.slice(0, 3).map((item, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <div
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="relative flex flex-col gap-2 justify-center mt-8 items-center text-center p-6 shadow-lg bg-white rounded-lg w-full xl:w-[350px] h-[200px]"
              >
                <div className="absolute top-[-1rem] left-[1rem] w-12 h-12 flex items-center justify-center bg-[#811745] text-white rounded-full shadow-md">
                  {item.icon}
                </div>
                <Typography className="mbs-2 mt-10 text-[#811745]" variant="h3">
                  {item.title}
                </Typography>
                <Typography className="max-w-[364px] text-[#811745]">{item.description}</Typography>
              </div>
            </Grid>
          ))}

          {/* Second Row - 2 Items (Centered) */}
          <Grid container item xs={12} justifyContent="center" spacing={0}>
            {features.slice(3, 5).map((item, index) => (
              <Grid item xs={12} sm={6} lg={6} key={index}>
                <div
                  data-aos="fade-up"
                  className="relative flex flex-col  mt-8 xl:gap-2 justify-center items-center text-center p-6 shadow-lg bg-white rounded-lg w-full  xl:w-[450px] h-[200px]"
                >
                  <div
                    className="absolute top-[-1rem] left-[1rem] w-12 h-12 flex items-center justify-center bg-[#811745] text-white rounded-full shadow-md">
                    {item.icon}
                  </div>
                  <Typography className="mbs-2 mt-10 text-[#811745]" variant="h3">
                    {item.title}
                  </Typography>
                  <Typography className="max-w-[364px] text-[#811745]">{item.description}</Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>


      </div>
    </section>
  );
};

export default UsefulFeature;
