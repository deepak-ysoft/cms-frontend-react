// src/api/userApi.js
import API from "../utils/Interceptor"; // ✅ correct axios instance import

// ✅ Get all users with pagination + search
export const getUsers = async (
  pageNumber = 1,
  rowsPerPage = 10,
  search = "",
  role = "",
  sortBy = "",
  sortOrder = "asc"
) => {
  const response = await API.get("/admin/getUsers", {
    params: {
      page: pageNumber,
      limit: rowsPerPage,
      search: search,
      role: role,
      sortBy: sortBy,
      sortOrder: sortOrder,
    },
  });

  // ✅ Adjust according to API response structure
  return response.data?.data || [];
};

// 🔹 Search developers by email (autocomplete)
export const searchDevelopers = async (query) => {
  const res = await API.get(`/admin/searchDevelopers?q=${query}`);
  return res.data.developers;
};

// ✅ Get user profile data
export const userProfile = async () => {
  const response = await API.get("/getProfileData");
  return response.data;
};

// src/api/userApi.js
export const addUser = async (userData) => {
  const response = await API.post(`/admin/createUser`, userData);
  return response.data;
};

// src/api/userApi.js
export const updateUser = async (id, userData) => {
  const response = await API.put(`/admin/update/${id}`, userData);
  return response.data;
};

// src/api/userApi.js
export const deleteUser = async (id) => {
  const response = await API.delete(`/admin/delete/${id}`);
  return response.data;
};

// src/api/userApi.js
export const deleteUserImg = async (id) => {
  const response = await API.delete(`/admin/deleteImg/${id}`);
  return response.data;
};

// src/api/userApi.js
export const detailsUser = async (id) => {
  const response = await API.get(`/admin/getuserById/${id}`);
  return response.data;
};
