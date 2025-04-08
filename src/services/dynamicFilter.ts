
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import app from './init';


const db = getFirestore(app);

// Collection references
const promosCollection = collection(db, 'promos');
const airportsCollection = collection(db, 'airports');

// Fetch all filters from Firestore
export const fetchFilters = async () => {
  try {
    // Get all documents from each collection
    const promosSnapshot = await getDocs(promosCollection);
    const airportsSnapshot = await getDocs(airportsCollection);

    // Transform the snapshots into arrays of data
    const promos = promosSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }));

    const airports = airportsSnapshot.docs.map(doc => ({
      id: doc.id,
      code: doc.data().code,
      name: doc.data().name
    }));


    return { promos, airports };
  } catch (error) {
    console.error("Error fetching filters:", error);
    throw error;
  }
};

// Add a new promo
export const addPromo = async (promoName: any) => {
  try {
    const docRef = await addDoc(promosCollection, { name: promoName });
    return { id: docRef.id, name: promoName };
  } catch (error) {
    console.error("Error adding promo:", error);
    throw error;
  }
};

// Delete a promo
export const deletePromo = async (promoId: string) => {
  try {
    await deleteDoc(doc(db, 'promos', promoId));
    return true;
  } catch (error) {
    console.error("Error deleting promo:", error);
    throw error;
  }
};

// Add a new airport
export const addAirport = async (airportCode: any, airportName: any) => {
  try {
    const docRef = await addDoc(airportsCollection, {
      code: airportCode,
      name: airportName
    });
    return { id: docRef.id, code: airportCode, name: airportName };
  } catch (error) {
    console.error("Error adding airport:", error);
    throw error;
  }
};

// Delete an airport
export const deleteAirport = async (airportId: string) => {
  try {
    await deleteDoc(doc(db, 'airports', airportId));
    return true;
  } catch (error) {
    console.error("Error deleting airport:", error);
    throw error;
  }
};


// Update a promo
export const updatePromo = async (promoId: string, promoName: any) => {
  try {
    const promoRef = doc(db, 'promos', promoId);
    await updateDoc(promoRef, { name: promoName });
    return { id: promoId, name: promoName };
  } catch (error) {
    console.error("Error updating promo:", error);
    throw error;
  }
};

// Update an airport
export const updateAirport = async (airportId: string, airportCode: any, airportName: any) => {
  try {
    const airportRef = doc(db, 'airports', airportId);
    await updateDoc(airportRef, {
      code: airportCode,
      name: airportName
    });
    return { id: airportId, code: airportCode, name: airportName };
  } catch (error) {
    console.error("Error updating airport:", error);
    throw error;
  }
};

