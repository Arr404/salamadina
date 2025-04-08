
// MUI Imports
import { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'


// Styles Imports

import { CardMedia, LinearProgress } from '@mui/material'
import Divider from '@mui/material/Divider'

import frontCommonStyles from '@views/styles.module.css'

// Types

// Data
const pricingPlans = [

  // Umrah Packages
  {
    title: 'Umrah Economy',
    img: '/images/landing/pricing-basic.png',
    price: 1200,
    perYearPay: 14400,
    features: [
      'Budget hotel stay',
      'Group transport',
      'Shared guide',
      'Basic meal plan',
      'Visa processing',
      'Spiritual guidance sessions'
    ],
    current: false
  },
  {
    title: 'Umrah Standard',
    img: '/images/landing/pricing-enterprise.png',
    price: 2500,
    perYearPay: 30000,
    features: [
      '3-star hotel accommodations',
      'Comfortable group transport',
      'Experienced guide',
      'Buffet meals',
      'Visa assistance',
      'Dedicated worship programs'
    ],
    current: true
  },
  {
    title: 'Umrah Premium',
    img: '/images/landing/pricing-team.png',
    price: 5000,
    perYearPay: 60000,
    features: [
      '5-star hotel near Haram',
      'Luxury transport',
      'Private guide service',
      'Gourmet dining',
      'Priority visa processing',
      'VIP religious sessions'
    ],
    current: false
  }
]

const Package = () => {

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    // Extract cloud name from CLOUDINARY_URL
    const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;

    if (!cloudinaryUrl) {
      console.error("CLOUDINARY_URL is not defined in environment variables");

      return;
    }

    const cloudNameMatch = cloudinaryUrl.match(/@([a-z0-9-]+)/i);
    const cloudName = cloudNameMatch ? cloudNameMatch[1] : null;

    if (cloudName ) {
      const url = `https://res.cloudinary.com/${cloudName}/image/upload/salamadina/IMG-20250201-WA0057_qwru42`;

      setImageUrl(url);
    }
  }, []);

  const totalSeats = 100;
  const seatsLeft = 25;
  const progress = (seatsLeft / totalSeats) * 100;

  const features = [
    "Exclusive Ownership",
    "Lifetime Access to Community",
    "Special Perks & Discounts",
    "Priority on Future Drops",
    "VIP Event Invitations",
    "Early Access to New Features"
  ];

  return (
    <section className='flex flex-col md:plb-[100px] plb-[50px]  bg-backgroundPaper'>
      <div className={frontCommonStyles.layoutSpacing}>
        <Typography variant='h4' className='text-center mbe-6'>
          Package Umrah Reguler
        </Typography>

        <Grid container className={"items-center justify-center content-center"} spacing={6} justifyContent="center" alignItems="center">
          {pricingPlans.map((plan, index) => (
            <Grid item key={index} xs={12} lg={4} justifyContent="center" alignItems="center">
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Card
                  className="max-w-sm rounded-xl shadow-xl p-5 relative overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
                  {/* Image */}
                  <CardMedia
                    component="img"
                    height="250"
                    image={imageUrl}
                    alt="image"
                    className="rounded-lg"
                  />

                  <CardContent>
                    {/* Title */}
                    <Typography variant="h4" className="mt-2 font-extrabold text-center tracking-wide">
                      Umroh Hemat Plus Thaif
                    </Typography>
                    <Typography variant="h6" className="text-center text-gray-400 italic">Start jakarta 9 hari, By oman
                      air</Typography>

                    {/* Price */}
                    <Typography variant="h3" className="font-bold text-center mt-2" style={{ color: "#811745" }}>
                      Rp. 31.500.000
                    </Typography>


                    {/* Divider */}
                    <Divider className="border-gray-300 my-4" />

                    {/* Features */}
                    <div className="flex flex-col gap-3 my-3">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <span
                            className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold text-white ${index < 3 ? 'bg-blue-500' : index < 6 ? 'bg-green-500' : 'bg-yellow-500'}`}>✔</span>
                          <Typography variant="h6" className="text-gray-400">{feature}</Typography>
                        </div>
                      ))}
                    </div>

                    <Divider className="border-gray-300 my-4" />
                    {/* Seats Left */}
                    <div className="mt-4 text-left">
                      <Typography variant="h5" className="text-gray-800 font-bold mb-1">
                        {seatsLeft} seats left!
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        className="h-2 rounded-full"
                        sx={{ backgroundColor: "#444", "& .MuiLinearProgress-bar": { backgroundColor: "#811745" } }}
                      />
                    </div>

                    {/* Buy Now Button */}
                    <div className="mt-6 flex justify-center">
                      <Button
                        href={'/umrah/package-detail'}
                        variant="contained"
                        sx={{
                          backgroundColor: "#811745",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "1rem",
                          padding: "10px 20px",
                          borderRadius: "10px",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#d6005b" },
                        }}
                      >
                        Detail Paket
                      </Button>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  )
}

export default Package
