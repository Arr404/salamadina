'use client'

import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from '@/services/init'
import Profile from '@/views/profile/profile'
import LoadingWrapper from '@views/loading'

interface ContentSection {
  title: string
  description: string
  image: string
}

interface ProfileData {
  titleImage?: string
  mainTitle?: string
  mainDescription?: string
  contentSections?: ContentSection[]
}

export default function AboutPage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Create a query against the "pageSections" collection
        const q = query(
          collection(db, 'pageSections'),
          where('pageType', '==', 'profile'),
          where('isActive', '==', true),
          orderBy('createdAt', 'desc'),
          limit(1)
        )

        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]
          const data = doc.data() as ProfileData
          setProfileData(data)
        } else {
          // Use default data if no document found
          setProfileData({
            titleImage: "/images/gallery/3 Februari/IMG-20250205-WA0051.jpg",
            mainTitle: "Profile",
            contentSections: [
              {
                title: 'Tentang Salamadina',
                description: 'Dengan Tagline Umrah "Umrah Jadi Baik", dan Haji khusus "Mabrur Lebih Dekat" kami ingin menginspirasi setiap jamaah untuk menjadikan perjalanan umrah sebagai momentum perubahan spiritual yang berdampak pada kehidupan pribadi dan profesional mereka.',
                image: '/images/gallery/3 Februari/IMG-20250205-WA0051.jpg'
              }
            ]
          })
        }
      } catch (error) {
        console.error("Error fetching profile data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  if (loading) {
    return <LoadingWrapper />
  }

  return profileData ? (
    <Profile
      titleImage={profileData.titleImage}
      mainTitle={profileData.mainTitle}
      contentSections={profileData.contentSections}
    />
  ) : (
    <div className="flex justify-center items-center min-h-screen">
      <p>No profile data available.</p>
    </div>
  )
}
