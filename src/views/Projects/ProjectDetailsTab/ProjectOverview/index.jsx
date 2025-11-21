import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Avatar,
  IconButton,
  TextField,
  CircularProgress,
  Divider,
  Stack,
  Checkbox,
  Paper,
  CardContent,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Add, Delete, Phone } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useDrop, useDrag } from "react-dnd";

import { showToast } from "../../../../utils/toastHelper";
import CustomPagination from "../../../../shared/components/reusableComponent/Pagination";
import {
  assignDeveloperToProject,
  getProjectById,
  removeDeveloperFromProject,
} from "../../../../api/ProjectApi";
import { getUsers } from "../../../../api/userApi";
import { formatDateTime } from "../../../../utils/formatDateTime";
import { PictureAsPdf, Image, InsertDriveFile } from "@mui/icons-material";
import ImagePreviewModal from "../../../../shared/components/reusableComponent/ImagePreviewModal";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import FlagCircleOutlinedIcon from "@mui/icons-material/FlagCircleOutlined";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import AlarmOnOutlinedIcon from "@mui/icons-material/AlarmOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import { sendNotificationHelper } from "../../../../utils/sendNotificationHelper";
import UserContext from "../../../../shared/context/UserContext";

const ItemTypes = { USER: "user" };

//
// 🟦 Draggable User Item
//

const UserItem = ({ user, selectedDevelopers = [], onSelect }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.USER,
    item: { user },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // ✅ Check if this user is already selected (developer assigned)
  const isChecked = selectedDevelopers.some(
    (dev) => dev._id === user._id || dev.id === user._id
  );

  return (
    <Card
      ref={drag}
      sx={{
        mb: 0.5,
        display: "flex",
        alignItems: "center",
        gap: 2,
        m: 1.2,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        "&:hover": { backgroundColor: "#f5f9ff" },
      }}
    >
      {/* ✅ Checkbox added here */}
      <Checkbox
        checked={isChecked}
        onChange={() => onSelect(user)}
        size="small"
        sx={{
          p: 1.7, // removes extra padding
          color: "#1976d2",
          "&.Mui-checked": {
            color: "#1976d2",
          },
          transform: "scale(0.9)", // make slightly smaller
          mr: 1, // space between checkbox and avatar
          ml: 0.5,
        }}
      />

      <Avatar
        src={user?.profileImage ? `${user?.profileImage}` : ""}
        alt={user.fullName}
        sx={{ width: 32, height: 32, fontSize: 14 }}
      />

      <Typography variant="body2" noWrap>
        {user.firstName} {user.lastName}
      </Typography>
    </Card>
  );
};

//
// 🟩 Developer Card (Assigned Devs)
//
const DeveloperCard = ({ developer, onDelete }) => (
  <Card
    sx={{
      p: 1.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 2,
      boxShadow: 1,
      transition: "0.2s",
      "&:hover": { boxShadow: 3, backgroundColor: "#f9f9f9" },
    }}
  >
    <Box display="flex" alignItems="center" gap={1.5}>
      <Avatar
        src={developer?.profileImage ? `${developer?.profileImage}` : ""}
        alt={developer.fullName}
        sx={{ width: 36, height: 36, fontSize: 14 }}
      />
      <Typography
        variant="body2"
        fontWeight={500}
        sx={{ color: "text.primary", maxWidth: 140 }}
        noWrap
      >
        {developer.fullName ||
          `${developer.firstName || ""} ${developer.lastName || ""}`}
      </Typography>
    </Box>
    <IconButton
      title="Delete"
      color="error"
      onClick={() => onDelete()}
      sx={{
        "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.1)" },
      }}
    >
      <Delete fontSize="small" />
    </IconButton>
  </Card>
);

//
// 🟨 Main Project Details Page
//
const ProjectDetailsPage = ({ projectId: propId }) => {
  const { projectId: routeId } = useParams();
  const projectId = propId || routeId;

  const [project, setProject] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProject, setLoadingProject] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpenImage = (imgUrl) => setSelectedImage(imgUrl);
  const handleCloseImage = () => setSelectedImage(null);
  const { user } = useContext(UserContext);

  const pageCount = Math.max(1, Math.ceil(total / rowsPerPage));
  const [confirmData, setConfirmData] = useState({
    open: false,
    action: null, // "add" | "remove"
    user: null,
  });

  const handleSelectDeveloper = (user) => {
    const alreadySelected = developers.some(
      (dev) => dev._id === user._id || dev.id === user._id
    );

    setConfirmData({
      open: true,
      action: alreadySelected ? "remove" : "add",
      user,
    });
  };

  const confirmAction = async () => {
    const { action, user } = confirmData;

    if (!user) return;

    if (action === "add") {
      const ok = await handleAddDeveloper(user);
      if (ok) {
        setDevelopers((prev) => [...prev, user]);
      }
    } else if (action === "remove") {
      const ok = await handleDeleteDeveloper(user);
      if (ok) {
        setDevelopers((prev) =>
          prev.filter((d) => (d._id || d.id) !== (user._id || user.id))
        );
      }
    }

    setConfirmData({ open: false, action: null, user: null });
  };

  const cancelAction = () => {
    setConfirmData({ open: false, action: null, user: null });
  };

  //
  // 🧩 Fetch Project Details
  //
  const fetchProject = async () => {
    setLoadingProject(true);
    try {
      const res = await getProjectById(projectId);
      if (res?.isSuccess) {
        const p = res.data || {};
        setProject(p);

        // normalize developers
        let devList = [];
        if (Array.isArray(p.developers)) devList = p.developers;
        else if (typeof p.developers === "object" && p.developers)
          devList = Object.values(p.developers);
        setDevelopers(devList);
      }
    } catch (error) {
      showToast("error", `Failed to load project details : ${error.message}`);
    } finally {
      setLoadingProject(false);
    }
  };

  //
  // 🧩 Fetch Available Users
  //
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await getUsers(page, rowsPerPage, search, "Developer");

      const list = res?.data?.data || res?.data || res || [];
      const totalCount =
        res?.data?.total ||
        res?.total ||
        res?.data?.pagination?.total ||
        list.length ||
        0;

      setUsers(list);
      setTotal(totalCount);
    } catch (error) {
      showToast("error", `Failed to load developers : ${error.message}`);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    const delay = setTimeout(fetchUsers, 400); // debounce search
    return () => clearTimeout(delay);
  }, [page, search]);

  //
  // 🟦 Drop Area
  //
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.USER,
    drop: (item) => {
      setConfirmData({
        open: true,
        action: "add",
        user: item.user,
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleAddDeveloper = async (developer) => {
    try {
      const response = await assignDeveloperToProject(projectId, [
        developer._id,
      ]);
      if (!response?.isSuccess) {
        showToast("error", response?.message || "Failed to assign developer");
        return false;
      } else {
        let payload = {
          title: `You’ve Been Added to a New Project ${project.name}`,
          message: `You have been successfully added to the project ${project.name}.
Your role in this project is now active, and all relevant tasks, permissions, and project details are available in your dashboard.
Please review the project information and begin with the assigned responsibilities.
`,
          type: "info",
          sendTo: "specific",
          email: developer.email,
          meta: {},
        };
        await sendNotificationHelper({ user: user, formData: payload });
      }
      return true;
    } catch (err) {
      showToast("error", err.message);
      return false;
    }
  };

  const handleDeleteDeveloper = async (developer) => {
    try {
      const response = await removeDeveloperFromProject(
        projectId,
        developer.id ?? developer._id
      );
      if (!response?.isSuccess) {
        showToast("error", response?.message);
        return false;
      } else {
        let payload = {
          title: `You’ve Been Removed from a Project ${project.name}`,
          message: `You have been removed from the project ${project.name}.
You no longer have active responsibilities or access to this project’s tasks and resources.
If you believe this change was made in error or need further clarification, please contact your project manager or administrator.
`,
          type: "info",
          sendTo: "specific",
          email: developer.email,
          meta: {},
        };
        await sendNotificationHelper({ user: user, formData: payload });
      }
      return true;
    } catch (err) {
      showToast("error", err.message);
      return false;
    }
  };

  //
  // 🧭 Loading State
  //
  if (loadingProject || !project) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  //
  // 🧠 Render
  //
  return (
    <Box>
      {/* 🧠 Project Header */}
      <Card
        sx={{
          p: { xs: 0, sm: 3 },
          boxShadow: 1,
          borderRadius: 3,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 4,
        }}
      >
        {/* ---- Project Info ---- */}

        <Typography
          variant="h6"
          color="primary.main"
          fontWeight={600}
          sx={{
            background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
            p: { xs: 1, md: 1 },
            borderTopLeftRadius: 8,
          }}
          gutterBottom
        >
          <Box pl={3}> Project Overview</Box>
        </Typography>

        <CardContent
          sx={{
            p: { xs: 0, md: 2.5 },
          }}
        >
          {/* Basic Info Cards */}
          <Typography variant="h6" ml={1} mb={2}>
            Basic Information
          </Typography>
          <Grid container mb={3}>
            {[
              {
                label: "Project Name",
                value: project.name,
                icon: <WorkOutlineIcon color="primary" />,
              },
            ].map((item, i) => (
              <Grid
                key={i}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "50%",
                    md: "40%",
                    lg: "24%",
                  },
                  p: 1,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background:
                      "linear-gradient(145deg, #f9fafc 0%, #ffffff 100%)",
                    transition: ".25s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {item.icon}
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography variant="body1" component="div" fontWeight={600}>
                    {item.value || "—"}
                  </Typography>
                </Paper>
              </Grid>
            ))}{" "}
            {[
              {
                label: "Status",
                value: (
                  <Chip
                    label={project.status}
                    color={
                      project.status === "Active"
                        ? "primary"
                        : project.status === "Completed"
                        ? "success"
                        : "warning"
                    }
                    size="small"
                  />
                ),
                icon: <FlagCircleOutlinedIcon color="info" />,
              },
              {
                label: "Priority",
                value: project.priority,
                icon: <PriorityHighOutlinedIcon color="error" />,
              },
              {
                label: "Project Type",
                value: project.projectType,
                icon: <CategoryOutlinedIcon color="secondary" />,
              },
              {
                label: "Phase",
                value: project.phase,
                icon: <LayersOutlinedIcon color="action" />,
              },
            ].map((item, i) => (
              <Grid
                key={i}
                sx={{
                  width: { xs: "100%", sm: "50%", md: "30%", lg: "19%" },
                  p: 1,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background:
                      "linear-gradient(145deg, #f9fafc 0%, #ffffff 100%)",
                    transition: ".25s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {item.icon}
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography variant="body1" component="div" fontWeight={600}>
                    {item.value || "—"}
                  </Typography>
                </Paper>
              </Grid>
            ))}{" "}
            {[
              {
                label: "Project Technologies",
                value: (
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {project.projectTech && project.projectTech.length > 0 ? (
                      project.projectTech.map((tech, index) => (
                        <Chip
                          key={index}
                          label={tech}
                          color="info"
                          variant="outlined"
                          size="small"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No technologies added
                      </Typography>
                    )}
                  </Box>
                ),
                icon: <CodeOutlinedIcon color="info" />,
              },
            ].map((item, i) => (
              <Grid
                key={i}
                sx={{
                  width: { xs: "100%", sm: "50%", md: "40%", lg: "30%" },
                  p: 1,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background:
                      "linear-gradient(145deg, #f9fafc 0%, #ffffff 100%)",
                    transition: ".25s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {item.icon}
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Box>
                  {item.value}
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Timeline Cards */}
          <Typography variant="h6" ml={1} mb={2}>
            Timeline
          </Typography>
          <Grid container mb={3}>
            {[
              {
                label: "Start Date",
                value: formatDateTime(project.timeline?.startDate),
                icon: <EventOutlinedIcon color="primary" />,
              },
              {
                label: "End Date",
                value: formatDateTime(project.timeline?.endDate),
                icon: <EventAvailableOutlinedIcon color="success" />,
              },
              {
                label: "Deadline",
                value: formatDateTime(project.timeline?.deadline),
                icon: <AlarmOnOutlinedIcon color="warning" />,
              },
              {
                label: "Estimated Hours",
                value: `${project.timeline?.estimatedHours} hrs`,
                icon: <AccessTimeOutlinedIcon color="info" />,
              },
              {
                label: "Actual Hours",
                value: `${project.timeline?.actualHours} hrs`,
                icon: <TimerOutlinedIcon color="secondary" />,
              },
            ].map((item, i) => (
              <Grid
                key={i}
                sx={{
                  width: { xs: "100%", sm: "50%", md: "33.33%", lg: "20%" },
                  p: 1,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background:
                      "linear-gradient(145deg, #f9fafc 0%, #ffffff 100%)",
                    transition: ".25s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {item.icon}
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography variant="body1" component="div" fontWeight={600}>
                    {item.value || "—"}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Client Info */}
          <Typography variant="h6" ml={1} mb={2}>
            Client Information
          </Typography>
          <Grid container mb={3}>
            {[
              {
                label: "Company",
                value: project.client?.company || "N/A",
                icon: <BusinessOutlinedIcon color="secondary" />,
              },
              {
                label: "Client Name",
                value: project.client?.name || "N/A",
                icon: <PersonOutlineIcon color="primary" />,
              },
              {
                label: "Phone Number",
                value: project.client?.phone || "N/A",
                icon: <Phone color="primary" />,
              },
            ].map((item, i) => (
              <Grid
                key={i}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "50%",
                    md: "33.33%",
                    lg: "20%",
                    wordBreak: "break-all",
                  },
                  p: 1,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background:
                      "linear-gradient(145deg, #f9fafc 0%, #ffffff 100%)",
                    transition: ".25s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {item.icon}
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography variant="body1" component="div" fontWeight={600}>
                    {item.value || "—"}
                  </Typography>
                </Paper>
              </Grid>
            ))}{" "}
            {[
              {
                label: "Email",
                value: project.client?.email || "N/A",
                icon: <EmailOutlinedIcon color="info" />,
              },
            ].map((item, i) => (
              <Grid
                key={i}
                sx={{
                  width: { xs: "100%", sm: "60%", md: "70%", lg: "40%" },
                  p: 1,
                  wordBreak: "break-all",
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background:
                      "linear-gradient(145deg, #f9fafc 0%, #ffffff 100%)",
                    transition: ".25s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {item.icon}
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography variant="body1" component="div" fontWeight={600}>
                    {item.value || "—"}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Financial Info */}
          <Typography variant="h6" ml={1} mb={2}>
            Financial Information
          </Typography>
          <Grid container mb={3}>
            {[
              {
                label: "Budget",
                value: `${project.financials?.currency} ${project.financials?.budget}`,
                icon: <MonetizationOnOutlinedIcon color="success" />,
              },
              {
                label: "Spent",
                value: `${project.financials?.currency} ${project.financials?.spentAmount}`,
                icon: <AccountBalanceWalletOutlinedIcon color="warning" />,
              },
            ].map((item, i) => (
              <Grid
                key={i}
                sx={{ width: { xs: "100%", sm: "50%", md: "30%" }, p: 1 }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background:
                      "linear-gradient(145deg, #f9fafc 0%, #ffffff 100%)",
                    transition: ".25s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {item.icon}
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography variant="body1" component="div" fontWeight={600}>
                    {item.value || "—"}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Description */}
          <Typography variant="h6" ml={1} mb={1}>
            Description
          </Typography>
          <Paper
            elevation={0}
            sx={{ p: 2, borderRadius: 3, backgroundColor: "#fafafa" }}
          >
            <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
              {project.description || "No description provided."}
            </Typography>
          </Paper>

          <Divider sx={{ my: 2 }} />
          {/* Attachments Section */}
          <Typography variant="h6" ml={1} mt={3} mb={1}>
            Attachments
          </Typography>

          {project.attachments?.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              {project.attachments.map((a) => {
                const fileUrl = `${a.url}`;
                const isImage = /\.(png|jpe?g|gif|webp)$/i.test(a.url);

                return (
                  <Tooltip key={a.url} title={a.name}>
                    <Chip
                      icon={
                        isImage ? (
                          <Image />
                        ) : a.url.endsWith(".pdf") ? (
                          <PictureAsPdf />
                        ) : (
                          <InsertDriveFile />
                        )
                      }
                      label={a.name}
                      clickable
                      onClick={() => isImage && handleOpenImage(fileUrl)}
                      component="a"
                      href={!isImage ? fileUrl : undefined}
                      target={!isImage ? "_blank" : undefined}
                      sx={{
                        fontSize: "0.85rem",
                        "&:hover": { backgroundColor: "#e3f2fd" },
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" mx={1}>
              No attachments added.
            </Typography>
          )}
        </CardContent>

        {/* Reusable Image Modal */}
        <ImagePreviewModal
          open={!!selectedImage}
          onClose={handleCloseImage}
          imageUrl={selectedImage}
          title="Attachment Preview"
        />
        <Divider />
        {/* ---- Manager Info ---- */}
        <Stack
          direction="row"
          sx={{
            p: { xs: 2, md: 0 },
            mt: 1,
            flexWrap: "wrap",
            justifyContent: { xs: "flex-start", sm: "space-between" },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              src={
                project.manager?.profileImage
                  ? `${project.manager?.profileImage}`
                  : ""
              }
              alt={project.manager?.fullName}
              sx={{
                width: 44,
                height: 44,
                border: "2px solid #eee",
              }}
            />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Project Manager
              </Typography>
              <Typography variant="body1" component="div" fontWeight={500}>
                {project.manager?.fullName || "N/A"}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Card>

      {/* 🧩 Layout: Developers + Users */}
      <Grid
        container
        justifyContent="left"
        sx={{
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
        }}
      >
        {/* 🟩 Assigned Developers */}
        <Grid
          size={{ xs: 12 }}
          sx={{
            width: { md: "100%", lg: "65%" },
            pr: { md: 0, lg: 1 },
            mb: { xs: 2, lg: 0 },
          }}
        >
          <Card
            ref={drop}
            sx={{
              p: { xs: 1, md: 2.5 },
              minHeight: 465,
              height: "100%",
              backgroundColor: isOver ? "#e3f2fd" : "background.paper",
              border: isOver ? "2px dashed #2196f3" : "1px solid #ddd",
              transition: "0.3s",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              color="primary.main"
              fontWeight={600}
              sx={{
                background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
                p: { xs: 1, md: 1 },
                borderTopLeftRadius: 8,
              }}
              gutterBottom
            >
              <Box pl={3}> Assigned Developers</Box>
            </Typography>

            <Divider />
            <Box
              sx={{
                maxHeight: { xs: "45vh", sm: "42vh" }, // smaller scroll area on mobile
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#ccc",
                  borderRadius: "3px",
                },
              }}
            >
              {developers.length > 0 ? (
                <Grid container>
                  {developers.map((dev) => {
                    const id = dev._id || dev.id;
                    return (
                      <Grid
                        sx={{ width: { xs: "100%", sm: "50%" }, p: 1 }}
                        key={id}
                      >
                        <DeveloperCard
                          developer={dev}
                          onDelete={() =>
                            setConfirmData({
                              open: true,
                              action: "remove",
                              user: dev, // correct object for removal
                            })
                          }
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Typography color="text.secondary">
                  No developers assigned
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>

        {/* 🟦 Available Users */}
        <Grid
          md="auto"
          sx={{
            width: { xs: "100%", lg: "35%" },
            pl: { md: 0, lg: 1 },
          }}
        >
          <Card
            sx={{
              p: { xs: 1, md: 2.5 },
              minHeight: 465,
              height: "100%",
              backgroundColor: isOver ? "#e3f2fd" : "background.paper",
              border: isOver ? "2px dashed #2196f3" : "1px solid #ddd",
              transition: "0.3s",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              color="primary.main"
              sx={{
                background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
                p: { xs: 1, md: 1 },
                borderTopLeftRadius: 8,
              }}
              fontWeight={600}
            >
              <Box pl={3}> Available Developers</Box>
            </Typography>

            <TextField
              fullWidth
              size="small"
              placeholder="Search developers..."
              sx={{ my: 1 }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <Divider sx={{ mb: 1 }} />

            {loadingUsers ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={28} />
              </Box>
            ) : (
              <Box sx={{ flex: 1, maxHeight: 420, overflowY: "auto" }}>
                {users.length > 0 ? (
                  users.map((user) => (
                    <UserItem
                      key={user._id}
                      user={user}
                      selectedDevelopers={developers} // 👈 pass current selected devs
                      onSelect={handleSelectDeveloper} // 👈 handle selection
                    />
                  ))
                ) : (
                  <Typography color="text.secondary">No users found</Typography>
                )}
              </Box>
            )}

            {/* ✅ Pagination Fixed */}
            <Box display="flex" justifyContent="center" mt={2}>
              <CustomPagination
                currentPage={page}
                totalPages={pageCount}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Dialog
        open={confirmData.open}
        onClose={cancelAction}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            minWidth: { xs: "90%", sm: 420 },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontWeight: 700,
            fontSize: "1.25rem",
            pb: 0,
          }}
        >
          {confirmData.action === "add" ? (
            <Box
              sx={{
                background: "#E3F2FD",
                p: 1,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Add color="primary" />
            </Box>
          ) : (
            <Box
              sx={{
                background: "#FDECEA",
                p: 1,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Delete color="error" />
            </Box>
          )}

          {confirmData.action === "add" ? "Add Developer" : "Remove Developer"}
        </DialogTitle>

        <DialogContent
          sx={{ mt: 1, color: "text.secondary", fontSize: "0.95rem" }}
        >
          Are you sure you want to
          {confirmData.action === "add" ? " add " : " remove "}
          <strong>
            {confirmData.user?.firstName} {confirmData.user?.lastName}
          </strong>{" "}
          from this project?
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={cancelAction}
            color="secondary"
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={confirmAction}
            variant="contained"
            color={confirmData.action === "add" ? "primary" : "error"}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectDetailsPage;
