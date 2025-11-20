import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
  Button,
  Divider,
  CircularProgress,
  Grid,
  Paper,
  Chip,
} from "@mui/material";
import { userProfile, updateUser, deleteUserImg } from "../../../api/userApi";
import { Image_BASE_URL } from "../../../api/config";
import Form from "../../../shared/components/reusableComponent/Form";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CakeIcon from "@mui/icons-material/Cake";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LayersIcon from "@mui/icons-material/Layers";
import SellIcon from "@mui/icons-material/Sell";
import UploadImage from "../../../shared/components/reusableComponent/UploadImage";
import { showToast } from "../../../utils/toastHelper";
import UserContext from "../../../shared/context/UserContext";
import { formatDateTime } from "../../../utils/formatDateTime";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const role = localStorage.getItem("role");
  const { setUser } = useContext(UserContext);

  const fetchProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const data = await userProfile();
      setProfile(data?.data);
      setUser(data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // update selectedImage when profile loads
  useEffect(() => {
    if (profile?.profileImage) {
      setSelectedImage(`${Image_BASE_URL}${profile?.profileImage}`);
    }
  }, [profile]);
  if (profileLoading)
    return (
      <Box display="flex" justifyContent="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );

  if (!profile)
    return (
      <Typography align="center" color="error" mt={5}>
        Failed to load profile
      </Typography>
    );

  // ---------------------- FORM FIELDS FOR EDIT MODE -----------------------
  const fields = [
    {
      name: "firstName",
      label: "First Name",
      defaultValue: profile?.firstName,
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      defaultValue: profile?.lastName,
      required: true,
    },
    {
      name: "email",
      label: "Email",
      defaultValue: profile?.email,
      required: true,
      type: "email",
    },
    ...(role === "Admin"
      ? [
          {
            name: "role",
            label: "Role",
            type: "select",
            defaultValue: profile?.role,
            options: [
              { label: "Admin", value: "Admin" },
              { label: "Project Manager", value: "Project Manager" },
              { label: "Developer", value: "Developer" },
            ],
            required: true,
          },
        ]
      : []),
    { name: "phone", label: "Phone Number", defaultValue: profile?.phone },
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
      defaultValue: profile?.dob?.substring(0, 10),
    },
    {
      name: "designation",
      label: "Designation",
      defaultValue: profile?.designation,
    },
    {
      name: "experience",
      label: "Experience (Years)",
      type: "number",
      defaultValue: profile?.experience,
    },
    {
      name: "department",
      label: "Department",
      defaultValue: profile?.department,
    },
    {
      name: "workType",
      label: "Work Type",
      type: "select",
      defaultValue: profile?.workType,
      options: [
        { label: "Full-Time", value: "Full-Time" },
        { label: "Part-Time", value: "Part-Time" },
        { label: "Contract", value: "Contract" },
        { label: "Intern", value: "Intern" },
      ],
    },
    {
      name: "skills",
      label: "Skills (comma separated)",
      defaultValue: profile?.skills?.join(", "),
      type: "textarea",
      minRows: 2,
    },
  ];

  // ---------------------- SAVE PROFILE -----------------------
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "skills") {
          form.append(
            "skills",
            value.split(",").map((s) => s.trim())
          );
        } else {
          form.append(key, value);
        }
      });

      if (selectedImage instanceof File)
        form.append("profileImage", selectedImage);

      const updated = await updateUser(profile?._id, form);
      if (!updated.isSuccess) {
        showToast("error", updated.message);
      } else {
        
        setEditMode(false);
        fetchProfile();
      }
    } catch (error) {
      console.error("Update error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImgDelete = async (id) => {
    try {
      const res = await deleteUserImg(id);
      if (!res.isSuccess) {
        showToast("error", res.message);
      }
      fetchProfile();
    } catch (error) {
      console.error("Update error", error);
    }
  };

  // Normalize skills (handles both array & comma-separated string)
  const normalizeSkills = () => {
    if (!profile?.skills) return [];

    if (Array.isArray(profile?.skills)) {
      // If array contains comma-separated items, split them
      return profile?.skills.flatMap((item) =>
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
      value: profile?.phone || "-",
      icon: <PhoneIphoneIcon fontSize="small" color="primary" />,
    },
    {
      label: "DOB",
      value: formatDateTime(profile?.dob) || "-",
      icon: <CakeIcon fontSize="small" color="primary" />,
    },
    {
      label: "Designation",
      value: profile?.designation || "-",
      icon: <WorkspacePremiumIcon fontSize="small" color="primary" />,
    },
    {
      label: "Experience",
      value: `${profile?.experience} Years`,
      icon: <WorkHistoryIcon fontSize="small" color="primary" />,
    },
    {
      label: "Department",
      value: profile?.department || "-",
      icon: <ApartmentIcon fontSize="small" color="primary" />,
    },
    {
      label: "Work Type",
      value: profile?.workType || "-",
      icon: <LayersIcon fontSize="small" color="primary" />,
    },
    {
      label: "Skills",
      value: skillsList.length ? (
        <Box variant="body" display="flex" flexWrap="wrap" gap={1}>
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

  return (
    <Box sx={{ p: { xs: 1, md: 5 } }}>
      <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
        {!editMode && (
          <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
            {/* Header */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
                borderRadius: 2,
                p: { xs: 2, md: 3 },
                mb: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <Typography variant="h5" fontWeight={700} color="primary.main">
                User Profile
              </Typography>
            </Box>

            <Grid
              container
              spacing={3}
              sx={{
                p: { xs: 2, md: 4 },
                background: "#fff",
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                mb: 4,
                display: "flex",
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
                  src={`${Image_BASE_URL}${profile?.profileImage || ""}`}
                  sx={{
                    width: 130,
                    height: 130,
                    border: "3px solid #e3f2fd",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </Grid>

              {/* Primary Details */}
              <Grid size={{ xs: 12, md: 5, lg: 6.3 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {profile?.firstName} {profile?.lastName}
                </Typography>

                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {profile?.email}
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
                  {profile?.role}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4, lg: 4 }}>
                {/* Button */}
                <Box display="flex" justifyContent="end" alignItems="end">
                  <Button
                    variant="contained"
                    sx={{
                      height: 42,
                      fontSize: "0.95rem",
                      textTransform: "none",
                      borderRadius: 2,
                      backgroundColor: "#00BCD4",
                      "&:hover": { backgroundColor: "#0097A7" },
                      px: 4,
                    }}
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {/* Detailed Information */}
            <Box
              sx={{
                background: "#fff",
                p: { xs: 2, md: 4 },
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={2}>
                Personal Information
              </Typography>

              <Grid container spacing={2}>
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
                        component="span" // IMPORTANT FIX
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
          </Box>
        )}

        {/* ---------------------- EDIT MODE ---------------------- */}
        {editMode && (
          <Grid container sx={{ p: { xs: 1, md: 4 } }}>
            <Grid
              sx={{
                width: { xs: "100%", lg: "20%" },
                display: "flex",
                justifyContent: "center",
                p: { xs: 1, md: 5 },
              }}
            >
              <UploadImage
                formData={profile}
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
                onDelete={() => handleImgDelete(profile?._id)}
                isDeletable={profile?.profileImage ? true : false}
              />
            </Grid>
            <Grid
              sx={{
                width: { xs: "100%", lg: "80%" },
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Form
                fields={fields}
                onSubmit={handleSubmit}
                onCancel={() => setEditMode(false)}
                isLoading={loading}
                isFormLoading={profileLoading}
                submitLabel="Save Changes"
              />
            </Grid>
          </Grid>
        )}
      </Card>
    </Box>
  );
}

export default Profile;
