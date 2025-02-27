// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// Styles Imports
import frontCommonStyles from '@views/styles.module.css'
import styles from './styles.module.css'

type FaqsDataTypes = {
  id: string
  question: string
  active?: boolean
  answer: string
}

const FaqsData: FaqsDataTypes[] = [
  {
    id: 'panel1',
    question: 'What is included in your Hajj and Umrah packages?',
    answer:
      'Our packages typically include flights, accommodation near Haram, transportation, visa processing, guided tours, and meals. Specific inclusions may vary by package, so please check the details for your selected plan.'
  },
  {
    id: 'panel2',
    question: 'Do I need a visa for Hajj or Umrah?',
    active: true,
    answer:
      'Yes, a visa is required for both Hajj and Umrah. We assist in obtaining the necessary visa as part of our service. Requirements include a valid passport, vaccination certificates, and other necessary documents.'
  },
  {
    id: 'panel3',
    question: 'What are the accommodation options during Hajj and Umrah?',
    answer:
      'We offer a range of accommodations from budget-friendly to premium hotels near Masjid al-Haram in Makkah and Masjid an-Nabawi in Madinah. Our packages specify the hotels included, ensuring comfort and convenience.'
  },
  {
    id: 'panel4',
    question: 'What is the best time to perform Umrah?',
    answer:
      'Umrah can be performed year-round, but many prefer to travel during Ramadan for its spiritual rewards. Off-peak seasons (outside Ramadan and Hajj) offer a less crowded experience and lower costs.'
  }
]

const Faqs = () => {
  // Refs
  const skipIntersection = useRef(true)
  const ref = useRef<null | HTMLDivElement>(null)

  // Hooks
  const { updateIntersections } = useIntersection()

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

    ref.current && observer.observe(ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id='faq' ref={ref} className={classnames('plb-[100px] bg-backgroundDefault', styles.sectionStartRadius)}>
      <div className={classnames('flex flex-col gap-16', frontCommonStyles.layoutSpacing)}>
        <div className='flex flex-col gap-y-4 items-center justify-center'>
          <Chip size='small' variant='tonal' color='primary' label='FAQ' />
          <div className='flex flex-col items-center gap-y-1 justify-center flex-wrap'>
            <div className='flex items-center gap-x-2'>
              <Typography color='text.primary' variant='h4'>
                Frequently asked
                <span className='relative z-[1] font-extrabold'>
                  <img
                    src='/images/landing/bg-shape.png'
                    alt='bg-shape'
                    className='absolute block-end-0 z-[1] bs-[40%] is-[132%] -inline-start-[8%] block-start-[17px]'
                  />{' '}
                  questions
                </span>
              </Typography>
            </div>
            <Typography className='text-center'>
              Browse through these FAQs to find answers to commonly asked questions.
            </Typography>
          </div>
        </div>
        <div>
          <Grid container spacing={6}>
            <Grid item xs={12} lg={5} className='text-center'>
              <img
                src='/images/landing/umrah.jpg'
                alt='boy with laptop'
                className='rounded-xl is-[80%] max-is-[320px]'
              />
            </Grid>
            <Grid item xs={12} lg={7}>
              <div>
                {FaqsData.map((data, index) => {
                  return (
                    <Accordion key={index} defaultExpanded={data.active}>
                      <AccordionSummary
                        aria-controls={data.id + '-content'}
                        id={data.id + '-header'}
                        className='font-medium'
                        color='text.primary'
                      >
                        {data.question}
                      </AccordionSummary>
                      <AccordionDetails className='text-textSecondary'>{data.answer}</AccordionDetails>
                    </Accordion>
                  )
                })}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </section>
  )
}

export default Faqs
