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

const db = getFirestore(app);

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

export interface UmrahPackageTranslation {
  phone: string;
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
}

export interface UmrahPackageDetails {
  id?: string;
  packageId: string;
  translations: {
    en?: UmrahPackageTranslation;
    ind?: UmrahPackageTranslation;
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Enhanced input type that accepts both languages
export type UmrahPackageDetailsInput = {
  packageId: string;
  translations: {
    en?: UmrahPackageTranslation;
    ind?: UmrahPackageTranslation;
  };
};

// Legacy input type for backward compatibility
export type UmrahPackageDetailsLegacyInput = {
  packageId: string;
  language: 'en' | 'ind';
  data: UmrahPackageTranslation;
};

export const packageDetailsService = {
  // Get full package details with all translations
  getPackageDetails: async (packageId: string): Promise<UmrahPackageDetails | null> => {
    const q = query(collection(db, 'packageDetails'), where('packageId', '==', packageId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as UmrahPackageDetails;
  },

  // Get a specific language translation for a package
  getPackageTranslation: async (packageId: string, language: 'en' | 'ind' = 'en'): Promise<UmrahPackageTranslation | null> => {
    const details = await packageDetailsService.getPackageDetails(packageId);
    if (!details || !details.translations || !details.translations[language]) {
      return null;
    }
    return details.translations[language];
  },

  getDetailsById: async (detailsId: string): Promise<UmrahPackageDetails | null> => {
    const docRef = doc(db, 'packageDetails', detailsId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as UmrahPackageDetails) : null;
  },

  // New method: Add or update both languages at once
  savePackageDetails: async (input: UmrahPackageDetailsInput): Promise<string> => {
    const { packageId, translations } = input;

    // Validate at least one language is provided
    if (!translations.en && !translations.ind) {
      throw new Error('At least one language translation must be provided');
    }

    try {
      const q = query(collection(db, 'packageDetails'), where('packageId', '==', packageId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Create new document with both translations
        const newDoc = await addDoc(collection(db, 'packageDetails'), {
          packageId,
          translations,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        return newDoc.id;
      } else {
        // Update existing document with new translations
        const docRef = snapshot.docs[0].ref;
        const existingData = snapshot.docs[0].data() as UmrahPackageDetails;
        const existingTranslations = existingData.translations || {};

        // Merge existing translations with new ones
        const updatedTranslations = {
          ...existingTranslations,
          ...translations
        };

        await updateDoc(docRef, {
          translations: updatedTranslations,
          updatedAt: Timestamp.now()
        });

        return docRef.id;
      }
    } catch (error) {
      console.error("Error saving package details:", error);
      throw new Error("Failed to save package details");
    }
  },

  // Legacy method: Add or update a specific language translation
  addOrUpdateTranslation: async (input: UmrahPackageDetailsLegacyInput): Promise<string> => {
    const { packageId, language, data } = input;

    // Convert legacy input to new format
    const translations = { [language]: data };

    return packageDetailsService.savePackageDetails({
      packageId,
      translations: translations as { en?: UmrahPackageTranslation; ind?: UmrahPackageTranslation }
    });
  },

  // Update one language while preserving the other
  updateLanguageTranslation: async (
    packageId: string,
    language: 'en' | 'ind',
    data: UmrahPackageTranslation
  ): Promise<string> => {
    // Get existing details first
    const existingDetails = await packageDetailsService.getPackageDetails(packageId);
    const translations = existingDetails?.translations || {};

    // Update only the specified language
    translations[language] = data;

    // Save using the new method
    return packageDetailsService.savePackageDetails({
      packageId,
      translations
    });
  },

  deletePackageDetails: async (detailsId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'packageDetails', detailsId));
    } catch (error) {
      console.error("Error deleting package details:", error);
      throw new Error("Failed to delete package details");
    }
  }
};

export default packageDetailsService;
