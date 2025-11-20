import axios from "axios";
import config from "./config";

export const loginUser = async (credentials) => {
  const response = await axios.post(
    `${config.BASE_URL}/auth/login`,
    credentials
  );
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await axios.post(
    `${config.BASE_URL}/auth/forgot-password`,
    data
  );
  return response.data;
};

export const resetPassword = async (password, token) => {
  const response = await axios.post(
    `${config.BASE_URL}/auth/reset-password/${token}`,
    { password }
  );
  return response.data;
};

export const createUser = async (userData) => {
  const res = await axios.post(`${config.BASE_URL}/auth/register`, userData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
