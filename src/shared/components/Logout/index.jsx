import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grow,
  Box,
  IconButton,
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const Transition = Grow;

function LogoutDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1,
          minWidth: 320,
          boxShadow: "0 8px 28px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            gap: 1,
            pb: 0,
          }}
        >
          <LogoutRoundedIcon fontSize="small" color="error" />
          Logout
        </DialogTitle>

        <IconButton size="small" onClick={onClose} sx={{ mr: 1 }}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pb: 0.5 }}>
        <DialogContentText sx={{ fontSize: "0.9rem", opacity: 0.9 }}>
          Are you sure you want to log out?
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ textTransform: "none", borderRadius: 2, px: 2 }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          sx={{ textTransform: "none", borderRadius: 2, px: 2 }}
        >
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LogoutDialog;
