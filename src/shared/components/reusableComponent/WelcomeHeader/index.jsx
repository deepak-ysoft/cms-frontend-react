// src/components/WelcomeHeader.jsx
import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const WelcomeHeader = ({ user }) => {
  if (!user) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: { xs: "6px 8px", md: "8px 12px" },
        gap: 1.5,
        backgroundColor: "transparent",
      }}
    >
      <Box sx={{ textAlign: "right" }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            color: "#333",
            lineHeight: 1.2,
          }}
        >
          Welcome, {user.name}
        </Typography>

        {user.role && (
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.85rem",
              color: "text.secondary",
            }}
          >
            {user.role}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default WelcomeHeader;
