
// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styles Imports
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
          <Chip size='small' variant='tonal' color='primary' label='Pricing Plans' />
          <div className='flex flex-col items-center gap-y-1 justify-center flex-wrap'>
            <div className='flex items-center gap-x-2'>
              <Typography color='text.primary' variant='h4' className='text-center'>
                <span className='relative z-[1] font-extrabold'>
                  Tailored pricing plans
                  <img
                    src='/images/landing/bg-shape.png'
                    alt='bg-shape'
                    className='absolute block-end-0 z-[1] bs-[40%] is-[125%] sm:is-[132%] -inline-start-[10%] sm:inline-start-[-19%] block-start-[17px]'
                  />
                </span>{' '}
                designed for you
              </Typography>
            </div>
            <Typography className='text-center'>
              All plans include 40+ advanced tools and features to boost your product.
              <br />
              Choose the best plan to fit your needs.
            </Typography>
          </div>
        </div>

        <Grid container spacing={6}>
          {pricingPlans.map((plan, index) => (
            <Grid item key={index} xs={12} lg={4}>
              <Card
                className={`${plan.current && "border-2"} shadow-xl ${
                  index < 3
                    ? "border-[var(--mui-palette-primary-main)] text-[var(--mui-palette-primary-main)]"
                    : index < 6
                      ? "border-[var(--mui-palette-secondary-main)] text-[var(--mui-palette-secondary-main)]"
                      : "border-[var(--mui-palette-warning-main)] text-[var(--mui-palette-warning-main)]"
                }`}
              >
                <CardContent className="flex flex-col gap-8 p-8">
                  {/* Image */}
                  <div className="is-full flex flex-col items-center gap-3">
                    <img
                      src={plan.img}
                      alt={plan.img}
                      height="88"
                      width="86"
                      className="text-center"
                    />
                  </div>

                  {/* Title & Price */}
                  <div className="flex flex-col items-center gap-y-[2px] relative">
                    <Typography className="text-center" variant="h4">
                      {plan.title}
                    </Typography>
                    <div className="flex items-baseline gap-x-1">
                      <Typography
                        variant="h2"
                        className={`font-extrabold ${
                          index < 3
                            ? "text-[var(--mui-palette-primary-main)]"
                            : index < 6
                              ? "text-[var(--mui-palette-secondary-main)]"
                              : "text-[var(--mui-palette-warning-main)]"
                        }`}
                      >
                        Rp. {plan.price} Jt
                      </Typography>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-col gap-3 mbs-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-[12px]">
                        <CustomAvatar
                          color={
                            index < 3
                              ? "primary"
                              : index < 6
                                ? "secondary"
                                : "warning"
                          }
                          skin={plan.current ? "filled" : "light"}
                          size={20}
                        >
                          <i className="tabler-check text-sm" />
                        </CustomAvatar>
                        <Typography variant="h6">{feature}</Typography>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <Button
                    component={Link}
                    href="/front-pages/payment"
                    variant={plan.current ? "contained" : "tonal"}
                    className={`${
                      index < 3
                        ? "bg-[var(--mui-palette-primary-main)] text-white"
                        : index < 6
                          ? "bg-[var(--mui-palette-secondary-main)] text-white"
                          : "bg-[var(--mui-palette-warning-main)] text-black"
                    }`}
                  >
                    Get Started
                  </Button>
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
