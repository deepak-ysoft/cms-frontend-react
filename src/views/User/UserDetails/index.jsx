import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Divider,
  CircularProgress,
  IconButton,
  Grid,
  Avatar,
  Chip,
  Paper,
} from "@mui/material";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { detailsUser } from "../../../api/userApi";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CakeIcon from "@mui/icons-material/Cake";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LayersIcon from "@mui/icons-material/Layers";
import SellIcon from "@mui/icons-material/Sell";
import { formatDateTime } from "../../../utils/formatDateTime";

function UserDetails() {
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const userId = location.search.substring(1); // remove "?"
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await detailsUser(userId);
        setUserData(response?.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchData();
  }, [userId]);

  // Normalize skills (handles both array & comma-separated string)
  const normalizeSkills = () => {
    if (!userData?.skills) return [];

    if (Array.isArray(userData?.skills)) {
      // If array contains comma-separated items, split them
      return userData?.skills.flatMap((item) =>
        typeof item === "string" ? item.split(",").map((s) => s.trim()) : []
      );
    }

    // If it's a wrong format, return empty
    return [];
  };

  const skillsList = normalizeSkills();

  const infoCards = [
    {
      label: "Phone",
      value: userData?.phone || "-",
      icon: <PhoneIphoneIcon fontSize="small" color="primary" />,
    },
    {
      label: "DOB",
      value: formatDateTime(userData?.dob) || "-",
      icon: <CakeIcon fontSize="small" color="primary" />,
    },
    {
      label: "Designation",
      value: userData?.designation || "-",
      icon: <WorkspacePremiumIcon fontSize="small" color="primary" />,
    },
    {
      label: "Experience",
      value: `${userData?.experience} Years`,
      icon: <WorkHistoryIcon fontSize="small" color="primary" />,
    },
    {
      label: "Department",
      value: userData?.department || "-",
      icon: <ApartmentIcon fontSize="small" color="primary" />,
    },
    {
      label: "Work Type",
      value: userData?.workType || "-",
      icon: <LayersIcon fontSize="small" color="primary" />,
    },
    {
      label: "Skills",
      value: skillsList.length ? (
        <Box display="flex" flexWrap="wrap" gap={1}>
          {skillsList.map((skill, idx) => (
            <Chip
              key={idx}
              label={skill}
              size="small"
              sx={{ fontWeight: 500 }}
            />
          ))}
        </Box>
      ) : (
        "-"
      ),
      icon: <SellIcon fontSize="small" color="primary" />,
    },
  ];

  if (!userData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={50} thickness={4} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 120px)",

        p: { xs: 1.5, md: 5 },
        backgroundColor: "#f9fafc",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          backgroundColor: "#fff",
          overflow: "hidden",
          boxShadow: 1,
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          p={3}
          sx={{
            background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: "#fff",
              boxShadow: 1,
              border: "1px solid #e0e0e0",
              mr: 5,
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <IoMdArrowRoundBack size={22} />
          </IconButton>

          <Typography variant="h5" fontWeight={700} color="primary.main">
            User Details
          </Typography>
        </Box>

        {/* Header
      <Box
        sx={{
          background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
          borderRadius: 2,
          p: { xs: 2, md: 3 },
        }}
      >
        <Typography variant="h5" fontWeight={700} color="primary.main">
          User Details
        </Typography>
      </Box> */}

        <Grid
          container
          spacing={3}
          sx={{
            p: { xs: 2, md: 4 },
            background: "#fff",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            mb: 4,
            m: 2,
            display: "column",
            justifyContent: { xs: "center", md: "start" },
            textAlign: { xs: "center", md: "start" },
          }}
        >
          {/* Avatar Section */}
          <Grid
            size={{ xs: 12, md: 3, lg: 1.7 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar
              src={`${userData?.profileImage || ""}`}
              sx={{
                width: 130,
                height: 130,
                border: "3px solid #e3f2fd",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
          </Grid>

          {/* Primary Details */}
          <Grid size={{ xs: 12, md: 9, lg: 10.3 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {userData?.firstName} {userData?.lastName}
            </Typography>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {userData?.email}
            </Typography>

            <Typography
              sx={{
                display: "inline-block",
                bgcolor: "primary.light",
                color: "white",
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              {userData?.role}
            </Typography>
          </Grid>
        </Grid>

        {/* Detailed Information */}
        <Box
          sx={{
            background: "#fff",
            m: 2,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.21)",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={2}
            sx={{
              p: { xs: 1, md: 2 },
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              background: "linear-gradient(90deg, #e8f0ff, #ffffff)",

              color: "primary.main",
            }}
          >
            <Box pl={3}>Personal Information</Box>
          </Typography>

          <Grid container spacing={2} sx={{ p: { xs: 2, md: 4 } }}>
            {infoCards.map((item, index) => (
              <Grid
                key={index}
                sx={{
                  width: { xs: "100%", sm: "100%", md: "48%", lg: "32%" },
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    background:
                      "linear-gradient(145deg, #f9fafc 0%, #ffffff 100%)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                    {item.icon}
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    component="div" // IMPORTANT FIX
                    sx={{
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "text.primary",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default UserDetails;
