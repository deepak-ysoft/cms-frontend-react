import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const ImagePreviewModal = ({ open, onClose, imageUrl, title }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          p: 2,
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6" fontWeight={600}>
            {title || "Preview"}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          component="img"
          src={imageUrl}
          alt={title}
          sx={{
            width: "100%",
            maxHeight: "80vh",
            objectFit: "contain",
            borderRadius: 2,
          }}
        />
      </Box>
    </Modal>
  );
};

export default ImagePreviewModal;
