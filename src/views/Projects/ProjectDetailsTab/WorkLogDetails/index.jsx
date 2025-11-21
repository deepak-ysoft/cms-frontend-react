import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  Person,
  Work,
  CalendarToday,
  AccessTime,
  Flag,
  CheckCircle,
  PlayCircle,
  TaskAlt,
  Visibility,
  ArrowBack,
} from "@mui/icons-material";
import { getWorkLogById } from "../../../../api/WorkLogApi";
import { formatDateTime } from "../../../../utils/formatDateTime";
import ImagePreviewModal from "../../../../shared/components/reusableComponent/ImagePreviewModal";

function WorkLogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workLog, setWorkLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpenImage = (imgUrl) => setSelectedImage(imgUrl);
  const handleCloseImage = () => setSelectedImage(null);
  const isImage = /\.(png|jpe?g|gif|webp)$/i.test(workLog?.attachments);
  const fileUrl = workLog?.attachments?.startsWith("http")
    ? workLog?.attachments
    : `${workLog?.attachments}`;

  // ✅ Fetch Work Log by ID
  useEffect(() => {
    // prevent firing until valid id exists
    const fetchWorkLog = async () => {
      try {
        const res = await getWorkLogById(id);
        setWorkLog(res);
      } catch (error) {
        console.error("Error fetching work log details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkLog();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!workLog) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <Typography color="text.secondary">No work log found.</Typography>
      </Box>
    );
  }

  // ✅ Info cards
  const infoCards = [
    {
      label: "Title",
      value: workLog?.title || "—",
      icon: <TaskAlt sx={{ color: "primary.main" }} />,
    },
    {
      label: "Developer",
      value: workLog?.developerName || "—",
      icon: <Person sx={{ color: "primary.main" }} />,
    },
    {
      label: "Project",
      value: workLog?.projectName || "—",
      icon: <Work sx={{ color: "primary.main" }} />,
    },
    {
      label: "Project Phase",
      value: workLog?.projectPhase || "—",
      icon: <Flag sx={{ color: "primary.main" }} />,
    },
    {
      label: "Date",
      value: formatDateTime(workLog?.date),
      icon: <CalendarToday sx={{ color: "primary.main" }} />,
    },
    {
      label: "Start Time",
      value: workLog?.startTime
        ? formatDateTime(workLog?.startTime, "time-daytype")
        : "—",
      icon: <PlayCircle sx={{ color: "primary.main" }} />,
    },
    {
      label: "End Time",
      value: workLog?.endTime
        ? formatDateTime(workLog?.endTime, "time-daytype")
        : "—",
      icon: <CheckCircle sx={{ color: "primary.main" }} />,
    },
    {
      label: "Hours Logged",
      value: `${workLog?.hours || 0} hrs`,
      icon: <AccessTime sx={{ color: "primary.main" }} />,
    },
  ];
  console.log("workLog?.attachments", workLog?.attachments);
  console.log("fileUrl", fileUrl);
  return (
    <Paper
      sx={{
        borderRadius: 3,
        backgroundColor: "#fff",
        m: { xs: 1, md: 5 },
      }}
    >
      {/* 🔹 HEADER */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        mb={3}
        sx={{
          background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
          p: { xs: 1, md: 3 },
          borderTopLeftRadius: 8,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: "#fff",
              boxShadow: 1,
              border: "1px solid #e0e0e0",
              mr: 4,
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" fontWeight={700} color="primary.main">
            Work Log Details
          </Typography>
        </Box>
      </Box>
      {/* Info Section */}
      <Grid
        container
        sx={{
          p: { xs: 1, md: 3 },
        }}
      >
        {infoCards.map((item, index) => (
          <Grid
            key={index}
            sx={{
              width: { xs: "100%", sm: "50%", lg: "33.33%" },
              p: 1,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: "linear-gradient(145deg, #f9fafc 0%, #ffffff 100%)",
                transition: "all 0.25s ease",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transform: "translateY(-3px)",
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                {item.icon}
                <Typography variant="subtitle2" color="text.secondary">
                  {item.label}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: item.color || "text.primary",
                }}
              >
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* Status Section */}
        <Grid size={{ xs: 12 }} pt={3}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" mb={1.5}>
              Work Log Status
            </Typography>

            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip
                label={`Status: ${workLog?.status || "N/A"}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`Approval: ${workLog?.approvalStatus || "Pending"}`}
                color={
                  workLog?.approvalStatus === "Approved"
                    ? "success"
                    : workLog?.approvalStatus === "Rejected"
                    ? "error"
                    : "warning"
                }
                variant="filled"
              />
              <Chip
                label={workLog?.isBillable ? "Billable" : "Non-billable"}
                color={workLog?.isBillable ? "success" : "default"}
                variant="outlined"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Description */}
        <Grid size={{ xs: 12 }} pt={3}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1.5 }}
            >
              Activity Description
            </Typography>
            <Typography
              variant="body1"
              sx={{
                wordBreak: "break-all",
                lineHeight: 1.7,
                whiteSpace: "pre-line",
                color: "text.primary",
              }}
            >
              {workLog?.description || "No description available."}
            </Typography>
          </Paper>
        </Grid>

        {/* Created At */}
        <Grid
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mt: 1, width: { xs: "100%" } }}
        >
          <Tooltip title={workLog?.attachments ? "View File" : "No File"}>
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="right"
              sx={{ mt: 2, fontSize: "0.8rem", letterSpacing: 0.3, mr: 2 }}
            >
              {workLog?.attachments ? "View Attachment" : "No Attachment"}
            </Typography>
            {!workLog?.attachments && (
              <IconButton
                sx={{
                  opacity: 0.6, // optional visual cue
                }}
              >
                <Visibility color="primary" />
              </IconButton>
            )}
            {workLog?.attachments && (
              <IconButton
                onClick={() => isImage && handleOpenImage(workLog?.attachments)}
                href={!isImage ? fileUrl : undefined}
                target={!isImage ? "_blank" : undefined}
              >
                <Visibility color="primary" />
              </IconButton>
            )}
          </Tooltip>

          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="right"
            sx={{
              mt: 2,
              fontSize: "0.8rem",
              letterSpacing: 0.3,
            }}
          >
            Created At:{" "}
            {formatDateTime(workLog?.createdAt, "datetime-sec") || "—"}
          </Typography>
        </Grid>
      </Grid>{" "}
      <ImagePreviewModal
        open={!!selectedImage}
        onClose={handleCloseImage}
        imageUrl={selectedImage}
        title="Worklog Preview"
      />
    </Paper>
  );
}

export default WorkLogDetails;
