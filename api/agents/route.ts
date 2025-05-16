// src/app/api/Agents/route.ts
import { NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/services/init';
import dataJson from '@views/landing-page/dataJson'

// Your testimonial data
const testimonialData = dataJson


export async function POST(request: Request) {
  try {
    const results = await Promise.all(
      testimonialData.map(async (testimonial) => {
        // Create the document with initial timestamp values.
        const docRef = await addDoc(collection(db, 'agents'), {
          ...testimonial,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Return the testimonial including its id at the top level and inside desc.
        return {
          id: docRef.id,
          name: testimonial.name,
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Agents seeded successfully',
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error seeding Agents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed Agents' },
      { status: 500 }
    );
  }
}
