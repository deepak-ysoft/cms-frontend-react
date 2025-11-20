// src/Pages/Auth/Register.jsx
import React, { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { createUser } from "../../../api/authApi";
import { showToast } from "../../../utils/toastHelper";
import Form from "../../../shared/components/reusableComponent/Form";
import { Link, useNavigate } from "react-router-dom";
import { sendNotificationHelper } from "../../../utils/sendNotificationHelper";

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fields = [
    {
      name: "firstName",
      label: "First Name",
      required: true,
      rules: {
        minLength: {
          value: 2,
          message: "First name must be at least 2 characters",
        },
        pattern: {
          value: /^[A-Za-z\s]+$/,
          message: "Only alphabets allowed",
        },
      },
    },
    {
      name: "lastName",
      label: "Last Name",
      required: true,
      rules: {
        minLength: {
          value: 2,
          message: "Last name must be at least 2 characters",
        },
        pattern: {
          value: /^[A-Za-z\s]+$/,
          message: "Only alphabets allowed",
        },
      },
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      rules: {
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Enter a valid email",
        },
      },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      rules: {
        minLength: { value: 6, message: "Minimum 6 characters required" },
        pattern: {
          value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
          message: "Password must contain letters and numbers",
        },
      },
    },
    {
      name: "cnfpassword",
      label: "Confirm Password",
      type: "password",
      required: true,
    },
  ];

  const handleSubmit = async (data) => {
    if (data.password !== data.cnfpassword) {
      showToast("error", "Passwords do not match!");
      return;
    }

    const { ...payload } = data;

    setLoading(true);
    try {
      const res = await createUser(payload);
      showToast(res.isSuccess ? "success" : "error", res.message);
      if (res.isSuccess) {
        let payload = {
          title: "New Developer Successfully Added to the Team",
          message: `A new developer has been successfully added to the team. 
          The developer, ${res.data?.firstName} ${res.data?.lastName}, will be working as a ${res.data?.workType} ${res.data?.department} Developer. 
          Please review the new profile and ensure that all required onboarding information, access permissions, and initial tasks are updated accordingly.`,
          type: "success",
          sendTo: "admin",
          senderId: res.data,
          meta: {},
        };
        await sendNotificationHelper({ user: res.data, formData: payload });

        navigate("/login");
      }
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Failed to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#f5f6fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 1, md: 2 },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: "100%", sm: 450 },
          px: { md: 2 },
          py: { xs: 4 },
          borderRadius: 3,
          bgcolor: "#fff",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight={700}
          sx={{ mb: 3, color: "#1976d2" }}
        >
          Create Account
        </Typography>

        <Form
          fields={fields}
          onSubmit={handleSubmit}
          isLoading={loading}
          submitLabel="Register"
          isFullWidth={false}
        />

        <Typography
          variant="body2"
          align="start"
          sx={{ mb: 2, ml: { xs: 2, md: 0 } }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#1976d2", fontWeight: 600 }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;
