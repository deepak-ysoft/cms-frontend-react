// src/Pages/Auth/Login.jsx
import React, { useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../../api/authApi";
import { showToast } from "../../../utils/toastHelper";
import Form from "../../../shared/components/reusableComponent/Form";
import { jwtDecode } from "jwt-decode";

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Saved from rememberMe
  const savedEmail = localStorage.getItem("savedEmail") || "";
  const savedPassword = localStorage.getItem("savedPassword") || "";
  const savedRemember = localStorage.getItem("rememberMe") === "true";

  // Auto redirect if already logged in and token is valid
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          // Token expired
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          return;
        }

        // Token valid → Redirect to dashboard
        if (role === "Admin" || role === "Project Manager") {
          navigate("/adminDashboard", { replace: true });
        } else {
          navigate("/developerDashboard", { replace: true });
        }
      } catch (error) {
        showToast("error", error.message);
        // Invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
    }
  }, [navigate]);

  // Form fields
  const fields = [
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      defaultValue: savedEmail || "admin@yopmail.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      defaultValue: savedPassword || "Admin@1234",
    },
    {
      name: "rememberMe",
      label: "Remember Me",
      type: "checkbox",
      defaultValue: savedRemember,
    },
  ];

  // Handle Login
  const handleSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await loginUser(data);
      const token = response?.data?.token;
      const role = response?.data?.user?.role;

      if (token && role) {
        // Save auth data
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        // Save remember me data
        if (data.rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("savedEmail", data.email);
          localStorage.setItem("savedPassword", data.password);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("savedPassword");
        }

        // Redirect user
        if (role === "Admin" || role === "Project Manager") {
          navigate("/adminDashboard");
        } else {
          navigate("/developerDashboard");
        }
      } else {
        showToast("error", "Invalid credentials. Please try again.");
      }
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
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
          Welcome Back
        </Typography>

        <Typography
          variant="body2"
          align="center"
          sx={{ mb: 4, color: "text.secondary" }}
        >
          Login to your account
        </Typography>

        {/* Reusable Form Component */}
        <Form
          fields={fields}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel="Login"
          isFullWidth={false}
        />

        <Typography variant="body2" align="start" sx={{ ml: { xs: 2, md: 0 } }}>
          <Link to="/forgotPassword" style={{ color: "#1976d2" }}>
            Forgot Password?
          </Link>
        </Typography>

        <Typography
          variant="body2"
          align="start"
          sx={{ mb: 2, ml: { xs: 2, md: 0 } }}
        >
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#1976d2", fontWeight: 600 }}>
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
