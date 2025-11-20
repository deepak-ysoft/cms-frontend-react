import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Avatar,
  Chip,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  CalendarMonth,
  Person,
  AssignmentTurnedIn,
  RocketLaunch,
  TrendingUp,
} from "@mui/icons-material";

function MyProjectsSection({ myProjects = [] }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
        overflow: "hidden",
        p: { xs: 0, md: 2.5 },
        mt: 4,
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(245,247,250,0.8))",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 600,
            color: "#1976d2",
            textShadow: "0 0 6px rgba(25, 118, 210, 0.3)",
            letterSpacing: 0.5,
          }}
        >
          📂 My Projects
        </Typography>
        <Divider />
        <Grid container mt={2}>
          {myProjects?.length ? (
            myProjects.map((p) => (
              <Grid
                sx={{
                  px: { xs: 0, md: 2 },
                  py: { xs: 0.5, md: 2 },
                  width: { xs: "100%", sm: "100%", md: "50%", lg: "33.33%" },
                }}
                key={p._id}
              >
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    background:
                      "linear-gradient(135deg, #f8fbff 0%, #ffffff 100%)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent>
                    {/* Project Name */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <RocketLaunch color="primary" />
                      <Typography variant="h6" fontWeight={700}>
                        {p.name}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    {/* Manager */}
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Person fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {p.manager
                          ? `${p.manager.firstName} ${p.manager.lastName}`
                          : "No manager assigned"}
                      </Typography>
                    </Box>

                    {/* Status */}
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <AssignmentTurnedIn fontSize="small" color="action" />
                      <Chip
                        label={p.status || "N/A"}
                        color={
                          p.status === "Active"
                            ? "success"
                            : p.status === "On Hold"
                            ? "warning"
                            : p.status === "Completed"
                            ? "info"
                            : "default"
                        }
                        size="small"
                      />
                    </Box>

                    {/* Phase + Deadline */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Phase: <b>{p.phase || "—"}</b>
                      </Typography>
                      <Tooltip title="Project Deadline">
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <CalendarMonth
                            sx={{ fontSize: 18, color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {p.deadline
                              ? new Date(p.deadline).toLocaleDateString()
                              : "—"}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Box>

                    {/* Progress Bar */}
                    <Box mt={2}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        mb={0.5}
                      >
                        Progress
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={p.progress}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          backgroundColor: "#eef2f5",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 5,
                            background:
                              p.progress >= 100
                                ? "linear-gradient(90deg, #28a745, #8aff80)"
                                : "linear-gradient(90deg, #1976d2, #42a5f5)",
                          },
                        }}
                      />
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mt={0.5}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {p.progress}%
                        </Typography>
                        <TrendingUp
                          fontSize="small"
                          sx={{ color: "primary.main", opacity: 0.8 }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid size={{ xs: 12 }}>
              <Typography color="text.secondary" textAlign="center" py={4}>
                No assigned projects yet.
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default MyProjectsSection;
