// React Imports
import { useEffect, useRef } from 'react';

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
    icon: <ShieldCheck color='var(--mui-palette-primary-main)' />,
    title: 'Legalitas Terjamin',
    description: 'Sebagai penyelenggara perjalanan ibadah yang memiliki izin resmi, Izin Umrah No U-400 - - - Tahun 2021, Izin Haji Khusus No. 91200093519110002 kami memastikan setiap perjalanan sesuai dengan peraturan yang berlaku.\n'
  },
  {
    icon: <CheckCircle color='var(--mui-palette-primary-main)' />,
    title: 'Provider Visa Resmi',
    description: 'Kami memberikan layanan visa yang terjamin keamanannya, memastikan kelancaran proses perjalanan jamaah.\n'
  },
  {
    icon: <Users color='var(--mui-palette-primary-main)' />,
    title: 'Pembimbing Kredibel',
    description: 'Tim pembimbing kami adalah profesional yang bersertifikasi dan berpendidikan, memberikan bimbingan mendalam selama prosesi ibadah.\n'
  },
  {
    icon: <CalendarCheck color='var(--mui-palette-primary-main)' />,
    title: 'Program Unggulan',
    description: 'Kami memiliki program pesantren umrah untuk memanfaatkan waktu lebih berharga, termasuk program kami Umrah Corporate dan Edu Trip, telah dirancang secara khusus untuk memberikan pengalaman spiritual yang maksimal.\n'
  },
  {
    icon: <MapPin color='var(--mui-palette-primary-main)' />,
    title: 'Produk Bervariasi',
    description: 'Kami menawarkan beragam produk perjalanan, mulai dari Umrah, Haji Khusus, hingga Halal Tour, untuk memenuhi kebutuhan dan preferensi jamaah.\n'
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
      <div className={classnames('flex flex-col gap-12 pbs-12 pbe-[100px]', frontCommonStyles.layoutSpacing)}>
        <div className='flex flex-col gap-y-4 items-center justify-center'>
          <Chip size='small' variant='tonal' color='primary' label='Salamadina Tour' />
          <div className='flex flex-col items-center gap-y-1 justify-center flex-wrap'>
            <Typography color='text.primary' variant='h4' className='text-center'>
                <span className='relative z-[1] font-extrabold'>
                   Umrah Jadi Baik, Mabrur Lebih Dekat
                  <img
                    src='/images/landing/bg-shape.png'
                    alt='bg-shape'
                    className='absolute block-end-0 z-[1] bs-[40%] is-[125%] sm:is-[132%] -inline-start-[13%] sm:inline-start-[-19%] block-start-[17px]'
                  />
                </span>{' '}
            </Typography>
            <Typography className='text-center max-w-2xl'>
              Salamadina Tour menghadirkan pengalaman Umrah dan Haji yang tidak hanya berkesan, tetapi juga membawa dampak transformasi spiritual dalam kehidupan jamaah.
            </Typography>
          </div>
        </div>
        <Grid container spacing={6} justifyContent="center">
          {/* First Row - 3 Items */}
          {features.slice(0, 3).map((item, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <div data-aos="fade-up" data-aos-delay={index*100} className='flex flex-col gap-2 justify-center items-center text-center'>
                {item.icon}
                <Typography className='mbs-2' variant='h5'>
                  {item.title}
                </Typography>
                <Typography className='max-is-[364px]'>{item.description}</Typography>
              </div>
            </Grid>
          ))}

          {/* Second Row - 2 Items (Centered) */}
          <Grid container item xs={12} justifyContent="center" spacing={0}>
            {features.slice(3, 5).map((item, index) => (
              <Grid item xs={12} sm={6} lg={6} key={index}>
                <div data-aos="fade-up" className='flex flex-col gap-2 justify-center items-center text-center'>
                  {item.icon}
                  <Typography className='mbs-2' variant='h5'>
                    {item.title}
                  </Typography>
                  <Typography className='max-is-[364px]'>{item.description}</Typography>
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
