import React, { useContext, useEffect, useState } from "react";
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
  InputLabel,
  Button,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../../shared/components/reusableComponent/Pagination";
import SortHeader from "../../../shared/components/reusableComponent/SortHeader";
import Search from "../../../shared/components/reusableComponent/Search";
import ReusableTable from "../../../shared/components/reusableComponent/Table";
import { useTheme } from "@mui/material/styles";
import { deleteWorkLog, getWorkLogsByDeveloper } from "../../../api/WorkLogApi";
import { getDeveloperProjects } from "../../../api/ProjectApi";
import { FaEye, FaEdit } from "react-icons/fa";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import { showToast } from "../../../utils/toastHelper";
import DeleteDialog from "../../../shared/components/reusableComponent/DeleteDialog";
import { formatDateTime } from "../../../utils/formatDateTime";
import UserContext from "../../../shared/context/UserContext";

function WorkLogList() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [logToDelete, setlogToDelete] = useState(null);

  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  // 🔹 Debounce search for smoother performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 700);
    return () => clearTimeout(timer);
  }, [search]);

  // 🔹 Fetch developer projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await getDeveloperProjects(1, 100);
      const projectList = response?.data || response; // handle both response types

      if (projectList && projectList.length > 0) {
        // ✅ Normalize IDs and names
        const formattedProjects = projectList.map((p) => ({
          id: p._id || p.id,
          projectName: p.name || p.projectName,
        }));

        setProjects(formattedProjects);
        setSelectedProject(formattedProjects[0].id); // ✅ Auto-select first project
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // 🔹 Fetch logs when filters change
  useEffect(() => {
    if (selectedProject) {
      fetchLogs(selectedProject);
    }
  }, [
    selectedProject,
    page,
    rowsPerPage,
    debouncedSearch,
    status,
    orderBy,
    order,
  ]);
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, total } = await getWorkLogsByDeveloper(
        selectedProject,
        user?._id,
        page,
        rowsPerPage,
        debouncedSearch,
        status,
        orderBy,
        order
      );
      setLogs(data);
      setTotal(total);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const confirmDelete = async () => {
    try {
      if (logToDelete?.id) {
        await deleteWorkLog(logToDelete?.id);
        showToast("success", `${logToDelete.title} deleted successfully!`);

        fetchLogs();
      }
    } catch {
      showToast("error", "Delete failed!");
    } finally {
      setOpenDeleteDialog(false);
      setlogToDelete(null);
    }
  };
  const handleSort = (property, newOrder) => {
    setOrderBy(property);
    setOrder(newOrder);
    setPage(1);
  };
  // ✅ Define color mappings for clarity
  const STATUS_COLORS = {
    ToDo: "default",
    InProgress: "info",
    Blocked: "error",
    Completed: "success",
    Reviewed: "secondary",
  };

  const APPROVAL_COLORS = {
    Pending: "warning",
    Approved: "success",
    Rejected: "error",
  };

  // 🔹 Table Columns
  const columns = isSmall
    ? [
        {
          field: "title",
          label: (
            <SortHeader
              columnKey="title"
              label="Title"
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
            <Box display="flex">
              <IconButton
                title="View"
                onClick={() => navigate(`/developer/worklogs/${row.id}`)}
                sx={{ color: "primary.main" }}
              >
                <FaEye size={20} />
              </IconButton>

              <IconButton
                title="Edit"
                onClick={() =>
                  navigate(
                    `/developer/workLogs/${selectedProject}/edit/${row.id}`
                  )
                }
                sx={{ color: "secondary.main" }}
              >
                <FaEdit size={18} />
              </IconButton>
              <IconButton
                title="Delete"
                color="error"
                onClick={() => {
                  setlogToDelete(row);
                  setOpenDeleteDialog(true);
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ),
        },
      ]
    : [
        {
          field: "title",
          label: (
            <SortHeader
              columnKey="title"
              label="Title"
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
              label="Project"
              orderBy={orderBy}
              order={order}
              onSort={handleSort}
            />
          ),
        },
        {
          field: "hours",
          label: "Hours",
          render: (row) => {
            return `${row.hours} hrs`;
          },
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
              sx={{
                fontWeight: 600,
                textTransform: "capitalize",
                borderRadius: "6px",
              }}
            />
          ),
        },
        {
          field: "approvalStatus",
          label: (
            <SortHeader
              columnKey="approvalStatus"
              label="Approval Status"
              orderBy={orderBy}
              order={order}
              onSort={handleSort}
            />
          ),
          render: (row) => (
            <Chip
              label={row.approvalStatus}
              color={APPROVAL_COLORS[row.approvalStatus] || "default"}
              variant="filled"
              size="small"
              sx={{
                fontWeight: 600,
                textTransform: "capitalize",
                borderRadius: "6px",
              }}
            />
          ),
        },
        {
          field: "date",
          label: (
            <SortHeader
              columnKey="date"
              label="Date"
              orderBy={orderBy}
              order={order}
              onSort={handleSort}
            />
          ),
          render: (row) => formatDateTime(row.date),
        },
        {
          field: "actions",
          label: "Actions",
          render: (row) => (
            <Box display="flex" gap={1}>
              <IconButton
                title="View"
                onClick={() => navigate(`/developer/worklogs/${row.id}`)}
                sx={{ color: "primary.main" }}
              >
                <FaEye size={20} />
              </IconButton>

              <IconButton
                title="Edit"
                onClick={() =>
                  navigate(
                    `/developer/workLogs/${selectedProject}/edit/${row.id}`
                  )
                }
                sx={{ color: "secondary.main" }}
              >
                <FaEdit size={18} />
              </IconButton>
              <IconButton
                title="Delete"
                color="error"
                onClick={() => {
                  setlogToDelete(row);
                  setOpenDeleteDialog(true);
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ),
        },
      ];

  const pageCount = Math.ceil(total / rowsPerPage);

  // 🔹 Handle "No Projects" state
  if (!projects.length) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          p: 3,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          You have no projects right now.
        </Typography>
      </Box>
    );
  }

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
            sx={{ color: "primary.main", pl: { xs: 3 }, pb: { xs: 2, md: 0 } }}
          >
            Work Logs
          </Typography>

          <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
            {/* 🔹 Project Filter Dropdown */}
            <FormControl
              size="small"
              sx={{ minWidth: 200, backgroundColor: "white" }}
            >
              <InputLabel>Project</InputLabel>
              <Select
                value={selectedProject || ""}
                label="Project"
                onChange={(e) => {
                  setSelectedProject(e.target.value);
                  setPage(1);
                }}
              >
                {projects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.projectName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Search
              value={search}
              onChange={setSearch}
              placeholder="Search work logs..."
              fullWidth={isSmall}
              sx={{ width: isSmall ? "100%" : 300 }}
            />{" "}
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
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </Box>
            {/* 🔹 Add Work Log Button */}
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddCircleOutline />}
              onClick={() =>
                navigate(`/developer/workLogs/add/${selectedProject}`)
              }
            >
              Add Work Log
            </Button>
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
            rows={logs}
            tableName="Work Logs"
          />
        </Paper>
        {/* Pagination & Page Size */}
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
        </Box>{" "}
        {/* Delete Dialog */}
        <DeleteDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Are you sure?"
          message={`You won’t be able to revert this! \n ${
            logToDelete?.title || ""
          }`}
        />
      </Paper>
    </Box>
  );
}

export default WorkLogList;
