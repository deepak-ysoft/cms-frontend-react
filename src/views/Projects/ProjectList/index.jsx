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
  Chip,
} from "@mui/material";
import { FaEye, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { deleteProject, getProjects } from "../../../api/ProjectApi";
import CustomPagination from "../../../shared/components/reusableComponent/Pagination";
import SortHeader from "../../../shared/components/reusableComponent/SortHeader";
import Search from "../../../shared/components/reusableComponent/Search";
import ReusableTable from "../../../shared/components/reusableComponent/Table";
import DisplayImage from "../../../shared/components/reusableComponent/DisplayImage";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import { formatDateTime } from "../../../utils/formatDateTime";
import { showToast } from "../../../utils/toastHelper";
import DeleteDialog from "../../../shared/components/reusableComponent/DeleteDialog";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 700);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, [page, rowsPerPage, debouncedSearch, status, orderBy, order]);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await getProjects(
        page,
        rowsPerPage,
        debouncedSearch,
        status,
        orderBy,
        order
      );

      setProjects(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (property, newOrder) => {
    setOrderBy(property);
    setOrder(newOrder);
    setPage(1);
  };

  const confirmDelete = async () => {
    try {
      if (projectToDelete?.id) {
        await deleteProject(projectToDelete.id);

        showToast(
          "success",
          `${projectToDelete.projectName} deleted successfully`
        );

        fetchProjects();
      }
    } catch {
      showToast("error", "Delete failed!");
    } finally {
      setOpenDeleteDialog(false);
      setProjectToDelete(null);
    }
  };

  const STATUS_COLORS = {
    Active: "info",
    Pushed: "warning",
    Completed: "success",
    OnHold: "default",
    Cancelled: "error",
  };

  // COLUMNS UPDATED ACCORDING TO NEW API
  const columns = isSmall
    ? [
        {
          field: "projectName",
          label: (
            <SortHeader
              columnKey="name"
              label="Project Name"
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
                onClick={() => navigate(`/projects/ProjectDetails/${row.id}`)}
                sx={{ color: "primary.main" }}
              >
                <FaEye size={18} />
              </IconButton>

              <IconButton
                title="Edit"
                onClick={() =>
                  navigate(`/projects/updateprojects/edit/${row.id}`)
                }
                sx={{ color: "secondary.main" }}
              >
                <FaEdit size={17} />
              </IconButton>

              <IconButton
                title="Delete"
                color="error"
                onClick={() => {
                  setProjectToDelete(row);
                  setOpenDeleteDialog(true);
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </>
          ),
        },
      ]
    : [
        {
          field: "projectName",
          label: (
            <SortHeader
              columnKey="name"
              label="Project Name"
              orderBy={orderBy}
              order={order}
              onSort={handleSort}
            />
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
          field: "manager",
          label: "Manager",
          render: (row) => (
            <Box display="flex" alignItems="center" gap={1}>
              <DisplayImage
                imagePath={row?.manager?.profileImage}
                alt={row?.manager?.fullName}
                size={35}
              />
              <Typography variant="body2">{row?.manager?.fullName}</Typography>
            </Box>
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
                onClick={() => navigate(`/projects/ProjectDetails/${row.id}`)}
                sx={{ color: "primary.main" }}
              >
                <FaEye size={18} />
              </IconButton>

              <IconButton
                title="Edit"
                onClick={() =>
                  navigate(`/projects/updateprojects/edit/${row.id}`)
                }
                sx={{ color: "secondary.main" }}
              >
                <FaEdit size={17} />
              </IconButton>

              <IconButton
                title="Delete"
                color="error"
                onClick={() => {
                  setProjectToDelete(row);
                  setOpenDeleteDialog(true);
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
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
            sx={{ color: "primary.main", pl: 3 }}
          >
            Project List
          </Typography>

          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Search
              value={search}
              onChange={setSearch}
              placeholder="Search projects..."
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
                <option value="Active">Active</option>
                <option value="Pushed">Pushed</option>
                <option value="Completed">Completed</option>
                <option value="OnHold">OnHold</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => navigate("/projects/createprojects")}
                variant="contained"
                color="secondary"
                startIcon={<AddCircleOutline />}
              >
                Add Project
              </Button>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

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
            rows={projects}
            tableName="Projects"
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

        {/* Delete dialog */}
        <DeleteDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Are you sure?"
          message={`You won't be able to revert this!\n ${
            projectToDelete?.projectName || ""
          }`}
        />
      </Paper>
    </Box>
  );
}

export default ProjectList;
