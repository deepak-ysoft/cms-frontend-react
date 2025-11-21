import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { FaEye, FaEdit } from "react-icons/fa";
import { Close, Delete, Edit } from "@mui/icons-material";
import {
  deleteContract,
  getAllContracts,
  updateContract,
} from "../../../api/Contract";
import { showToast } from "../../../utils/toastHelper";
import { formatDateTime } from "../../../utils/formatDateTime";
import ReusableTable from "../../../shared/components/reusableComponent/Table";
import CustomPagination from "../../../shared/components/reusableComponent/Pagination";
import DeleteDialog from "../../../shared/components/reusableComponent/DeleteDialog";
import SortHeader from "../../../shared/components/reusableComponent/SortHeader";
import Search from "../../../shared/components/reusableComponent/Search";
import ContractForm from "../../Projects/ProjectDetailsTab/Contracts/ContractForm";

function ContractList() {
  const [contracts, setContracts] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);
  const [editData, setEditData] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const role = localStorage.getItem("role");

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  // 🔹 Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 700);
    return () => clearTimeout(timer);
  }, [search]);

  // 🔹 Fetch contracts
  useEffect(() => {
    fetchContracts();
  }, [page, rowsPerPage, debouncedSearch, status, orderBy, order]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const { contracts, pagination } = await getAllContracts(
        page,
        rowsPerPage,
        debouncedSearch,
        status,
        orderBy,
        order
      );
      setContracts(contracts);
      setTotal(pagination?.total || 0);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id, formData) => {
    try {
      const res = await updateContract(id, formData);
      if (res?.isSuccess) {
        showToast("success", res.message);
        setEditData(null);
        fetchContracts();
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteContract(deleteId);
      if (res?.isSuccess) {
        showToast("success", res.message);
        fetchContracts();
      }
    } catch {
      showToast("error", "Delete failed");
    } finally {
      setOpenDelete(false);
    }
  };

  // 🔹 Sort handler
  const handleSort = (property, newOrder) => {
    setOrderBy(property);
    setOrder(newOrder);
    setPage(1);
  };

  // 🔹 Delete confirmation
  const confirmDelete = async () => {
    try {
      // replace with deleteContract API when available
      showToast(
        "success",
        `${contractToDelete.contractName} deleted successfully!`
      );
      fetchContracts();
    } catch {
      showToast("error", "Delete failed!");
    } finally {
      setOpenDeleteDialog(false);
      setContractToDelete(null);
    }
  };

  const BillingType_COLORS = {
    Fixed: "secondary",
    Hourly: "primary",
  };

  const STATUS_COLORS = {
    Active: "info",
    Completed: "success",
    Cancelled: "error",
    Ended: "warning",
  };

  // 🔹 Table columns
  const columns = isSmall
    ? [
        {
          field: "contractName",
          label: (
            <SortHeader
              columnKey="contractName"
              label="Contract Name"
              orderBy={orderBy}
              order={order}
              onSort={handleSort}
            />
          ),
        },
        {
          field: "actions",
          label: "Actions",
          render: (row) => (
            <>
              <IconButton
                title="View"
                onClick={() => navigate(`/contracts/details/${row?.id}`)}
                sx={{ color: "primary.main" }}
              >
                <FaEye size={18} />
              </IconButton>
              {role === "Admin" && (
                <>
                  <IconButton
                    title="Edit"
                    onClick={() => setEditData(row)}
                    sx={{ color: "secondary.main", mx: 1 }}
                  >
                    <FaEdit size={18} />
                  </IconButton>
                  <IconButton
                    title="Delete"
                    color="error"
                    onClick={() => {
                      setDeleteId(row.id);
                      setOpenDelete(true);
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </>
              )}
            </>
          ),
        },
      ]
    : [
        {
          field: "contractName",
          label: (
            <SortHeader
              columnKey="contractName"
              label="Contract Name"
              orderBy={orderBy}
              order={order}
              onSort={handleSort}
            />
          ),
        },
        {
          field: "projectName",
          label: (
            <SortHeader
              columnKey="projectName"
              label="Project Name"
              orderBy={orderBy}
              order={order}
              onSort={handleSort}
            />
          ),
        },
        {
          field: "billingType",
          label: (
            <SortHeader
              columnKey="billingType"
              label="Billing Type"
              orderBy={orderBy}
              order={order}
              onSort={handleSort}
            />
          ),
          render: (row) => (
            <Chip
              label={row.billingType}
              color={BillingType_COLORS[row.billingType] || "default"}
              variant="outlined"
              size="small"
            />
          ),
        },
        {
          field: "totalAmount",
          label: "Total Amount",
          render: (row) => (
            <Typography variant="body2">
              {row.totalAmount?.toLocaleString()} {row.currency || ""}
            </Typography>
          ),
        },
        {
          field: "status",
          label: (
            <SortHeader
              columnKey="status"
              label="Status"
              orderBy={orderBy}
              order={order}
              onSort={handleSort}
            />
          ),
          render: (row) => (
            <Chip
              label={row.status}
              color={STATUS_COLORS[row.status] || "default"}
              variant="outlined"
              size="small"
            />
          ),
        },
        {
          field: "createdAt",
          label: (
            <SortHeader
              columnKey="createdAt"
              label="Created Date"
              orderBy={orderBy}
              order={order}
              onSort={handleSort}
            />
          ),
          render: (row) => formatDateTime(row.createdAt),
        },
        {
          field: "actions",
          label: "Actions",
          render: (row) => (
            <>
              <IconButton
                title="View"
                onClick={() => navigate(`/contracts/details/${row.id}`)}
                sx={{ color: "primary.main" }}
              >
                <FaEye size={18} />
              </IconButton>
              {role === "Admin" && (
                <>
                  <IconButton
                    title="Edit"
                    onClick={() => setEditData(row)}
                    sx={{ color: "secondary.main", mx: 1 }}
                  >
                    <FaEdit size={18} />
                  </IconButton>
                  <IconButton
                    title="Delete"
                    color="error"
                    onClick={() => {
                      setDeleteId(row.id);
                      setOpenDelete(true);
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </>
              )}
            </>
          ),
        },
      ];

  const pageCount = Math.ceil(total / rowsPerPage);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: { xs: 1.5, md: 5 },
        backgroundColor: "#f9fafc",
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: { xs: 2, sm: 3 },
          width: "100%",

          borderRadius: 3,
          background: "#fff",
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          mb={3}
          sx={{
            background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
            p: { xs: 1 },
            borderTopLeftRadius: 8,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            color="primary.main"
            sx={{
              pl: 3,
            }}
          >
            Contracts
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{ flexWrap: "wrap" }}
          >
            <Search
              value={search}
              onChange={setSearch}
              placeholder="Search contracts..."
              fullWidth={isSmall}
              sx={{ width: isSmall ? "100%" : 300 }}
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
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Ended">Ended</option>
              </select>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

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
            isLoading={loading}
            rows={contracts}
            tableName="Contracts"
          />
        </Paper>

        {/* Pagination */}
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
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(e.target.value);
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

        {/* Delete Dialog */}
        <DeleteDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Are you sure?"
          message={`You won’t be able to revert this! \n ${
            contractToDelete?.contractName || ""
          }`}
        />
      </Paper>
      {/* Edit Contract Dialog */}
      {editData && (
        <Dialog
          open={!!editData}
          onClose={() => setEditData(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            variant="h5"
            fontWeight={700}
            color="primary.main"
            sx={{
              background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
            }}
          >
            Edit Contract
            <IconButton
              onClick={() => setEditData(null)}
              sx={{ position: "absolute", right: 16, top: 16 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <ContractForm
              contract={editData}
              onSubmit={(formData) => handleEdit(editData.id, formData)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        title="Delete Contract?"
        message="This action cannot be undone."
      />
    </Box>
  );
}

export default ContractList;
