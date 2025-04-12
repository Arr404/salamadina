import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import app from '@/services/init';
const db = getFirestore(app);

// -----
// Types for Cloudinary images
interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  createdAt: any; // Expect a Firestore Timestamp or date string
}

// Fetch Cloudinary images from Firestore collection "cloudinaryImages"
export const fetchCloudinaryImages = async (): Promise<CloudinaryImage[]> => {
  try {
    const imagesRef = collection(db, "cloudinaryImages");
    const q = query(imagesRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const images: CloudinaryImage[] = [];
    querySnapshot.forEach((doc) => {
      images.push(doc.data() as CloudinaryImage);
    });
    return images;
  } catch (error) {
    console.error("Failed to fetch Cloudinary images from Firestore:", error);
    return [];
  }
};
