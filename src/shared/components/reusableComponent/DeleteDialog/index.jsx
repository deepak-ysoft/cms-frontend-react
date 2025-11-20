import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

function DeleteDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 3, p: 2, minWidth: 380 } }}
    >
      <Box display="flex" justifyContent="center" mb={2}>
        <WarningAmberIcon sx={{ fontSize: 60, color: "orange" }} />
      </Box>
      <DialogTitle textAlign="center">{title || "Are you sure?"}</DialogTitle>
      <DialogContent>
        <DialogContentText textAlign="center">{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Yes, delete
        </Button>
        <Button onClick={onClose} variant="outlined" color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
