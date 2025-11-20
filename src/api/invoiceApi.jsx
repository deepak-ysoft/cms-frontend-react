import API from "../utils/Interceptor";

// GET invoices with pagination, search, sorting
export const getInvoices = async (
  page = 1,
  limit = 10,
  search = "",
  status = "",
  sortField = "createdAt",
  sortOrder = "desc"
) => {
  const response = await API.get("/invoice/getAllInvoices", {
    params: { page, limit, search, status, sortField, sortOrder },
  });
  return response.data;
};

// ✅ Add new invoice
export const addInvoice = async (invoiceData) => {
  const response = await API.post("/invoice/addInvoice", invoiceData);
  return response.data;
};

// ✅ Update invoice
export const updateInvoice = async (id, invoiceData) => {
  const response = await API.put(`/invoice/updateInvoice/${id}`, invoiceData);
  return response.data;
};

// ✅ Get invoices by project
export const getInvoicesByProject = async (
  projectId,
  page = 1,
  limit = 10,
  search = "",
  status = "",
  sortBy = "createdAt",
  sortOrder = "desc"
) => {
  const response = await API.get(`/invoice/getInvoiceByProjectId`, {
    params: { projectId, page, limit, search, status, sortBy, sortOrder },
  });
  return response.data;
};

// ✅ Delete invoice
export const deleteInvoice = async (id) => {
  const response = await API.delete(`/invoice/deleteInvoice/${id}`);
  return response.data;
};

// ✅ Get invoice by ID
export const getInvoiceById = async (id) => {
  const response = await API.get(`/invoice/getInvoiceById/${id}`);
  return response.data;
};

export const handleGeneratePDF = (id) => {
  window.open(
    `${import.meta.env.VITE_API_BASE_URL}/invoice/pdf/${id}`,
    "_blank"
  );
};

export const handleGenerateDOCX = (id) => {
  window.open(
    `${import.meta.env.VITE_API_BASE_URL}/invoice/docx/${id}`,
    "_blank"
  );
};
