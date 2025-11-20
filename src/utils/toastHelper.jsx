// src/utils/toastHelper.js
import { toast } from "react-toastify";
import {
  InfoOutlined,
  CheckCircleOutline,
  ErrorOutline,
  WarningAmber,
} from "@mui/icons-material";

export const showToast = (type, message) => {
  const toastId = `${type}-toast`;

  // ========== SAFE MUI ICON WRAPPER ==========
  const wrapIcon = (IconComponent) => (
    <span style={{ display: "flex", alignItems: "center" }}>
      <IconComponent sx={{ fontSize: 22 }} />
    </span>
  );

  // ========== THEME COLORS ==========
  const COLORS = {
    success: {
      bg: "#E7F3FF",
      text: "#0D47A1",
      border: "#7bc4ff",
      progress: "#42A5F5",
      icon: () => wrapIcon(CheckCircleOutline),
    },
    error: {
      bg: "#FDECEA",
      text: "#B71C1C",
      border: "#cd7e7e",
      progress: "#e36363",
      icon: () => wrapIcon(ErrorOutline),
    },
    warning: {
      bg: "#FFF8E1",
      text: "#8B6B00",
      border: "#fbd378",
      progress: "#FFB300",
      icon: () => wrapIcon(WarningAmber),
    },
    info: {
      bg: "#E6F4EA",
      text: "#1B5E20",
      border: "#8ffb95",
      progress: "#2E7D32",
      icon: () => wrapIcon(InfoOutlined),
    },
    system: {
      bg: "#FFF8E1",
      text: "#8B6B00",
      border: "#fbd378",
      progress: "#FFB300",
      icon: () => wrapIcon(WarningAmber),
    },
    default: {
      bg: "#F5F5F5",
      text: "#333",
      border: "#90CAF9",
      progress: "#90CAF9",
      icon: () => "💬",
    },
  };

  const config = COLORS[type] || COLORS.default;

  toast.dismiss(toastId);

  toast(message, {
    toastId,
    position: "top-right",
    autoClose: 2500,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    icon: config.icon, // SAFE ICON FIXED
    style: {
      backgroundColor: config.bg,
      color: config.text,
      borderLeft: `6px solid ${config.border}`,
      borderRadius: "10px",
      padding: "12px 14px",
      fontWeight: 500,
      fontSize: "0.95rem",
      boxShadow: "0px 4px 12px rgba(0,0,0,0.10)",
    },
    progressStyle: {
      background: config.progress,
      height: "4px",
      borderRadius: "0 0 10px 10px",
    },
  });
};
