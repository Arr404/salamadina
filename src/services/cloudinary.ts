import axios from "axios";

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  [key: string]: any;
}

// Helper to parse Cloudinary URL to extract cloud name
const extractCloudName = (cloudinaryUrl: string): string => {
  try {
    const matches = cloudinaryUrl.match(/@([^/]+)$/);
    if (matches && matches[1]) {
      return matches[1];
    }
    throw new Error("Invalid Cloudinary URL format");
  } catch (error) {
    console.error("Failed to extract cloud name from Cloudinary URL:", error);
    throw new Error("Invalid Cloudinary configuration");
  }
};

export const uploadImage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResponse> => {
  if (!file) throw new Error("No file provided for upload.");

  const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!CLOUDINARY_URL || !UPLOAD_PRESET) {
    throw new Error("Cloudinary configuration is missing.");
  }

  try {
    // Extract cloud name from the full Cloudinary URL
    const CLOUD_NAME = extractCloudName(CLOUDINARY_URL);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percent = (progressEvent.loaded / progressEvent.total) * 100;
            onProgress(percent);
          }
        },
      }
    );

    const data: CloudinaryUploadResponse = response.data;

    if (!data.secure_url || !data.public_id) {
      throw new Error("Incomplete Cloudinary response");
    }

    return data;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
};
