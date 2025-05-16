/*
// src/app/api/testimonials/route.ts
import { NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/services/init';

// Your testimonial data
const testimonialData = [
  {
    name: 'Muhammad Ehsan Ranca',
    position: '2025', // default value; update if needed
    avatarSrc: '/images/avatars/1.png', // default avatar
    rating: 5,
    desc: {
      ind: "Alhamdulillah.. Kami sekeluarga berkesan ikut travel Salamadina. Semoga untuk selanjutnya ada rejeki lebih berangkat lagi akan ikut Travel Salamadina lagi.. Puas dengan pelayanan dari travel, dari berangkat hingga pulang, konsumsi kami juga puas banget , kami tidak pernah kelaparan, dari berangkat hingga pulang.",
      en: "Alhamdulillah.. Our family had a memorable experience with Salamadina Travel. We hope that in the future, we’ll have more opportunities to travel with Salamadina again. We were very satisfied with the service and the meals provided throughout the journey."
    }
  },
  {
    name: 'Ibu Umi Kalsum',
    position: '2025',
    avatarSrc: '/images/avatars/2.png',
    rating: 5,
    desc: {
      ind: "Yang berkesan dalam perjalanan umroh dulu yang jelas muthowwifnya sangat menyenangkan, memberi pengarahan dan penjelasan sangat menarik, pelayanan di tanah suci juga memuaskan hanya waktu di Makkah WC sempat macet",
      en: "What stood out during the previous Umrah journey was that the muthowwif was very pleasant and offered clear guidance with engaging explanations. The service in the Holy Land was satisfying, except for a brief delay at the Makkah restroom."
    }
  },
  {
    name: 'Pak Nanang',
    position: '2025',
    avatarSrc: '/images/avatars/3.png',
    rating: 5,
    desc: {
      ind: "Travel Salamadina sangat baik pelayanannya dan saya merasa puas insyaAllah kakak saya bulan 5 berangkat dan sudah saya arahkan ke Travel Salamadina. Dan saya juga sering mengarahkan ke orang-orang kalau mau ibadah Haji sama Umrah lebih baik pakai Salamadina soalnya saya sudah merasakan sendiri. Dan insyaAllah amanah dan aman.",
      en: "Salamadina Travel offers excellent service, and I am very satisfied; God willing, my older sibling departed in May and I have already recommended Salamadina. I frequently advise people that for Hajj or Umrah, it’s best to choose Salamadina because of my own experience. God willing, they remain trustworthy and reliable."
    }
  },
  {
    name: 'Pak Anang',
    position: '2025',
    avatarSrc: '/images/avatars/4.png',
    rating: 5,
    desc: {
      ind: "Alhamdulillah baru pulang umrah bulan Rajab 2 bulan yang lalu. Masya Allah sungguh pengalaman yang luar biasa. Semoga Allah Subhanahu wa ta’ala senantiasa memudahkan langkah Bapak/Ibu untuk kembali ke Tanah Suci. Aamiin",
      en: "Alhamdulillah, I just returned from Umrah in Rajab two months ago. Masha Allah, it was an extraordinary experience. May Allah always ease your journey back to the Holy Land. Ameen."
    }
  },
  {
    name: 'Pak Didik',
    position: '2025',
    avatarSrc: '/images/avatars/5.png',
    rating: 5,
    desc: {
      ind: "Sungguh sangat luar biasa pengalaman saya di Tanah Suci bersama Salamadina dengan fasilitas hotel yang bagus, dekat, dan pembimbing yang berpengalaman membuat ibadah jadi tambah khusuk",
      en: "My experience in the Holy Land with Salamadina was truly exceptional, enhanced by excellent hotel facilities in close proximity and experienced guides who made the worship even more heartfelt."
    }
  }
];


export async function POST(request: Request) {
  try {
    const results = await Promise.all(
      testimonialData.map(async (testimonial) => {
        // Create the document with initial timestamp values.
        const docRef = await addDoc(collection(db, 'testimonials'), {
          ...testimonial,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Return the testimonial including its id at the top level and inside desc.
        return {
          id: docRef.id,
          name: testimonial.name,
          position: testimonial.position,
          avatarSrc: testimonial.avatarSrc,
          rating: testimonial.rating,
          desc: { ...testimonial.desc }
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Testimonials seeded successfully',
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed testimonials' },
      { status: 500 }
    );
  }
}
*/
