import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../../api/authApi";
import Form from "../../../shared/components/reusableComponent/Form";
import { showToast } from "../../../utils/toastHelper";

function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams(); // ✅ Get reset token from URL

  const fields = [
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
    },
  ];

  const handleResetPassword = async (formData) => {
    setIsLoading(true);
    try {
      const res = await resetPassword(formData.password, token);
      showToast(res.isSuccess ? "success" : "error", res.message);
      if (res.isSuccess) navigate("/login");
    } catch (err) {
      showToast("error", err.message);
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
          Reset Password
        </Typography>

        <Form
          fields={fields}
          onSubmit={handleResetPassword}
          isLoading={isLoading}
          submitLabel="Reset Password"
          isFullWidth={false}
        />
      </Paper>
    </Box>
  );
  //   );
}

export default ResetPassword;
