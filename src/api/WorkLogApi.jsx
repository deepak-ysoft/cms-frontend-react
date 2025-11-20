import API from "../utils/Interceptor";

// ✅ Get Work Logs by Project ID with pagination, sorting & search
export const getWorkLogs = async (
  projectId,
  page = 1,
  limit = 10,
  search = "",
  status = "",
  sortField = "createdAt",
  sortOrder = "desc"
) => {
  const response = await API.get(`/worklog/${projectId}`, {
    params: {
      page,
      limit,
      search: search || undefined,
      status,
      sortField,
      sortOrder,
    },
  });

  // ✅ Backend returns: { success, message, data: { total, data: [...] } }
  return response.data?.data || { total: 0, data: [] };
};

// ✅ Get Work Logs by Project ID with pagination, sorting & search
export const getWorkLogsByDeveloper = async (
  projectId,
  developerId,
  page = 1,
  limit = 10,
  search = "",
  status = "",
  sortField = "createdAt",
  sortOrder = "desc"
) => {
  const response = await API.get(
    `/worklog/devloperlog/${projectId}/${developerId}`,
    {
      params: {
        page,
        limit,
        search: search || undefined,
        status,
        sortField,
        sortOrder,
      },
    }
  );

  // ✅ Backend returns: { success, message, data: { total, data: [...] } }
  return response.data?.data || { total: 0, data: [] };
};

// ✅ Add (Submit) Work Log
export const submitWorkLog = async (worklogData) => {
  const response = await API.post("/worklog", worklogData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ✅ Get Single Work Log by ID (for details view)
export const getWorkLogById = async (workLogId) => {
  const response = await API.get(`/worklog/details/${workLogId}`);
  return response.data?.data;
};

// ✅ Update Work Log (edit)
export const updateWorkLog = async (workLogId, updateData) => {
  const response = await API.put(`/worklog/${workLogId}`, updateData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ✅ Soft Delete Work Log
export const deleteWorkLog = async (workLogId) => {
  const response = await API.delete(`/worklog/${workLogId}`);
  return response.data;
};
