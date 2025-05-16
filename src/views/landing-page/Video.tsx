"use client"

// React Imports
import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'

// Firebase Imports
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/services/init' // You'll need to create this file

// Component Imports
import Check from '@assets/svg/front-pages/landing-page/Check'
import User from '@assets/svg/front-pages/landing-page/User'
import LaptopCharging from '@assets/svg/front-pages/landing-page/LaptopCharging'
import Diamond from '@assets/svg/front-pages/landing-page/Diamond'
import VideoIframe from '@views/landing-page/YoutubeIFrame'

// Styles Imports
import frontCommonStyles from '@views/styles.module.css'


type VideoData = {
  id: string
  videoId: string
  title: string
  description?: string
  createdAt: Date
}


const Video = () => {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [currentVideo, setCurrentVideo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const videosQuery = query(
          collection(db, 'testimonialVideos'),
          orderBy('createdAt', 'desc'),
          limit(10)
        )

        const querySnapshot = await getDocs(videosQuery)
        const videoList: VideoData[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<VideoData, 'id' | 'createdAt'> & { createdAt: { toDate: () => Date } }
          videoList.push({
            id: doc.id,
            videoId: data.videoId,
            title: data.title,
            description: data.description,
            createdAt: data.createdAt.toDate()
          })
        })

        setVideos(videoList)

        // Set the first video as current if available
        if (videoList.length > 0) {
          setCurrentVideo(videoList[0].videoId)
        }
      } catch (err) {
        console.error('Error fetching videos:', err)
        setError('Failed to load videos. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return (
    <section className='plb-[84px] bg-backgroundPaper'>
      <div className='flex flex-col gap-y-4 items-center justify-center'>
        <Chip size='small' className="text-white bg-[#811745]" variant='tonal' color='primary' label='Video' />
        <div className='flex flex-col items-center gap-y-1 justify-center flex-wrap'>
          <div className='flex items-center gap-x-2'>
            <Typography variant='h4' className='text-center text-[#811745]'>
              <span className='text-bold relative z-[1] font-extrabold'>
                Testimoni
              </span>{' '}
              Video
            </Typography>
          </div>
        </div>
      </div>

      <div className={frontCommonStyles.layoutSpacing}>
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <CircularProgress />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center p-12">
            <Typography color="error">{error}</Typography>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex justify-center items-center p-12">
            <Typography>No testimonial videos available.</Typography>
          </div>
        ) : (
          <Grid container spacing={3} className="p-4">
            {/* Main Video Player */}
            <Grid item xs={12} md={8} className="w-full flex justify-center">
              <div className="w-full">
                {currentVideo && (
                  <VideoIframe videoId={currentVideo} title="Testimonial Video" />
                )}
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
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className={`p-2 cursor-pointer rounded flex items-center gap-2 ${
                      currentVideo === video.videoId ? 'bg-gray-200' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setCurrentVideo(video.videoId)}
                  >
                    <div className="w-20 h-12 bg-gray-300 rounded flex items-center justify-center">
                      <i className="tabler-brand-youtube text-xl text-red-600" />
                    </div>
                    <div>
                      <Typography className="font-medium text-sm md:text-base">{video.title}</Typography>
                      {video.description && (
                        <Typography variant="caption" className="text-gray-600 line-clamp-1">
                          {video.description}
                        </Typography>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Grid>
          </Grid>
        )}
      </div>
    </section>
  )
}

export default Video
