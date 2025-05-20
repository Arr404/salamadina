'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton
} from '@mui/material';
import { Upload as Upload } from 'lucide-react';
import { fetchCloudinaryImages } from '@/services/cloudinaryImage';
import { uploadImage } from '@/services/cloudinary'

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  [key: string]: any;
}

export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
}

export interface ImageSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (image: CloudinaryImage) => void;
}

export const ImageSelectionModal: React.FC<ImageSelectionModalProps> = ({ open, onClose, onSelect }) => {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<CloudinaryImage | null>(null);

  // Fetch images when modal opens
  useEffect(() => {
    if (open) {
      fetchCloudinaryImages().then((imgs) => {
        setImages(imgs);
      });
    }
  }, [open]);

  // Handle uploading a new image
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const uploadResult = await uploadImage(file);
      setImages(prevImages => [uploadResult, ...prevImages]);
    }
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Select an Image</DialogTitle>
      <DialogContent>
        {/* Upload Button */}
        <Box component="div" display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<Upload />}
            sx={{
              borderRadius: 2,
              padding: '10px 20px',
              textTransform: 'none',
            }}
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
        </Box>
        {/* Image Grid */}
        <Grid container spacing={2}>
          {images.map((image) => (
            <Grid item xs={4} key={image.public_id}>
              <Box component="div" position="relative">
                <Box
                  component="img"
                  src={image.secure_url}
                  alt={image.public_id}
                  sx={{
                    width: '100%',
                    height: 120,
                    objectFit: 'cover',
                    border: selectedImage?.public_id === image.public_id ? '2px solid blue' : 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedImage(image)}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button
          onClick={() => {
            if (selectedImage) {
              onSelect(selectedImage);
              onClose();
            }
          }}
          variant="contained"
          disabled={!selectedImage}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
