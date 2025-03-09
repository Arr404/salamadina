

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'


// Styles Imports
import { CardMedia, Divider, LinearProgress } from '@mui/material'

import frontCommonStyles from '@views/styles.module.css'
import styles from './styles.module.css'

const pricingPlans = [
  {
    title: 'Hajj Economy',
    img: '/images/landing/pricing-basic.png',
    price: 40,
    perYearPay: 48000,
    features: [
      'Economy accommodations',
      'Basic transportation',
      'Group guidance',
      'Standard meals',
      'Visa processing',
      'Educational seminars'
    ],
    current: true
  },
  {
    title: 'Hajj Standard',
    img: '/images/landing/pricing-enterprise.png',
    price: 40,
    perYearPay: 72000,
    features: [
      '4-star accommodations',
      'Air-conditioned transport',
      'Dedicated group leader',
      'Buffet meals',
      'Visa & document assistance',
      'Guided religious activities'
    ],
    current: false
  },
  {
    title: 'Hajj Premium',
    img: '/images/landing/pricing-team.png',
    price: 40,
    perYearPay: 108000,
    features: [
      '5-star accommodations near Haram',
      'Luxury private transport',
      'Personal religious guide',
      'Exclusive meal options',
      'Fast-track visa & document processing',
      'VIP access to religious sites'
    ],
    current: false
  },

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
  },

  // EduTrip Packages
  {
    title: 'EduTrip Basic',
    img: '/images/landing/pricing-basic.png',
    price: 800,
    perYearPay: 9600,
    features: [
      'University campus visits',
      'Cultural immersion programs',
      'Standard lodging',
      'Group transport',
      'Guided tours',
      'Basic meal plan'
    ],
    current: false
  },
  {
    title: 'EduTrip Standard',
    img: '/images/landing/pricing-enterprise.png',
    price: 1500,
    perYearPay: 18000,
    features: [
      'University & research institution visits',
      'Workshops & seminars',
      'Mid-range accommodations',
      'Comfort transport',
      'City tours',
      'Buffet meals'
    ],
    current: false
  },
  {
    title: 'EduTrip Premium',
    img: '/images/landing/pricing-team.png',
    price: 3000,
    perYearPay: 36000,
    features: [
      'Exclusive university collaborations',
      'One-on-one mentorship sessions',
      'Luxury lodging',
      'Private transport',
      'Personalized tour guide',
      'Fine dining experience'
    ],
    current: true
  }
]

const PricingPlan = () => {
  /*// States
  const [pricingPlan, setPricingPlan] = useState<'monthly' | 'annually'>('annually')
*/
  /*const handleChange = (e: ChangeEvent<{ checked: boolean }>) => {
    if (e.target.checked) {
      setPricingPlan('annually')
    } else {
      setPricingPlan('monthly')
    }
  }*/

  const totalSeats = 100;
  const seatsLeft = 25;
  const progress = (seatsLeft / totalSeats) * 100;

  const features = [
    "Exclusive NFT Ownership",
    "Lifetime Access to Community",
    "Special Perks & Discounts",
    "Priority on Future Drops",
    "VIP Event Invitations",
    "Early Access to New Features"
  ];

  return (
    <section
      id='pricing-plans'
      className={classnames(
        'flex flex-col gap-8 lg:gap-12 plb-[100px] bg-backgroundDefault rounded-[60px]',
        styles.sectionStartRadius
      )}
    >
      <div className={classnames('is-full', frontCommonStyles.layoutSpacing)}>
        <div className='flex flex-col gap-y-4 items-center justify-center mb-12'>
          <Chip size='small' className="text-white bg-[#811745]" variant='tonal' color='primary' label='Salamadina Tours' />
          <div className='flex flex-col items-center gap-y-1 justify-center flex-wrap'>
            <div className='flex items-center gap-x-2'>
              <Typography  variant='h4' className='text-center text-[#811745]'>
                <span className='text-bold  relative z-[1] font-extrabold'>
                 Product

                </span>{' '}
                Experience
              </Typography>
            </div>

          </div>
        </div>

        <Grid container spacing={6}>
          {pricingPlans.map((plan, index) => (
            <Grid item key={index} xs={12} lg={4}>
              <Card className="max-w-sm rounded-xl shadow-xl p-5 relative overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
                {/* Image */}
                <CardMedia
                  component="img"
                  height="250"
                  image="/images/gallery/28 januari/IMG-20250201-WA0057.jpg"
                  alt="NFT"
                  className="rounded-lg"
                />

                <CardContent>
                  {/* Title */}
                  <Typography variant="h4" className="mt-2 font-extrabold text-center tracking-wide">
                    Umroh Hemat Plus Thaif
                  </Typography>
                  <Typography variant="h6" className="text-center text-gray-400 italic">Start jakarta 9 hari, By oman air</Typography>

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
                        <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold text-white ${index < 3 ? 'bg-blue-500' : index < 6 ? 'bg-green-500' : 'bg-yellow-500'}`}>✔</span>
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


            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  )
}

export default PricingPlan
