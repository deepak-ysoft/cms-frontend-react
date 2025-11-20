import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FaEdit, FaEye } from "react-icons/fa";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import Search from "../../../../../shared/components/reusableComponent/Search";
import ReusableTable from "../../../../../shared/components/reusableComponent/Table";
import DeleteDialog from "../../../../../shared/components/reusableComponent/DeleteDialog";
import SortHeader from "../../../../../shared/components/reusableComponent/SortHeader";
import CustomPagination from "../../../../../shared/components/reusableComponent/Pagination";
import {
  deleteInvoice,
  getInvoicesByProject,
} from "../../../../../api/invoiceApi";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../../../../../utils/formatDateTime";
import { showToast } from "../../../../../utils/toastHelper";

export default function InvoiceList({ projectId }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const role = localStorage.getItem("role");

  // Data
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const pageCount = Math.ceil(total / limit);

  // Search & Sorting
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 700);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (projectId) fetchInvoices();
  }, [projectId, page, limit, debouncedSearch, status, sortField, sortOrder]);

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const res = await getInvoicesByProject(
        projectId,
        page,
        limit,
        debouncedSearch,
        status,
        sortField,
        sortOrder
      );

      setRows(res?.data?.rows || []);
      setTotal(res?.data?.total || 0);
    } catch (error) {
      console.error("Error fetching invoices", error);
    } finally {
      setLoading(false);
    }
  };

  // handle sorting
  const handleSort = (property, newOrder) => {
    setSortField(property);
    setSortOrder(newOrder);
    setPage(1);
  };

  // Delete
  const confirmDelete = async () => {
    try {
      await deleteInvoice(invoiceToDelete?._id);
      showToast("success", "Invoice deleted successfully!");
      fetchInvoices();
    } catch {
      showToast("error", "Delete failed!");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const getStatusChip = (status) => {
    const colors = {
      Paid: "success",
      Pending: "warning",
      Overdue: "error",
    };

    return (
      <Chip
        label={status}
        size="small"
        variant="outlined"
        color={colors[status] || "default"}
      />
    );
  };

  const columns = isSmall
    ? [
        {
          label: (
            <SortHeader
              columnKey="invoiceNumber"
              label="Invoice No"
              orderBy={sortField}
              order={sortOrder}
              onSort={handleSort}
            />
          ),
          field: "invoiceNumber",
          sortable: true,
        },
        {
          label: "Actions",
          render: (row) => (
            <Stack direction="row" spacing={1}>
              <IconButton
                title="View"
                color="primary"
                onClick={() =>
                  navigate(
                    `/projects/ProjectDetails/${projectId}/invocies/invoiceDetails/${row._id}`
                  )
                }
              >
                <FaEye size={18} />
              </IconButton>
              {role === "Admin" && (
                <>
                  <IconButton
                    title="Edit"
                    color="secondary"
                    onClick={() =>
                      navigate(
                        `/projects/ProjectDetails/${projectId}/invocies/updateInvoice/edit/${row._id}`
                      )
                    }
                  >
                    <FaEdit size={18} />
                  </IconButton>
                  <IconButton
                    title="Delete"
                    color="error"
                    onClick={() => {
                      setInvoiceToDelete(row);
                      setOpenDeleteDialog(true);
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </>
              )}
            </Stack>
          ),
        },
      ]
    : [
        {
          label: (
            <SortHeader
              columnKey="invoiceNumber"
              label="Invoice No"
              orderBy={sortField}
              order={sortOrder}
              onSort={handleSort}
            />
          ),
          field: "invoiceNumber",
          sortable: true,
        },
        {
          label: (
            <SortHeader
              columnKey="clientName"
              label="Client"
              orderBy={sortField}
              order={sortOrder}
              onSort={handleSort}
            />
          ),
          field: "clientName",
          sortable: true,
        },
        {
          label: (
            <SortHeader
              columnKey="amount"
              label="Amount"
              orderBy={sortField}
              order={sortOrder}
              onSort={handleSort}
            />
          ),
          field: "amount",
          sortable: true,
          render: (row) => `${row.amount} ${row.currency}`,
        },
        {
          label: (
            <SortHeader
              columnKey="dueDate"
              label="Due Date"
              orderBy={sortField}
              order={sortOrder}
              onSort={handleSort}
            />
          ),
          field: "dueDate",
          sortable: true,
          render: (row) => formatDateTime(row.dueDate),
        },
        {
          label: "Status",
          render: (row) => getStatusChip(row.status),
        },
        {
          label: "Actions",
          render: (row) => (
            <Stack direction="row" spacing={1}>
              <IconButton
                title="View"
                color="primary"
                onClick={() =>
                  navigate(
                    `/projects/ProjectDetails/${projectId}/invocies/invoiceDetails/${row._id}`
                  )
                }
              >
                <FaEye size={18} />
              </IconButton>

              {role === "Admin" && (
                <>
                  <IconButton
                    title="Edit"
                    color="secondary"
                    onClick={() =>
                      navigate(
                        `/projects/ProjectDetails/${projectId}/invocies/updateInvoice/edit/${row._id}`
                      )
                    }
                  >
                    <FaEdit size={18} />
                  </IconButton>
                  <IconButton
                    title="Delete"
                    color="error"
                    onClick={() => {
                      setInvoiceToDelete(row);
                      setOpenDeleteDialog(true);
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </>
              )}
            </Stack>
          ),
        },
      ];

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        mb={3}
        sx={{ background: "linear-gradient(90deg, #e8f0ff, #ffffff)", p: 1 }}
      >
        {" "}
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Search
            value={search}
            onChange={setSearch}
            placeholder="Search invoice..."
          />
          <Box sx={{ width: isSmall ? "100%" : 180 }}>
            <select
              className="form-select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </Box>
        </Box>
        {role === "Admin" && (
          <Button
            variant="contained"
            startIcon={<AddCircleOutline />}
            color="secondary"
            onClick={() =>
              navigate(
                `/projects/ProjectDetails/${projectId}/invocies/createInvoice/create`
              )
            }
            sx={{ mt: { xs: 2, md: 0 } }}
          >
            Add Invoice
          </Button>
        )}
      </Box>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid #eee",
          "& .MuiTableCell-root": {
            py: isSmall ? 0.5 : 0.7,
            px: isSmall ? 1 : 1.5,
          },
        }}
      >
        <ReusableTable
          columns={columns}
          rows={rows}
          isLoading={loading}
          tableName="Invoices"
        />

        {/* Delete Dialog */}
        <DeleteDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Are you sure?"
          message={`You won’t be able to revert this! \n ${
            invoiceToDelete?.invoiceNumber || ""
          }`}
        />
      </Paper>

      {/* Pagination + Limit */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
        flexWrap="wrap"
        gap={1}
      >
        <FormControl size="small" sx={{ minWidth: 90 }}>
          <Select
            value={limit}
            onChange={(e) => {
              setLimit(e.target.value);
              setPage(1);
            }}
          >
            {[5, 10, 20].map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" alignItems="center" gap={2} ml="auto">
          <CustomPagination
            currentPage={page}
            totalPages={pageCount}
            onPageChange={setPage}
          />
          <Typography variant="body2" color="text.secondary">
            Total: <strong>{total}</strong>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
