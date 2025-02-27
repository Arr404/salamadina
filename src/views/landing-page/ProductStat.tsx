"use client"

// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import { useState } from 'react'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import Check from '@assets/svg/front-pages/landing-page/Check'
import User from '@assets/svg/front-pages/landing-page/User'
import LaptopCharging from '@assets/svg/front-pages/landing-page/LaptopCharging'
import Diamond from '@assets/svg/front-pages/landing-page/Diamond'


// Styles Imports
import frontCommonStyles from '@views/styles.module.css'
import VideoIframe from '@views/landing-page/YoutubeIFrame'

// Type
type StatData = {
  title: string
  value: string
  svg: ReactNode
  color: string
  isHover: boolean
}

const videoList = [
  { id: 'oAMNlzUCytM', title: 'Video 1' },
  { id: 'sftPTw1_gbo', title: 'Video 2' },
  { id: 'e3QGVtY99ek', title: 'Video 3' },
  { id: 'oAMNlzUCytM', title: 'Video 4' }
];

// Data
const statData: StatData[] = [
  {
    title: 'Year Established',
    value: '2016',
    svg: <LaptopCharging color='var(--mui-palette-primary-main)' />,
    color: 'var(--mui-palette-primary-darkerOpacity)',
    isHover: false
  },
  {
    title: 'Customer Joined',
    value: '3500k+',
    svg: <User color='var(--mui-palette-success-main)' />,
    color: 'var(--mui-palette-success-darkerOpacity)',
    isHover: false
  },
  {
    title: 'Indonesia Agents',
    value: '30+',
    svg: <Diamond color='var(--mui-palette-info-main)' />,
    color: 'var(--mui-palette-info-darkerOpacity)',
    isHover: false
  },
  {
    title: 'Session',
    value: '60+',
    svg: <Check color='var(--mui-palette-warning-main)' />,
    color: 'var(--mui-palette-warning-darkerOpacity)',
    isHover: false
  }
]

const ProductStat = () => {

  const [currentVideo, setCurrentVideo] = useState(videoList[0].id);

  return (
    <section className='plb-[84px] bg-backgroundPaper'>
      <div className={frontCommonStyles.layoutSpacing}>
        <Grid container spacing={6}>
          {statData.map((stat, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <div
                className='flex flex-col items-center justify-center gap-y-4 border p-6 rounded'
                style={{
                  borderColor: stat.color
                }}
              >
                {stat.svg}
                <div className='text-center'>
                  <Typography variant='h3' className='font-medium'>
                    {stat.value}
                  </Typography>
                  <Typography className='font-medium'>{stat.title}</Typography>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3} className="p-4 mt-16">
          {/* Main Video Player */}
          <Grid item xs={12} md={8} className="w-full flex justify-center">
            <div className="w-full ">
              <VideoIframe videoId={currentVideo}  title={"youtube"}/>
            </div>
          </Grid>

          {/* Scrollable Video List with Thumbnails */}
          <Grid
            item
            xs={12}
            md={4}
            className="overflow-y-auto max-h-[400px] border-l md:border-l-0 md:border-t p-2"
          >
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
              {videoList.map((video) => (
                <div
                  key={video.id}
                  className="p-2 cursor-pointer hover:bg-gray-200 rounded flex items-center gap-2"
                  onClick={() => setCurrentVideo(video.id)}
                >
                  <img src={video.id} alt={video.title} className="w-20 h-12 rounded object-cover" />
                  <Typography className="font-medium text-sm md:text-base">{video.title}</Typography>
                </div>
              ))}
            </div>
          </Grid>
        </Grid>
      </div>
    </section>
  )
}

export default ProductStat
