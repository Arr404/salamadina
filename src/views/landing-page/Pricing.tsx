import { useState, useEffect, JSX, SVGProps } from 'react';
import { umrahPackageservice, UmrahPackage } from '@/services/package'
import { Grid, Typography, Chip } from '@mui/material'
import classnames from 'classnames'
import styles from './styles.module.css'
import frontCommonStyles from '../styles.module.css'

const PricingPlan = () => {
  const [packages, setPackages] = useState<UmrahPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')

  // Fetch packages from Firebase
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        const packagesData = await umrahPackageservice.getPackages()
        // Limit to only 3 packages
        const limitedPackages = packagesData.slice(0, 3)
        setPackages(limitedPackages)
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
  const categories = [
    {
      id: 'umrah',
      title: 'Umrah Packages',
      description: 'Our most popular umrah packages with excellent value',
      icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
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
          {/* Category Header */}
          <Grid item xs={12} justifyContent="center" alignItems="center">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center">
                <div className="h-px w-8 bg-gray-300"></div>
                {categories[0].icon({ className: "w-6 h-6 mx-3 text-[#811745]" })}
                <div className="h-px w-8 bg-gray-300"></div>
              </div>
              <h3 className="text-xl font-bold text-[#811745] mt-2">{categories[0].title}</h3>
              <p className="text-sm text-gray-500 mt-1">{categories[0].description}</p>
            </div>
          </Grid>

          {/* Packages */}
          {packages.map((plan) => (
            <Grid item xs={12} md={6} lg={4} key={plan.id}>
              <div className="bg-white h-full rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-transform duration-300 hover:scale-105">
                {/* Card Image */}
                <div className="relative h-48 bg-gray-200">
                  <img className="h-full w-full object-cover" src={plan.imageUrl || "/api/placeholder/400/320"} alt="package" />
                </div>

                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {plan.packageType && renderTag(plan.packageType, true)}
                    {plan.subType && renderTag(plan.subType)}
                    {plan.tags?.filter(tag =>
                      tag !== plan.packageType &&
                      tag !== plan.subType
                    ).map(tag => (
                      <span key={tag} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-center mb-2">{plan.title}</h3>
                  <p className="text-gray-500 text-center italic mb-4">{plan.subtitle}</p>

                  {/* Price */}
                  <p className="text-2xl font-bold text-center text-rose-800 mb-6">
                    {formatPrice(plan.price)}
                  </p>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {feature.icon === '' ? (
                          <span
                            className={`w-5 h-5 flex items-center justify-center rounded-full text-white ${
                              idx < 3 ? 'bg-blue-500' : idx < 6 ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                          >
                            ✓
                          </span>
                        ) : (
                          <i className={`tabler-${feature.icon} text-blue-600 text-lg`} />
                        )}
                        <span className="text-gray-600">{feature.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Seats */}
                  <div className="mb-6">
                    <p className="font-bold mb-2">{plan.seatsLeft} seats left!</p>
                    <div className="h-2 bg-rose-100 rounded-full">
                      <div
                        className="h-full bg-rose-800 rounded-full"
                        style={{ width: `${(plan.seatsLeft/plan.totalSeats) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Button */}
                  <button className="w-full bg-rose-800 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">
                    <i className="tabler-user-search"></i>
                    Detail Paket
                  </button>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  );
};

export default PricingPlan;
