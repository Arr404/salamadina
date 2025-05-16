import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

import { GalleryContextType, GroupPhoto, Photo } from '@/types/gallery';
import { auth } from '@/services/auth';
import { db } from '@/services/init';
import { uploadImage } from '@/services/cloudinary';

export const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

// Context Provider
export const GalleryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedTag, setSelectedTag] = useState('All Tags');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [formVisible, setFormVisible] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [selectedGroupPhotoId, setSelectedGroupPhotoId] = useState<string | null>(null);

  useEffect(() => {
    console.log(photos)
  }, [photos])
  // Derived state
  const isAdmin = !!currentUser;

  // Filter options derived from photos
  const filters = {
    categories: ['All Categories', ...Array.from(new Set(photos.map(photo => photo.category)))],
    tags: ['All Tags', ...Array.from(new Set(photos.flatMap(photo => photo.tags)))],
  };

  // Filtered photos based on search and filters
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || photo.category === selectedCategory;
    const matchesTag = selectedTag === 'All Tags' || photo.tags.includes(selectedTag);
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch photos from Firestore
  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "photos"));
        const photoData: Photo[] = [];

        for (const docSnapshot of querySnapshot.docs) {
          const photoDoc = docSnapshot.data() as Omit<Photo, 'id' | 'groupPhotos'> & { groupPhotoIds?: string[] };
          const photoId = docSnapshot.id;

          // Fetch group photos
          const groupPhotos: GroupPhoto[] = [];
          if (photoDoc.groupPhotoIds && photoDoc.groupPhotoIds.length > 0) {
            const groupPhotosQuery = query(
              collection(db, "groupPhotos"),
              where("photoId", "==", photoId)
            );

            const groupPhotosSnapshot = await getDocs(groupPhotosQuery);
            groupPhotosSnapshot.forEach((gpDoc) => {
              const gpData = gpDoc.data() as Omit<GroupPhoto, 'id'>;
              groupPhotos.push({
                id: gpDoc.id,
                ...gpData
              });
            });
          }

          photoData.push({
            id: photoId,
            ...photoDoc,
            groupPhotos
          });
        }

        setPhotos(photoData);
      } catch (err) {
        console.error("Error fetching photos:", err);
        setError("Failed to load gallery data");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Authentication functions
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
      throw err;
    }
  };

  // CRUD Operations for Photos
  const addPhoto = async (photo: Omit<Photo, 'id' | 'dateAdded' | 'createdBy'>) => {
    try {
      if (!currentUser) throw new Error("Must be logged in to add photos");

      const photoData = {
        ...photo,
        dateAdded: serverTimestamp(),
        createdBy: currentUser.uid,
        color: photo.color || `hsl(${Math.random() * 360}, 70%, 75%)`,
        groupPhotoIds: []
      };

      const docRef = await addDoc(collection(db, "photos"), photoData);

      // Add group photos if any
      const groupPhotos: GroupPhoto[] = [];
      for (const groupPhoto of photo.groupPhotos) {
        const groupPhotoData = {
          caption: groupPhoto.caption,
          imageSrc: groupPhoto.imageSrc,
          color: groupPhoto.color || `hsl(${Math.random() * 360}, 70%, 75%)`,
          photoId: docRef.id,
          createdAt: serverTimestamp()
        };

        const gpDocRef = await addDoc(collection(db, "groupPhotos"), groupPhotoData);

        // Update the photo's groupPhotoIds array
        await updateDoc(docRef, {
          groupPhotoIds: [...(photoData.groupPhotoIds || []), gpDocRef.id]
        });

        groupPhotos.push({
          id: gpDocRef.id,
          ...groupPhotoData
        });
      }

      // Update local state
      setPhotos(prev => [...prev, {
        id: docRef.id,
        ...photo,
        dateAdded: new Date(),
        createdBy: currentUser.uid,
        groupPhotos
      }]);

    } catch (err) {
      console.error("Error adding photo:", err);
      throw err;
    }
  };

  const updatePhoto = async (id: string, photoData: Partial<Photo>) => {
    try {
      if (!currentUser) throw new Error("Must be logged in to update photos");

      const photoRef = doc(db, "photos", id);
      const photoDoc = await getDoc(photoRef);

      if (!photoDoc.exists()) {
        throw new Error("Photo not found");
      }

      // Don't allow direct update of groupPhotos through this method
      const { groupPhotos, id: photoId, ...updateData } = photoData;

      await updateDoc(photoRef, updateData);

      // Update local state
      setPhotos(prev =>
        prev.map(photo =>
          photo.id === id ? { ...photo, ...photoData } : photo
        )
      );

    } catch (err) {
      console.error("Error updating photo:", err);
      throw err;
    }
  };

  const deletePhoto = async (id: string) => {
    try {
      if (!currentUser) throw new Error("Must be logged in to delete photos");

      const photoRef = doc(db, "photos", id);
      const photoDoc = await getDoc(photoRef);

      if (!photoDoc.exists()) {
        throw new Error("Photo not found");
      }

      // Delete all associated group photos
      const groupPhotosQuery = query(
        collection(db, "groupPhotos"),
        where("photoId", "==", id)
      );

      const groupPhotosSnapshot = await getDocs(groupPhotosQuery);
      const deletePromises = groupPhotosSnapshot.docs.map(async (gpDoc) => {
        return deleteDoc(doc(db, "groupPhotos", gpDoc.id));
      });

      await Promise.all(deletePromises);

      // Delete the photo document
      await deleteDoc(photoRef);

      // Update local state
      setPhotos(prev => prev.filter(photo => photo.id !== id));

      if (selectedPhoto?.id === id) {
        setSelectedPhoto(null);
      }

    } catch (err) {
      console.error("Error deleting photo:", err);
      throw err;
    }
  };

  // CRUD Operations for Group Photos
  const addGroupPhoto = async (photoId: string, groupPhoto: Omit<GroupPhoto, 'id' | 'createdAt'>, file?: File) => {
    try {
      if (!currentUser) throw new Error("Must be logged in to add group photos");

      let imageSrc = groupPhoto.imageSrc;

      // If a file was provided, upload it using the Cloudinary service
      if (file) {
        const cloudinaryResponse = await uploadImage(file);
        imageSrc = cloudinaryResponse.secure_url;
      }

      const groupPhotoData = {
        caption: groupPhoto.caption,
        imageSrc,
        color: groupPhoto.color || `hsl(${Math.random() * 360}, 70%, 75%)`,
        photoId,
        createdAt: serverTimestamp()
      };

      const gpDocRef = await addDoc(collection(db, "groupPhotos"), groupPhotoData);

      // Update the photo's groupPhotoIds array
      const photoRef = doc(db, "photos", photoId);
      const photoDoc = await getDoc(photoRef);

      if (photoDoc.exists()) {
        const photoData = photoDoc.data();
        await updateDoc(photoRef, {
          groupPhotoIds: [...(photoData.groupPhotoIds || []), gpDocRef.id]
        });
      }

      // Update local state
      setPhotos(prev =>
        prev.map(photo => {
          if (photo.id === photoId) {
            return {
              ...photo,
              groupPhotos: [
                ...photo.groupPhotos,
                {
                  id: gpDocRef.id,
                  caption: groupPhoto.caption,
                  imageSrc,
                  color: groupPhoto.color || `hsl(${Math.random() * 360}, 70%, 75%)`,
                  createdAt: new Date()
                }
              ]
            };
          }
          return photo;
        })
      );

    } catch (err) {
      console.error("Error adding group photo:", err);
      throw err;
    }
  };

  const updateGroupPhoto = async (photoId: string, groupPhotoId: string, data: Partial<GroupPhoto>) => {
    try {
      if (!currentUser) throw new Error("Must be logged in to update group photos");

      const gpRef = doc(db, "groupPhotos", groupPhotoId);
      await updateDoc(gpRef, data);

      // Update local state
      setPhotos(prev =>
        prev.map(photo => {
          if (photo.id === photoId) {
            return {
              ...photo,
              groupPhotos: photo.groupPhotos.map(gp =>
                gp.id === groupPhotoId ? { ...gp, ...data } : gp
              )
            };
          }
          return photo;
        })
      );

    } catch (err) {
      console.error("Error updating group photo:", err);
      throw err;
    }
  };

  const deleteGroupPhoto = async (photoId: string, groupPhotoId: string) => {
    try {
      if (!currentUser) throw new Error("Must be logged in to delete group photos");

      const gpRef = doc(db, "groupPhotos", groupPhotoId);
      const gpDoc = await getDoc(gpRef);

      if (gpDoc.exists()) {

        await deleteDoc(gpRef);

        // Update the photo's groupPhotoIds array
        const photoRef = doc(db, "photos", photoId);
        const photoDoc = await getDoc(photoRef);

        if (photoDoc.exists()) {
          const photoData = photoDoc.data();
          await updateDoc(photoRef, {
            groupPhotoIds: (photoData.groupPhotoIds || []).filter((id: string) => id !== groupPhotoId)
          });
        }

        // Update local state
        setPhotos(prev =>
          prev.map(photo => {
            if (photo.id === photoId) {
              return {
                ...photo,
                groupPhotos: photo.groupPhotos.filter(gp => gp.id !== groupPhotoId)
              };
            }
            return photo;
          })
        );
      }

    } catch (err) {
      console.error("Error deleting group photo:", err);
      throw err;
    }
  };

  const value: GalleryContextType = {
    photos,
    loading,
    error,
    selectedPhoto,
    isAdmin,
    currentUser,
    filters,
    filteredPhotos,
    searchTerm,
    selectedCategory,
    selectedTag,
    currentPhotoIndex,
    formVisible,
    selectedGroupPhotoId,
    editingPhoto,
    setSearchTerm,
    setSelectedCategory,
    setSelectedTag,
    setSelectedPhoto,
    setCurrentPhotoIndex,
    setFormVisible,
    setEditingPhoto,
    login,
    logout,
    addPhoto,
    updatePhoto,
    deletePhoto,
    addGroupPhoto,
    updateGroupPhoto,
    deleteGroupPhoto
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};
