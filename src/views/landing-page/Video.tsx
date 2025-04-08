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
import Chip from '@mui/material/Chip'

// Type
type StatData = {
  title: string
  value: string
  svg: ReactNode
  color: string
  isHover: boolean
}

const videoList = [
  { id: 'oAMNlzUCytM', title: 'Ustad Drs.H.M. Salim Bassawad. MM.Pd (Kasi Umrah & Haji Kabupaten Jombang) Jamaah Akhir Romadhon.' },
  { id: 'sftPTw1_gbo', title: 'Testimoni Bapak Lely Irawan & Ibu Frista Jamaah Salamadina 11 Maret 2019' },
  { id: 'e3QGVtY99ek', title: 'Bu Enik Khairul Ummah, M.Pd, Kepala Sekolah SD Muhammadiyah 1 Sidoarjo (Paket Turkey+Singapore+Umra)' },
  { id: 'oAMNlzUCytM', title: 'Ustad Drs.H.M. Salim Bassawad. MM.Pd (Kasi Umrah & Haji Kabupaten Jombang) Jamaah Akhir Romadhon.' }
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

const Video = () => {

  const [currentVideo, setCurrentVideo] = useState(videoList[0].id);

  return (
    <section className='plb-[84px] bg-backgroundPaper'>
      <div className='flex flex-col gap-y-4 items-center justify-center'>
        <Chip size='small' className="text-white bg-[#811745]" variant='tonal' color='primary' label='Video' />
        <div className='flex flex-col items-center gap-y-1 justify-center flex-wrap'>
          <div className='flex items-center gap-x-2'>
            <Typography  variant='h4' className='text-center text-[#811745]'>
                <span className='text-bold  relative z-[1] font-extrabold'>
                 Testimoni

                </span>{' '}
              Video
            </Typography>
          </div>

        </div>
      </div>
      <div className={frontCommonStyles.layoutSpacing}>
        <Grid container spacing={3} className="p-4">
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
                  {/*<img src={video.id} alt={video.title} className="w-20 h-12 rounded object-cover" />*/}
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

export default Video
