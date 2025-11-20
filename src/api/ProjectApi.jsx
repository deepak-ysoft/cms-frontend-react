// src/api/userApi.js
import API from "../utils/Interceptor"; // ✅ correct axios instance import

// ✅ Get all projects with pagination
export const getProjects = async (
  pageNumber = 1,
  rowsPerPage = 10,
  search = "",
  status = "",
  sortBy = "",
  sortOrder = "asc"
) => {
  const response = await API.get("/getProjects", {
    params: {
      page: pageNumber,
      limit: rowsPerPage,
      search: search,
      status: status,
      sortBy: sortBy,
      sortOrder: sortOrder,
    },
  });
  return response.data;
};
// ✅ Add Project API
export const addProject = async (projectData) => {
  const response = await API.post("/Project", projectData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ✅ Update Project API
export const updateProject = async (projectId, projectData) => {
  const response = await API.put(`/Project/${projectId}`, projectData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// get Project by ID API
export const getProjectById = async (projectId) => {
  const response = await API.get(`/Project/${projectId}`);
  return response.data;
};

// Delete Project API
export const deleteProject = async (projectId) => {
  const response = await API.delete(`/Project/${projectId}`);
  return response.data;
};

// Assign Developer to Project API
export const assignDeveloperToProject = async (projectId, developerIds) => {
  const response = await API.patch("/assignDeveloper", {
    projectId, // send in body
    developerIds, // send in body
  });
  return response.data;
};

// Remove Developer from Project API
export const removeDeveloperFromProject = async (projectId, developerId) => {
  const response = await API.patch("/removeDeveloper", {
    projectId, // send in body
    developerId, // send in body
  });
  return response.data;
};

// Get developer's projects
export const getDeveloperProjects = async (
  page = 1,
  limit = 10,
  search = "",
  status = "",
  orderBy = "createdAt",
  order = "desc"
) => {
  const response = await API.get("/developer-projects", {
    params: {
      page,
      limit,
      search,
      status,
      sortField: orderBy,
      sortOrder: order,
    },
  });
  return response.data;
};

export const getDeveloperProjectDetails = async (projectId) => {
  const response = await API.get(`/developer-projects/${projectId}`);
  return response.data;
};
