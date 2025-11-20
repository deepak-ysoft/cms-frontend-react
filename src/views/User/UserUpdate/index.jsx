import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Box,
  Grid,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  updateUser,
  detailsUser,
  addUser,
  deleteUserImg,
} from "../../../api/userApi";
import { showToast } from "../../../utils/toastHelper";
import Form from "../../../shared/components/reusableComponent/Form";
import UploadImage from "../../../shared/components/reusableComponent/UploadImage";
import { sendNotificationHelper } from "../../../utils/sendNotificationHelper";
import UserContext from "../../../shared/context/UserContext";

function UserUpdate({ mode = "create" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.search.substring(1);
  const role = localStorage.getItem("role");
  const isEdit = mode === "edit" || false;
  const [loading, setLoading] = useState(false);
  const [isFormLoading, setFormLoading] = useState(false);

  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (isEdit) {
      fetch();
    }
  }, [userId]);

  const fetch = async () => {
    setFormLoading(true);
    try {
      const res = await detailsUser(userId);
      setUserData(res.data);
      setSelectedImage(res?.data?.profileImage);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    if (!isEdit) {
      // for Add User, set empty default data
      setUserData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        designation: "",
        experience: "",
        department: "Frontend",
        workType: "Full-Time",
        skills: "",
        role: "Developer",
        profileImage: "",
      });
    }
  }, [isEdit]);

  const handleImgDelete = async (id) => {
    try {
      const res = await deleteUserImg(id);
      showToast(res.isSuccess ? "success" : "error", res.message);
      fetch();
    } catch (error) {
      console.error("Update error", error);
    }
  };

  if (isEdit && !userData)
    return (
      <Box display="flex" justifyContent="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );

  const fields = [
    {
      name: "firstName",
      label: "First Name",
      defaultValue: userData?.firstName,
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      defaultValue: userData?.lastName,
      required: true,
    },
    {
      name: "email",
      label: "Email",
      defaultValue: userData?.email,
      type: "email",
      required: true,
      rules: {
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email format",
        },
      },
    },
    ...(role === "Admin" && !isEdit
      ? [
          {
            name: "password",
            label: "Password",
            type: "password",
            required: true,
            rules: {
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must contain uppercase, lowercase, number and special character",
              },
            },
          },
        ]
      : []),
    ...(role == "Admin"
      ? [
          {
            name: "role",
            label: "Role",
            type: "select",
            defaultValue: userData?.role ?? "Developer",
            options: [
              { label: "Admin", value: "Admin" },
              { label: "Project Manager", value: "Project Manager" },
              { label: "Developer", value: "Developer" },
            ],
            required: true,
          },
        ]
      : []),
    {
      name: "phone",
      label: "Phone",
      defaultValue: userData?.phone,
      required: true,
      rules: {
        pattern: {
          value: /^[0-9]+$/, // only digits
          message: "Phone number must contain only numbers",
        },
        minLength: {
          value: 10,
          message: "Phone number must be at least 10 digits",
        },
        maxLength: {
          value: 10,
          message: "Phone number must not exceed 10 digits",
        },
      },
    },
    {
      name: "dob",
      type: "date",
      label: "DOB",
      defaultValue: userData?.dob?.substring(0, 10),
    },
    {
      name: "designation",
      label: "Designation",
      defaultValue: userData?.designation,
    },
    {
      name: "experience",
      label: "Experience",
      type: "number",
      defaultValue: userData?.experience,
    },
    {
      name: "department",
      label: "Department",
      type: "select",
      defaultValue: userData?.department ?? "Frontend",
      options: [
        { label: "Frontend", value: "Frontend" },
        { label: "Backend", value: "Backend" },
        { label: "Fullstack", value: "Fullstack" },
        { label: "Mobile", value: "Mobile" },
        { label: "UI/UX", value: "UI/UX" },
        { label: "DevOps", value: "DevOps" },
        { label: "QA", value: "QA" },
      ],
      required: role === "Developer", // only required for Developer
    },
    {
      name: "workType",
      label: "Work Type",
      type: "select",
      defaultValue: userData?.workType ?? "Full-Time",
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
      type: "textarea",
      defaultValue: userData?.skills ? userData?.skills?.join(", ") : "",
    },
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        form.append(key, value);
      });

      if (selectedImage instanceof File)
        form.append("profileImage", selectedImage);

      const res = isEdit ? await updateUser(userId, form) : await addUser(form);

      if (res.isSuccess) {
        let payload = {
          title: "Your Profile Has Been Successfully Updated by Admin",
          message: `Your profile has been successfully updated by the administrator. 
                The changes include updates to your personal or professional information such as name, department, work type, or other important details.
                 Please review your updated profile to ensure all information is correct, and notify the admin if any adjustments are needed.`,
          type: "info",
          sendTo: "specific",
          senderId: user._id,
          email: res.data?.email,
          meta: {},
        };

        await sendNotificationHelper({ user: user, formData: payload });
        showToast("success", res.message);
        navigate("/userList");
      } else {
        showToast("error", res.message);
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={5}>
      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <Box
          display="flex"
          alignItems="center"
          sx={{
            p: { xs: 1, md: 3 },
            background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
            pl: { xs: 3 },
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: "#fff",
              boxShadow: 1,
              border: "1px solid #e0e0e0",
              mr: 3,
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <IoMdArrowRoundBack size={22} />
          </IconButton>
          <Typography variant="h5" fontWeight={700} color="primary">
            {isEdit ? "Update User" : "Add User"}
          </Typography>
        </Box>

        <Divider />

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
              formData={userData}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
              onDelete={() => handleImgDelete(userData._id)}
              isDeletable={userData?.profileImage ? true : false}
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
              isLoading={loading}
              isFormLoading={isFormLoading}
              submitLabel="Update"
              onCancel={() => navigate(-1)}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default UserUpdate;
