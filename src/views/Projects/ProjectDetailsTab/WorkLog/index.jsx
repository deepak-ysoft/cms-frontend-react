import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  FormControl,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { deleteWorkLog, getWorkLogs } from "../../../../api/WorkLogApi";
import ReusableTable from "../../../../shared/components/reusableComponent/Table";
import CustomPagination from "../../../../shared/components/reusableComponent/Pagination";
import Search from "../../../../shared/components/reusableComponent/Search";
import SortHeader from "../../../../shared/components/reusableComponent/SortHeader";
import { FaEdit, FaEye } from "react-icons/fa";
import { formatDateTime } from "../../../../utils/formatDateTime";
import { Delete } from "@mui/icons-material";
import { showToast } from "../../../../utils/toastHelper";
import DeleteDialog from "../../../../shared/components/reusableComponent/DeleteDialog";

function WorkLog({ projectId: propProjectId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [projectId, setProjectId] = useState(propProjectId || null);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [logToDelete, setlogToDelete] = useState(null);
  const role = localStorage.getItem("role");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) setProjectId(id);
  }, [id]);

  useEffect(() => {
    fetchWorkLogs();
  }, [projectId, page, rowsPerPage, search, status, sortConfig]);

  const fetchWorkLogs = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const res = await getWorkLogs(
        projectId,
        page,
        rowsPerPage,
        search,
        status
      );
      setLogs(res.data || res);
      setTotalLogs(res.total || res.data.length || 0);
      setError(null);
    } catch (err) {
      setError(`Failed to load worklogs. ${err}`);
    } finally {
      setLoading(false);
    }
  };
  const APPROVAL_COLORS = {
    Pending: "warning",
    Approved: "success",
    Rejected: "error",
  };

  // Delete
  const confirmDelete = async () => {
    try {
      if (logToDelete?.id) {
        await deleteWorkLog(logToDelete?.id);
        showToast("success", `${logToDelete.title} deleted successfully!`);

        fetchWorkLogs();
      }
    } catch {
      showToast("error", "Delete failed!");
    } finally {
      setOpenDeleteDialog(false);
      setlogToDelete(null);
    }
  };

  const handleSort = (key, direction) => setSortConfig({ key, direction });
  const pageCount = Math.ceil(totalLogs / rowsPerPage);

  const columns = isSmall
    ? [
        {
          label: (
            <SortHeader
              columnKey="date"
              label="Date"
              orderBy={sortConfig.key}
              order={sortConfig.direction}
              onSort={handleSort}
            />
          ),
          field: "date",
          render: (row) => {
            return formatDateTime(row.date);
          },
        },
        {
          label: (
            <SortHeader
              columnKey="title"
              label="Title"
              orderBy={sortConfig.key}
              order={sortConfig.direction}
              onSort={handleSort}
            />
          ),
          field: "title",
        },
        {
          field: "actions",
          label: "Actions",
          render: (row) => (
            <Box display="flex" gap={1}>
              <IconButton
                title="View"
                onClick={() => navigate(`/projects/worklogs/${row?.id}`)}
                sx={{ color: "primary.main" }}
              >
                <FaEye size={isSmall ? 16 : 19} />
              </IconButton>
              <IconButton
                title="Edit"
                onClick={() =>
                  navigate(
                    `/projects/${projectId}/worklogs/edit/${row.id}/Admin`
                  )
                }
                sx={{ color: "secondary.main" }}
              >
                <FaEdit size={18} />
              </IconButton>
              {role === "Admin" && (
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
              )}
            </Box>
          ),
        },
      ]
    : [
        {
          label: (
            <SortHeader
              columnKey="date"
              label="Date"
              orderBy={sortConfig.key}
              order={sortConfig.direction}
              onSort={handleSort}
            />
          ),
          field: "date",
          render: (row) => {
            return formatDateTime(row.date);
          },
        },
        {
          label: (
            <SortHeader
              columnKey="title"
              label="Title"
              orderBy={sortConfig.key}
              order={sortConfig.direction}
              onSort={handleSort}
            />
          ),
          field: "title",
        },
        {
          label: (
            <SortHeader
              columnKey="developerName"
              label="Developer"
              orderBy={sortConfig.key}
              order={sortConfig.direction}
              onSort={handleSort}
            />
          ),
          field: "developerName",
        },
        {
          field: "approvalStatus",
          label: (
            <SortHeader
              columnKey="approvalStatus"
              label="Approval Status"
              orderBy={sortConfig.key}
              order={sortConfig.direction}
              onSort={handleSort}
            />
          ),
          render: (row) => (
            <Chip
              label={row.approvalStatus}
              color={APPROVAL_COLORS[row.approvalStatus] || "default"}
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
          label: (
            <SortHeader
              columnKey="hours"
              label="Hours"
              orderBy={sortConfig.key}
              order={sortConfig.direction}
              onSort={handleSort}
            />
          ),
          field: "hours",
          render: (row) => {
            return `${row.hours} hrs`;
          },
        },
        {
          field: "actions",
          label: "Actions",
          render: (row) => (
            <Box display="flex" gap={1}>
              <IconButton
                title="View"
                onClick={() => navigate(`/projects/worklogs/${row?.id}`)}
                sx={{ color: "primary.main" }}
              >
                <FaEye size={isSmall ? 16 : 19} />
              </IconButton>
              <IconButton
                title="Edit"
                onClick={() =>
                  navigate(
                    `/projects/${projectId}/worklogs/edit/${row.id}/Admin`
                  )
                }
                sx={{ color: "secondary.main" }}
              >
                <FaEdit size={18} />
              </IconButton>
              {role === "Admin" && (
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
              )}
            </Box>
          ),
        },
      ];

  return (
    <Box>
      {/* ✅ Header Section */}
      <Box
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        sx={{ background: "linear-gradient(90deg, #e8f0ff, #ffffff)", p: 1 }}
      >
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Search
            value={search}
            onChange={setSearch}
            placeholder="Search logs..."
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
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </Box>
        </Box>
      </Box>

      {/* ✅ Table Container */}

      <>
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
            rows={logs}
            isLoading={loading}
            tableName="Work Logs"
          />
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

        {/* Pagination */}
        {!error && (
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
                Total: <strong>{totalLogs}</strong>
              </Typography>
            </Box>
          </Box>
        )}
      </>
    </Box>
  );
}

export default WorkLog;
