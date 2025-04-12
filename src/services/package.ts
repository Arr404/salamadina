import { getLanguage } from "@/utils/getLanguage";
import { addDoc, getDoc, collection, deleteDoc, deleteField, doc, getDocs, orderBy, query, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./init";

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
  // Additional language specific fields
  enTitle?: string;
  enSubtitle?: string;
  enFeatures?: Array<{ label: string; icon: string }>;
  indTitle?: string;
  indSubtitle?: string;
  indFeatures?: Array<{ label: string; icon: string }>;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type UmrahPackagesInput = Omit<UmrahPackage, 'id' | 'createdAt' | 'updatedAt'>;

export const umrahPackageservice = {
  // Fetch all packages – merge common data with the language-specific content.
  getPackages: async (packageTitle: string): Promise<UmrahPackage[]> => {
    const lang = getLanguage();
    try {
      // We now order by commonData.createdAt (you may need an index on this field)
      const q = query(collection(db, packageTitle), orderBy("commonData.createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const packagesData: UmrahPackage[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const commonData = data.commonData || {};
        const currentLangData = (data.languages && data.languages[lang]) || {};

        // Get data for the other language(s)
        const otherLangData: any = {};
        if (data.languages) {
          // If current language is English, get Indonesian data
          if (lang === 'en' && data.languages['ind']) {
            otherLangData.indTitle = data.languages['ind'].title;
            otherLangData.indSubtitle = data.languages['ind'].subtitle;
            otherLangData.indFeatures = data.languages['ind'].features;
          }
          // If current language is Indonesian, get English data
          else if (lang === 'ind' && data.languages['en']) {
            otherLangData.enTitle = data.languages['en'].title;
            otherLangData.enSubtitle = data.languages['en'].subtitle;
            otherLangData.enFeatures = data.languages['en'].features;
          }
        }

        // Merge the common and language-specific fields, along with other language data
        packagesData.push({
          id: docSnap.id,
          ...commonData,
          ...currentLangData,
          ...otherLangData
        } as UmrahPackage);
      });

      return packagesData;
    } catch (error) {
      console.error("Error fetching packages: ", error);
      throw new Error("Failed to fetch packages");
    }
  },
  getPackageById : async (id: string, packageTitle: string): Promise<UmrahPackage> => {
    const lang = getLanguage();
    try {
      const docRef = doc(db, packageTitle, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Package not found");
      }

      const data = docSnap.data();
      const commonData = data.commonData || {};
      const currentLangData = (data.languages && data.languages[lang]) || {};

      // Get data for the other language(s)
      const otherLangData: any = {};
      if (data.languages) {
        // If current language is English, get Indonesian data
        if (lang === "en" && data.languages["ind"]) {
          otherLangData.indTitle = data.languages["ind"].title;
          otherLangData.indSubtitle = data.languages["ind"].subtitle;
          otherLangData.indFeatures = data.languages["ind"].features;
        }
        // If current language is Indonesian, get English data
        else if (lang === "ind" && data.languages["en"]) {
          otherLangData.enTitle = data.languages["en"].title;
          otherLangData.enSubtitle = data.languages["en"].subtitle;
          otherLangData.enFeatures = data.languages["en"].features;
        }
      }

      // Merge and return the package data as UmrahPackage
      return {
        id: docSnap.id,
        ...commonData,
        ...currentLangData,
        ...otherLangData,
      } as UmrahPackage;
    } catch (error) {
      console.error("Error fetching package by id: ", error);
      throw new Error("Failed to fetch package");
    }
  },
  // Add a new package – store common fields separately from language-specific data.
  // Add a new package – store common fields separately from language-specific data.
  addPackage: async (packageData: UmrahPackagesInput, packageTitle: string): Promise<string> => {
    const lang = getLanguage();
    try {
      // Extract all language-specific data
      const {
        title, subtitle, features,
        indTitle, indSubtitle, indFeatures,
        enTitle, enSubtitle, enFeatures,
        ...commonFields
      } = packageData;

      // Prepare the language data structure
      const languagesData: Record<string, any> = {};

      // Set English language data
      languagesData['en'] = {
        title: lang === 'en' ? title : (enTitle || title),
        subtitle: lang === 'en' ? subtitle : (enSubtitle || subtitle),
        features: lang === 'en' ? features : (enFeatures || features)
      };

      // Set Indonesian language data
      languagesData['ind'] = {
        title: lang === 'ind' ? title : (indTitle || title),
        subtitle: lang === 'ind' ? subtitle : (indSubtitle || subtitle),
        features: lang === 'ind' ? features : (indFeatures || features)
      };

      // Ensure all features arrays have valid structure
      Object.keys(languagesData).forEach(langKey => {
        const langFeatures = languagesData[langKey].features;
        if (!langFeatures || !Array.isArray(langFeatures)) {
          languagesData[langKey].features = [];
        } else {
          // Filter out any invalid feature entries
          languagesData[langKey].features = langFeatures.filter(
            feature => feature && typeof feature === 'object' && feature.label
          );
        }
      });

      const newDoc = {
        commonData: {
          ...commonFields,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        },
        languages: languagesData
      };

      // For debugging
      console.log("Creating new package with data:", newDoc);

      const docRef = await addDoc(collection(db, packageTitle), newDoc);
      return docRef.id;
    } catch (error) {
      console.error("Error adding package: ", error);
      throw new Error("Failed to add package");
    }
  },

  // Update an existing package – update both common and language-specific fields as needed.
  updatePackage: async (id: string, packageTitle: string, packageData: Partial<UmrahPackagesInput>): Promise<void> => {
    const lang = getLanguage();
    try {
      if (!id) {
        throw new Error("Package ID is required");
      }

      // Extract language-specific fields to update
      const {
        title, subtitle, features,
        indTitle, indSubtitle, indFeatures,
        enTitle, enSubtitle, enFeatures,
        ...commonFields
      } = packageData;

      const updateData: any = {};

      // Update current language data if provided
      if (lang === 'en' && (title || subtitle || features)) {
        updateData[`languages.en`] = {
          title: title || deleteField(),
          subtitle: subtitle || deleteField(),
          features: features || deleteField()
        };
      } else if (lang === 'ind' && (title || subtitle || features)) {
        updateData[`languages.ind`] = {
          title: title || deleteField(),
          subtitle: subtitle || deleteField(),
          features: features || deleteField()
        };
      }

      // Update other language data if provided
      if (lang === 'en' && (indTitle || indSubtitle || indFeatures)) {
        updateData[`languages.ind`] = {
          title: indTitle || deleteField(),
          subtitle: indSubtitle || deleteField(),
          features: indFeatures || deleteField()
        };
      } else if (lang === 'ind' && (enTitle || enSubtitle || enFeatures)) {
        updateData[`languages.en`] = {
          title: enTitle || deleteField(),
          subtitle: enSubtitle || deleteField(),
          features: enFeatures || deleteField()
        };
      }

      // Prepare common fields update
      if (Object.keys(commonFields).length > 0) {
        // Create a properly structured update for commonData
        Object.keys(commonFields).forEach(key => {
          if (commonFields[key as keyof typeof commonFields] !== undefined) {
            updateData[`commonData.${key}`] = commonFields[key as keyof typeof commonFields];
          }
        });
      }

      // Always update the timestamp
      updateData["commonData.updatedAt"] = Timestamp.now();

      const packageRef = doc(db, packageTitle, id);
      console.log(`Updating package ${id} with data:`, updateData);
      await updateDoc(packageRef, updateData);
      console.log(`Package ${id} updated successfully`);
    } catch (error) {
      console.error("Error updating package: ", error);
      if (error instanceof Error) {
        throw new Error(`Failed to update package: ${error.message}`);
      } else {
        throw new Error("Failed to update package: Unknown error");
      }
    }
  },

  // Delete a package – the document is removed regardless of the languages stored.
  deletePackage: async (id: string, packageTitle: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, packageTitle, id));
    } catch (error) {
      console.error("Error deleting package: ", error);
      throw new Error("Failed to delete package");
    }
  }
};
