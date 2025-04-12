import { useState, useEffect, JSX, SVGProps } from 'react';
import { umrahPackageservice, UmrahPackage } from '@/services/package'
import { Grid, Typography, Chip } from '@mui/material'
import classnames from 'classnames'
import styles from './styles.module.css'
import frontCommonStyles from '../styles.module.css'
import { getLanguage } from '@/utils/getLanguage'
import CategorySection from '@components/CategorySection'

const PricingPlan = () => {
  const [packagesUmrah, setPackagesUmrah] = useState<UmrahPackage[]>([])
  const [packagesHajj, setPackagesHajj] = useState<UmrahPackage[]>([])
  const [packagesEdutrip, setPackagesEdutrip] = useState<UmrahPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [language, setLanguage] = useState<'en' | 'ind'>(getLanguage());

  // Fetch packages from Firebase
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        const packagesData = await umrahPackageservice.getPackages('umrahPackages')
        const packagesDataHajj = await umrahPackageservice.getPackages('hajiPackages')
        const packagesDataEdutrip = await umrahPackageservice.getPackages('halaltourpPackagess')
        setPackagesUmrah( packagesData.slice(0, 3) )
        setPackagesHajj( packagesDataHajj.slice(0, 3) )
        setPackagesEdutrip( packagesDataEdutrip.slice(0, 3) )
      } catch (err) {
        setError('Failed to load packages. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  useEffect(() => {
    // Extract cloud name from CLOUDINARY_URL
    const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL

    if (!cloudinaryUrl) {
      console.error('CLOUDINARY_URL is not defined in environment variables')
      return
    }

    const cloudNameMatch = cloudinaryUrl.match(/@([a-z0-9-]+)/i)
    const cloudName = cloudNameMatch ? cloudNameMatch[1] : null

    if (cloudName) {
      const url = `https://res.cloudinary.com/${cloudName}/image/upload/salamadina/IMG-20250201-WA0057_qwru42`
      setImageUrl(url)
    }
  }, [])

  // Helper function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Helper function to render tags
  const renderTag = (tag: string, isPrimary = false) => (
    <span
      className={`text-xs px-2 py-1 rounded-full ${
        isPrimary
          ? 'bg-rose-100 text-rose-800'
          : 'bg-blue-100 text-blue-800'
      }`}
    >
      {tag}
    </span>
  )

  // Define categories with icons for the headers
  const categories =
    language === 'en'
      ? [
        {
          id: 'umrah',
          title: 'Umrah Packages',
          description: 'Our most popular umrah packages with excellent value',
          icon: (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          )
        },
        {
          id: 'hajj',
          title: 'Hajj Packages',
          description: 'Experience a fulfilling pilgrimage with our comprehensive Hajj packages',
          icon: (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
              {/* Simplistic mosque icon */}
              <path d="M12 2L2 10v2h20v-2L12 2z" />
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8H4z" />
            </svg>
          )
        },
        {
          id: 'edutrip',
          title: 'EduTrip Packages',
          description: 'Combine education and adventure with our specialized EduTrip packages',
          icon: (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
              {/* Simplistic book icon */}
              <path d="M4 4h16v16H4V4z" opacity="0.3" />
              <path d="M20 2H8a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm0 18H8V4h12v16z" />
            </svg>
          )
        }
      ]
      : [
        {
          id: 'umrah',
          title: 'Paket Umrah',
          description: 'Paket umrah paling populer dengan nilai luar biasa',
          icon: (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          )
        },
        {
          id: 'hajj',
          title: 'Paket Haji',
          description: 'Raih pengalaman ibadah haji yang mendalam dengan paket haji komprehensif kami',
          icon: (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
              {/* Simplistic mosque icon */}
              <path d="M12 2L2 10v2h20v-2L12 2z" />
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8H4z" />
            </svg>
          )
        },
        {
          id: 'edutrip',
          title: 'Paket EduTrip',
          description: 'Gabungkan pendidikan dengan petualangan melalui paket EduTrip kami yang spesial',
          icon: (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
              {/* Simplistic book icon */}
              <path d="M4 4h16v16H4V4z" opacity="0.3" />
              <path d="M20 2H8a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm0 18H8V4h12v16z" />
            </svg>
          )
        }
      ];


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading packages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section
      id='pricing-plans'
      className={classnames(
        'flex flex-col gap-8 lg:gap-12 plb-[100px] bg-backgroundDefault rounded-[60px] ',
        styles.sectionStartRadius
      )}
    >
      <div className={classnames('is-full', frontCommonStyles.layoutSpacing)}>
        <div className='flex flex-col gap-y-4 items-center justify-center mb-12'>
          <Chip size='small' className="text-white bg-[#811745]" variant='tonal' color='primary' label='Salamadina Tours' />
          <div className='flex flex-col items-center gap-y-1 justify-center flex-wrap'>
            <div className='flex items-center gap-x-2'>
              <Typography variant='h4' className='text-center text-[#811745]'>
                <span className='text-bold relative z-[1] font-extrabold'>
                  Product
                </span>{' '}
                Experience
              </Typography>
            </div>
          </div>
        </div>

        <Grid container spacing={6} justifyContent="center" alignItems="stretch">
          <CategorySection category={categories[0]} packages={packagesUmrah}/>
          <CategorySection category={categories[1]} packages={packagesHajj}/>
          <CategorySection category={categories[2]} packages={packagesEdutrip}/>
        </Grid>
      </div>
    </section>
  );
};

export default PricingPlan;
