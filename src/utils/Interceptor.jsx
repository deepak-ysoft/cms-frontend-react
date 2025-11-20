// src/utils/api.js
import axios from "axios";
import config from "../api/config";

const API = axios.create({
  baseURL: config.BASE_URL,
});

// Request interceptor → Attach token
API.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → Handle 401 & 403 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) return Promise.reject(error);

    const status = error.response.status;

    if (status === 401 || status === 403) {
      console.warn("Token expired or unauthorized. Redirecting to login...");

      // Clear only auth data
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // Optional: keep saved email/password for rememberMe UI
      // DO NOT clear savedEmail, savedPassword, rememberMe

      window.location.href = "/login"; // force redirect
    }

    return Promise.reject(error);
  }
);

export default API;
