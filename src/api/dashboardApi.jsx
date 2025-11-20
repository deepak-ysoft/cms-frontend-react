import API from "../utils/Interceptor";

// ✅ Get Admin Dashboard
export const getAdminDashboard = async () => {
  const response = await API.get(`/admin/`);
  return response.data;
};

// ✅ Get Developer Dashboard
export const getDeveloperDashboard = async () => {
  const response = await API.get(`/admin/developerDashboard/`);
  return response.data;
};
