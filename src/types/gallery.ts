import { User } from "firebase/auth";

// Types
export interface GroupPhoto {
  id: string;
  caption: string;
  imageSrc: string;
  color?: string;
  createdAt?: any;
}

export interface Photo {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  group: string;
  groupPhotos: GroupPhoto[];
  dateAdded: any;
  color?: string;
  createdBy?: string;
}

export interface GalleryContextType {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  selectedPhoto: Photo | null;
  isAdmin: boolean;
  currentUser: User | null;
  filters: {
    categories: string[];
    tags: string[];
  };
  filteredPhotos: Photo[];
  searchTerm: string;
  selectedCategory: string;
  selectedTag: string;
  currentPhotoIndex: number;
  formVisible: boolean;
  selectedGroupPhotoId: string | null;
  editingPhoto: Photo | null;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedTag: (tag: string) => void;
  setSelectedPhoto: (photo: Photo | null) => void;
  setCurrentPhotoIndex: (index: number | ((prev: number) => number)) => void;
  setFormVisible: (visible: boolean) => void;
  setEditingPhoto: (photo: Photo | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  addPhoto: (photo: Omit<Photo, 'id' | 'dateAdded' | 'createdBy'>) => Promise<void>;
  updatePhoto: (id: string, photoData: Partial<Photo>) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  addGroupPhoto: (photoId: string, groupPhoto: Omit<GroupPhoto, 'id' | 'createdAt'>, file?: File) => Promise<void>;
  updateGroupPhoto: (photoId: string, groupPhotoId: string, data: Partial<GroupPhoto>) => Promise<void>;
  deleteGroupPhoto: (photoId: string, groupPhotoId: string) => Promise<void>;
}
