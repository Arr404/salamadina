import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import app from '@/services/init'


// Initialize Firebase
const db = getFirestore(app);

// Types
export interface UmrahPackage {
  packageType: string;
  subType?: string;
  tags?: string[];
  id?: string;
  title: string;
  subtitle: string;
  price: number;
  features: Array<{ label: string; icon: string }>;
  seatsLeft: number;
  totalSeats: number;
  imageUrl: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type UmrahPackagesInput = Omit<UmrahPackage, 'id' | 'createdAt' | 'updatedAt'>;

// Firebase Services
export const umrahPackageservice = {
  // Fetch all packages
  getPackages: async (): Promise<UmrahPackage[]> => {
    try {
      const q = query(collection(db, "umrahPackages"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const packagesData: UmrahPackage[] = [];

      querySnapshot.forEach((doc) => {
        packagesData.push({ id: doc.id, ...doc.data() } as UmrahPackage);
      });

      return packagesData;
    } catch (error) {
      console.error("Error fetching packages: ", error);
      throw new Error("Failed to fetch packages");
    }
  },

  // Add a new package
  addPackage: async (packageData: UmrahPackagesInput): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, "umrahPackages"), {
        ...packageData,
        createdAt: Timestamp.now()
      });

      return docRef.id;
    } catch (error) {
      console.error("Error adding package: ", error);
      throw new Error("Failed to add package");
    }
  },

  // Update an existing package
  updatePackage: async (id: string, packageData: Partial<UmrahPackagesInput>): Promise<void> => {
    try {
      // Check if ID exists
      if (!id) {
        throw new Error("Package ID is required");
      }

      const packageRef = doc(db, "umrahPackages", id);

      // Log what we're trying to update for debugging
      console.log(`Updating package ${id} with data:`, packageData);

      await updateDoc(packageRef, {
        ...packageData,
        updatedAt: Timestamp.now()
      });

      console.log(`Package ${id} updated successfully`);
    } catch (error) {
      console.error("Error updating package: ", error);
      // More detailed error information
      if (error instanceof Error) {
        throw new Error(`Failed to update package: ${error.message}`);
      } else {
        throw new Error("Failed to update package: Unknown error");
      }
    }
  },

  // Delete a package
  deletePackage: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "umrahPackages", id));
    } catch (error) {
      console.error("Error deleting package: ", error);
      throw new Error("Failed to delete package");
    }
  }
};
