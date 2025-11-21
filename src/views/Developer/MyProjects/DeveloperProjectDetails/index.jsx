import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  CircularProgress,
  IconButton,
  Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getDeveloperProjectDetails } from "../../../../api/ProjectApi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { formatDateTime } from "../../../../utils/formatDateTime";

const DeveloperProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await getDeveloperProjectDetails(id);
      if (response.success) setProject(response.data);
    } catch (err) {
      console.error("Error fetching project details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <CircularProgress />
      </Box>
    );

  if (!project)
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="error">
          Project not found or you don't have access.
        </Typography>
      </Box>
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pushed":
        return "warning";
      default:
        return "primary";
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 1, md: 5 },
        backgroundColor: "#f9fafc",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          borderRadius: 3,
          background: "#fff",
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          borderBottom="1px solid #e0e0e0"
          p={3}
          sx={{
            background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
            borderTopLeftRadius: 8,
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: "#fff",
              boxShadow: 1,
              border: "1px solid #e0e0e0",
              mr: 2,
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <IoMdArrowRoundBack size={22} />
          </IconButton>

          <Typography variant="h6" fontWeight={700} color="primary.main" pl={3}>
            Project Details
          </Typography>
        </Box>

        {/* Main content */}
        <Box sx={{ p: { xs: 1, sm: 4 } }}>
          {/* Project Info */}

          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              p: { xs: 1, sm: 3 },
              mb: 4,
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)", // ✅ inner shadow
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // ✅ outer shadow on hover
              },
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{
                p: 1,
                background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
                color: "primary.main",
                borderTopLeftRadius: 8,
              }}
              mb={2}
            >
              <Box pl={3}>Project Information</Box>
            </Typography>
            <Grid container spacing={2} p={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Project Name
                </Typography>
                <Typography variant="body1" component="div" fontWeight={600}>
                  {project.name}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={project.status}
                  color={getStatusColor(project.status)}
                  variant="outlined"
                  size="small"
                  sx={{ fontWeight: 600, mt: 0.5 }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created On
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {formatDateTime(project.createdAt, "datetime-sec")}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {project.description || "No description provided."}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Manager Info */}

          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              p: { xs: 1, sm: 3 },
              mb: 4,
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)", // ✅ inner shadow
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // ✅ outer shadow on hover
              },
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{
                p: 1,
                background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
                color: "primary.main",
                borderTopLeftRadius: 8,
              }}
              mb={2}
            >
              <Box pl={3}>Project Manager</Box>
            </Typography>
            {project.manager ? (
              <Box
                display="flex"
                alignItems="center"
                flexDirection={{ xs: "column", sm: "row" }}
                gap={2}
                p={2}
                textAlign={{ xs: "center", sm: "left" }}
              >
                <Avatar
                  src={project.manager.image ? `${project.manager.image}` : ""}
                  alt={project.manager.name}
                  sx={{ width: 60, height: 60 }}
                />
                <Box sx={{ wordBreak: "break-word" }}>
                  <Typography variant="body1" component="div" fontWeight={600}>
                    {project.manager.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ wordBreak: "break-all" }}
                  >
                    {project.manager.email}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No manager assigned.
              </Typography>
            )}
          </Paper>

          {/* Developers */}

          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              p: { xs: 1, sm: 3 },
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)", // ✅ inner shadow
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // ✅ outer shadow on hover
              },
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{
                p: 1,
                background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
                color: "primary.main",
                borderTopLeftRadius: 8,
              }}
              mb={2}
            >
              <Box pl={3}>Assigned Developers</Box>
            </Typography>
            {project.developers.length > 0 ? (
              <Grid container>
                {project.developers.map((dev) => (
                  <Grid
                    sx={{
                      width: { xs: "100%", md: "50%", lg: "33.33%" },
                      p: 1,
                    }}
                    key={dev.id}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        border: "1px solid #eee",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: "center",
                        gap: 1.5,
                        bgcolor: "#fff",
                        "&:hover": { boxShadow: 2 },
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      <Avatar
                        src={dev.image ? `${dev.image}` : ""}
                        alt={dev.name}
                      />
                      <Box sx={{ wordBreak: "break-word" }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {dev.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            wordBreak: "break-all",
                            display: "block",
                            maxWidth: "100%",
                          }}
                        >
                          {dev.email}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="text.secondary">
                No developers assigned.
              </Typography>
            )}
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
};

export default DeveloperProjectDetails;
