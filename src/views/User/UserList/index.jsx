import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../../api/userApi";
import { BiEdit } from "react-icons/bi";
import { FaEdit, FaEye } from "react-icons/fa";
import {
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Box,
  Avatar,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../utils/toastHelper";

// ✅ Reusable components
import ReusableTable from "../../../shared/components/reusableComponent/Table";
import CustomPagination from "../../../shared/components/reusableComponent/Pagination";
import Search from "../../../shared/components/reusableComponent/Search";
import SortHeader from "../../../shared/components/reusableComponent/SortHeader";
import DeleteDialog from "../../../shared/components/reusableComponent/DeleteDialog";
import Divider from "@mui/material/Divider";
import { AddCircleOutline, Delete } from "@mui/icons-material";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [role, setRole] = useState(""); // role filter
  const userRole = localStorage.getItem("role");

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers(
        page,
        rowsPerPage,
        debouncedSearch,
        role,
        sortConfig.key,
        sortConfig.direction
      );
      setUsers(res.data || []);
      setTotalUsers(res.total || 0);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 700);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, debouncedSearch, sortConfig, role]);

  const handleSort = (key, direction) => setSortConfig({ key, direction });

  // Delete
  const confirmDelete = async () => {
    try {
      if (userToDelete?._id) {
        await deleteUser(userToDelete._id);
        showToast("success", `${userToDelete.firstName} deleted successfully!`);
        fetchUsers();
      }
    } catch {
      showToast("error", "Delete failed!");
    } finally {
      setOpenDeleteDialog(false);
      setUserToDelete(null);
    }
  };

  const pageCount = Math.ceil(totalUsers / rowsPerPage);

  const ROLE_COLORS = {
    Admin: "info",
    "Project Manager": "primary",
    Developer: "secondary",
  };

  const Department_COLORS = {
    Frontend: "info",
    Backend: "primary",
    Fullstack: "secondary",
    Mobile: "succes",
    "UI/UX": "warning",
    DevOps: "secondary",
    QA: "error",
  };
  const hasDeveloper = users?.some((u) => u.role === "Developer");

  // ✅ Table Columns
  const columns = isSmall
    ? [
        { label: "User", field: "user" },
        { label: "Actions", field: "actions" },
      ]
    : [
        { label: "Photo", field: "photo" },

        {
          label: (
            <SortHeader
              columnKey="fullName"
              label="Full Name"
              orderBy={sortConfig.key}
              order={sortConfig.direction}
              onSort={handleSort}
            />
          ),
          field: "fullName",
          render: (row) => `${row.firstName} ${row.lastName}`.trim(),
        },

        {
          label: (
            <SortHeader
              columnKey="email"
              label="Email"
              orderBy={sortConfig.key}
              order={sortConfig.direction}
              onSort={handleSort}
            />
          ),
          field: "email",
        },

        {
          label: (
            <SortHeader
              columnKey="role"
              label="Role"
              orderBy={sortConfig.key}
              order={sortConfig.direction}
              onSort={handleSort}
            />
          ),
          field: "role",
          render: (row) => (
            <Chip
              label={row.role}
              color={ROLE_COLORS[row.role] || "default"}
              variant="outlined"
              size="small"
            />
          ),
        },

        // 👉 SHOW ONLY IF ROLE == DEVELOPER
        ...(hasDeveloper
          ? [
              {
                label: (
                  <SortHeader
                    columnKey="department"
                    label="Department"
                    orderBy={sortConfig.key}
                    order={sortConfig.direction}
                    onSort={handleSort}
                  />
                ),
                field: "department",
                render: (row) =>
                  row.role === "Developer" ? (
                    <Chip
                      label={row?.department}
                      color={Department_COLORS[row?.department] || "default"}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    "-"
                  ),
              },
            ]
          : []),

        { label: "Actions", field: "actions" },
      ];

  // ✅ Table Rows
  const rows = users.map((u) => {
    const avatarSize = isSmall ? 34 : 36;
    const name = `${u.firstName || ""} ${u.lastName || ""}`.trim();

    const actionButtons = (
      <Box display="flex" alignItems="center">
        <IconButton
          color="primary"
          title="View"
          onClick={() => navigate(`/userList/userDetails?${u._id}`)}
        >
          <FaEye size={18} />
        </IconButton>
        {userRole === "Admin" && (
          <>
            <IconButton
              color="secondary"
              title="Edit"
              onClick={() => navigate(`/userList/userUpdate?${u._id}`)}
            >
              <FaEdit size={18} />
            </IconButton>

            <IconButton
              color="error"
              title="Delete"
              onClick={() => {
                setUserToDelete(u);
                setOpenDeleteDialog(true);
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>
    );

    if (isSmall) {
      return {
        user: (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              src={u.profileImage ? `${u.profileImage}` : ""}
              alt={name}
              sx={{ width: avatarSize, height: avatarSize }}
            />
            <Box>
              <Typography
                variant="body2"
                sx={{ fontSize: "0.95rem", fontWeight: 600 }}
              >
                {name || "—"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block" }}
              >
                {u.email}
              </Typography>
            </Box>
          </Box>
        ),
        actions: actionButtons,
      };
    }

    return {
      photo: (
        <Avatar
          src={u.profileImage ? `${u.profileImage}` : ""}
          alt={name}
          sx={{ width: 36, height: 36 }}
        />
      ),
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      department: u.department,
      actions: actionButtons,
    };
  });

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 100px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: { xs: 1.5, sm: 2, md: 5 },
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
            p: 1,
            borderTopLeftRadius: 8,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "primary.main", pl: 3 }}
          >
            User Management
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
              placeholder="Search users..."
              fullWidth={isSmall}
              sx={{ width: isSmall ? "100%" : 280 }}
            />
            <Box sx={{ width: isSmall ? "100%" : 180 }}>
              <select
                className="form-select"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Role</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Developer">Developer</option>
              </select>
            </Box>
            {userRole === "Admin" && (
              <Stack direction="row" spacing={2}>
                <Button
                  onClick={() => navigate(`/userList/userCreate`)}
                  variant="contained"
                  color="secondary"
                  startIcon={<AddCircleOutline />}
                >
                  Add User
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {/* Loader */}

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
              rows={rows}
              isLoading={loading}
              tableName="Users"
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
                  Total: <strong>{totalUsers}</strong>
                </Typography>
              </Box>
            </Box>
          )}
        </>

        {/* Delete Dialog */}
        <DeleteDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Are you sure?"
          message={`You won’t be able to revert this! \n ${
            userToDelete?.firstName || ""
          } ${userToDelete?.lastName || ""}`}
        />
      </Paper>
    </Box>
  );
}

export default UserList;
