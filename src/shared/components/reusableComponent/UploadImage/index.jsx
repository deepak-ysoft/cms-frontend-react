import React, { useState, useEffect } from "react";
import { Box, Avatar, IconButton, Tooltip } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import { Image_BASE_URL } from "../../../../api/config";

function UploadImage({
  formData,
  selectedImage,
  onImageSelect,
  isDeletable = false,
  onDelete = () => {},
}) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Show selected image preview
    if (selectedImage instanceof File) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    // Show existing image
    if (formData?.profileImage) {
      setPreview(`${Image_BASE_URL}${formData?.profileImage}`);
    }
  }, [selectedImage, formData]);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onImageSelect(file);
  };

  return (
    <Box textAlign="center">
      <Avatar
        src={preview}
        sx={{ width: 140, height: 140, margin: "auto", position: "relative" }}
      />

      <Box display="flex" justifyContent="center" gap={2} mt={1}>
        {/* Upload icon */}
        <Tooltip title="Upload Image">
          <IconButton component="label">
            <PhotoCameraIcon fontSize="medium" />
            <input type="file" hidden onChange={handleChange} />
          </IconButton>
        </Tooltip>

        {/* Delete icon (conditional) */}
        {isDeletable && (
          <Tooltip title="Delete Image">
            <IconButton color="error" onClick={onDelete}>
              <DeleteIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}

export default UploadImage;
