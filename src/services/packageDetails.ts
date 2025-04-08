import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import app from '@/services/init';

// Initialize Firebase
const db = getFirestore(app);

// Types
export interface HotelInfo {
  city: string;
  name: string;
  distance: string;
  rating: number;
  mapUrl: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities?: string[];
}

export interface UmrahPackageDetails {
  id?: string;
  packageId: string;
  airline: string;
  peopleInRoom: string;
  duration: string;
  departureDate: string;
  nextManasik: string;
  includedItems: string[];
  excludedItems: string[];
  hotels: HotelInfo[];
  itinerary: ItineraryDay[];
  requirements: string[];
  terms: string[];
  facilities: Array<{
    title: string;
    description: string;
  }>;
  additionalInformation?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type UmrahPackageDetailsInput = Omit<UmrahPackageDetails, 'id' | 'createdAt' | 'updatedAt'>;

// Firebase Services
export const packageDetailsService = {
  init() {
    return this;
  },
  // Get [packageId] for a specific package
  getPackageDetails: async (packageId: string): Promise<UmrahPackageDetails | null> => {
    try {
      const q = query(collection(db, "packageDetails"), where("packageId", "==", packageId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      // There should only be one document per packageId
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as UmrahPackageDetails;
    } catch (error) {
      console.error("Error fetching package [packageId]: ", error);
      throw new Error("Failed to fetch package [packageId]");
    }
  },

  // Get [packageId] by its own ID
  getDetailsById: async (detailsId: string): Promise<UmrahPackageDetails | null> => {
    try {
      const docRef = doc(db, "packageDetails", detailsId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return { id: docSnap.id, ...docSnap.data() } as UmrahPackageDetails;
    } catch (error) {
      console.error("Error fetching package [packageId] by ID: ", error);
      throw new Error("Failed to fetch package [packageId]");
    }
  },

  // Add new package [packageId]
  addPackageDetails: async (detailsData: UmrahPackageDetailsInput): Promise<string> => {
    try {
      packageDetailsService.init();
      // Check if [packageId] already exist for this package
      const existingDetails = await packageDetailsService.getPackageDetails(detailsData.packageId) ;
      if (existingDetails) {
        throw new Error("Details for this package already exist");
      }

      const sanitizedData = packageDetailsService.sanitizeDetailsData(detailsData);
      const docRef = await addDoc(collection(db, "packageDetails"), {
        ...sanitizedData,
        createdAt: Timestamp.now()
      });

      return docRef.id;
    } catch (error) {
      console.error("Error adding package [packageId]: ", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to add package [packageId]");
    }
  },

  // Update existing package [packageId]
  updatePackageDetails: async (
    detailsId: string,
    detailsData: Partial<UmrahPackageDetailsInput>
  ): Promise<void> => {
    try {
      if (!detailsId) {
        throw new Error("Details ID is required");
      }
      packageDetailsService.init();
      const sanitizedData = packageDetailsService.sanitizeDetailsData(detailsData);
      const detailsRef = doc(db, "packageDetails", detailsId);

      await updateDoc(detailsRef, {
        ...sanitizedData,
        updatedAt: Timestamp.now()
      });

      console.log(`Package details ${detailsId} updated successfully`);
    } catch (error) {
      console.error("Error updating package [packageId]: ", error);
      if (error instanceof Error) {
        throw new Error(`Failed to update package details: ${error.message}`);
      } else {
        throw new Error("Failed to update package [packageId]");
      }
    }
  },

  // Delete package [packageId]
  deletePackageDetails: async (detailsId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "packageDetails", detailsId));
    } catch (error) {
      console.error("Error deleting package [packageId]: ", error);
      throw new Error("Failed to delete package [packageId]");
    }
  },

  // Helper to sanitize input data and prevent null/undefined issues
  sanitizeDetailsData(data: Partial<UmrahPackageDetailsInput>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    // Only copy defined fields to avoid null/undefined issues
    if (data.packageId !== undefined) sanitized.packageId = data.packageId;
    if (data.airline !== undefined) sanitized.airline = data.airline || '';
    if (data.peopleInRoom !== undefined) sanitized.peopleInRoom = data.peopleInRoom || '';
    if (data.duration !== undefined) sanitized.duration = data.duration || '';
    if (data.departureDate !== undefined) sanitized.departureDate = data.departureDate || '';
    if (data.nextManasik !== undefined) sanitized.nextManasik = data.nextManasik || '';

    // Handle arrays
    if (data.includedItems !== undefined) {
      sanitized.includedItems = Array.isArray(data.includedItems)
        ? data.includedItems.map(item => item || '')
        : [];
    }

    if (data.excludedItems !== undefined) {
      sanitized.excludedItems = Array.isArray(data.excludedItems)
        ? data.excludedItems.map(item => item || '')
        : [];
    }

    if (data.requirements !== undefined) {
      sanitized.requirements = Array.isArray(data.requirements)
        ? data.requirements.map(item => item || '')
        : [];
    }

    if (data.terms !== undefined) {
      sanitized.terms = Array.isArray(data.terms)
        ? data.terms.map(item => item || '')
        : [];
    }

    // Handle complex objects
    if (data.hotels !== undefined) {
      sanitized.hotels = Array.isArray(data.hotels)
        ? data.hotels.map(hotel => ({
          city: hotel.city || '',
          name: hotel.name || '',
          distance: hotel.distance || '',
          rating: typeof hotel.rating === 'number' ? hotel.rating : 0,
          mapUrl: hotel.mapUrl || ''
        }))
        : [];
    }

    if (data.itinerary !== undefined) {
      sanitized.itinerary = Array.isArray(data.itinerary)
        ? data.itinerary.map(day => ({
          day: typeof day.day === 'number' ? day.day : 0,
          title: day.title || '',
          description: day.description || '',
          activities: Array.isArray(day.activities)
            ? day.activities.map(activity => activity || '')
            : []
        }))
        : [];
    }

    if (data.facilities !== undefined) {
      sanitized.facilities = Array.isArray(data.facilities)
        ? data.facilities.map(facility => ({
          title: facility.title || '',
          description: facility.description || ''
        }))
        : [];
    }

    if (data.additionalInformation !== undefined) {
      sanitized.additionalInformation = data.additionalInformation || '';
    }

    return sanitized;
  }
};

export default packageDetailsService;
