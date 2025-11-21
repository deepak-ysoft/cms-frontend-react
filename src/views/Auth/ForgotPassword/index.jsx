// src/Pages/Auth/ForgotPassword.jsx
import React, { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import Form from "../../../shared/components/reusableComponent/Form";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../../api/authApi";
import { showToast } from "../../../utils/toastHelper";

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const fields = [
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
    },
  ];

  const handleForgotPassword = async (formData) => {
    setIsLoading(true);
    try {
      const res = await forgotPassword(formData);
      showToast(res.isSuccess ? "success" : "error", res.message);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#f5f6fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
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
          Forgot Password
        </Typography>

        <Form
          fields={fields}
          onSubmit={handleForgotPassword}
          isLoading={isLoading}
          submitLabel="Send Reset Link"
          isFullWidth={false}
        />

        <Typography
          variant="body2"
          align="start"
          sx={{ mb: 2, ml: { xs: 2, md: 0 } }}
        >
          Remember your password?{" "}
          <Link to="/login" style={{ color: "#1976d2", fontWeight: 600 }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default ForgotPassword;
