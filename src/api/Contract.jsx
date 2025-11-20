import API from "../utils/Interceptor"; // ✅ your axios instance

//
// 🔹 Add a new contract
//
export const addContract = async (formData) => {
  const response = await API.post("/contracts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

//
// 🔹 Update an existing contract
//
export const updateContract = async (id, formData) => {
  const response = await API.put(`/contracts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

//
// 🔹 Get all contracts with pagination, search, and sorting
//
export const getAllContracts = async (
  pageNumber = 1,
  rowsPerPage = 10,
  search = "",
  status = "",
  sortBy = "createdAt",
  order = "desc"
) => {
  const response = await API.get("/contracts", {
    params: {
      page: pageNumber,
      limit: rowsPerPage,
      search,
      status,
      sortBy,
      sortOrder: order, // ✅ backend expects `order`
    },
  });

  // ✅ return both data and pagination
  return {
    contracts: response.data?.data?.data || [],
    pagination: response.data?.data?.pagination || {},
  };
};

//
// 🔹 Get contract by project ID
//
export const getContractByProject = async (projectId) => {
  const response = await API.get(`/contracts/project/${projectId}`);
  return response.data || null;
};

//
// 🔹 Get contract by ID
//
export const getContractById = async (id) => {
  const response = await API.get(`/contracts/details/${id}`);
  return response.data;
};

//
// 🔹 Soft delete a contract
//
export const deleteContract = async (id) => {
  const response = await API.delete(`/contracts/${id}`);
  return response.data;
};
