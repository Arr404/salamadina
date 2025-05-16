import app from '@/services/init';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Testimonial } from '@/types/testimonial';

export const db = getFirestore(app);

const COLLECTION_NAME = 'testimonials';

// Create a new testimonial
export const createTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...testimonial,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { id: docRef.id, ...testimonial };
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

// Get all testimonials
export const getTestimonials = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Testimonial[];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

// Get a single testimonial by ID
export const getTestimonialById = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Testimonial;
    } else {
      throw new Error('Testimonial not found');
    }
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    throw error;
  }
};

// Update a testimonial
export const updateTestimonial = async (id: string, testimonial: Partial<Testimonial>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...testimonial,
      updatedAt: serverTimestamp()
    });

    return { id, ...testimonial };
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

// Update a testimonial's description in a specific language
export const updateTestimonialDesc = async (id: string, language: string, description: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Testimonial not found');
    }

    const testimonial = docSnap.data() as Testimonial;
    const updatedDesc = { ...testimonial.desc, [language]: description };

    await updateDoc(docRef, {
      desc: updatedDesc,
      updatedAt: serverTimestamp()
    });

    return { id, desc: updatedDesc };
  } catch (error) {
    console.error('Error updating testimonial description:', error);
    throw error;
  }
};
