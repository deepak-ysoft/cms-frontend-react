import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  Avatar,
  LinearProgress,
  Tooltip,
  Divider,
  Paper,
} from "@mui/material";
import {
  TaskAlt,
  HourglassBottom,
  ErrorOutline,
  AccessTime,
  Description,
} from "@mui/icons-material";
import { formatDateTime } from "../../utils/formatDateTime";

const MyRecentWorklogs = ({ myWorklogs = [] }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <TaskAlt />;
      case "Pending":
        return <HourglassBottom />;
      case "Rejected":
        return <ErrorOutline />;
      default:
        return <AccessTime />;
    }
  };

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
            fontWeight: 600,
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          🗓️ My Worklogs
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {myWorklogs?.length ? (
          <Grid container>
            {myWorklogs.map((day) => (
              <Grid
                sx={{
                  width: { xs: "100%", md: "100%", lg: "50%" },
                  px: { xs: 0, md: 2 },
                  py: { xs: 0.5, md: 2 },
                }}
                key={day.date}
              >
                <Paper
                  sx={{
                    minHeight: 295,
                    p: 2.5,
                    borderRadius: 3,
                    background: "#ffffff",
                    border: "1px solid #eef2f7",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Day Header */}
                  <Box mb={2}>
                    <Typography variant="h6" fontWeight={600}>
                      {formatDateTime(day.date)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Total Hours: <b>{day.totalHours}</b> | Approved Hours:{" "}
                      <b>{day.approvedHours}</b>
                    </Typography>

                    <Box mt={1}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.5, display: "block" }}
                      >
                        Daily Efficiency ({day.efficiency}%)
                      </Typography>

                      <LinearProgress
                        variant="determinate"
                        value={day.efficiency}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          bgcolor: "#f0f2f5",
                        }}
                        color={day.efficiency >= 80 ? "success" : "warning"}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Logs for the Day */}
                  <Box sx={{ pb: 1 }}>
                    {day.logs.map((log) => (
                      <Card
                        key={log._id}
                        variant="outlined"
                        sx={{
                          width: "100%",

                          px: { xs: 0.5, md: 2 },
                          py: { xs: 0.5, md: 1 },
                          borderRadius: 3,
                          background:
                            "linear-gradient(180deg, #ffffff, #f7f9fc)",
                          border: "1px solid #edf2f7",
                          flexShrink: 0,
                        }}
                      >
                        {/* Log Header */}
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1.5}
                          justifyContent={"space-between"}
                        >
                          <Box display={"flex"} alignItems="center" gap={1}>
                            <Avatar
                              sx={{
                                bgcolor:
                                  log.status === "Approved"
                                    ? "rgba(200, 255, 220, 0.8)"
                                    : log.status === "Pending"
                                    ? "rgba(255, 245, 200, 0.8)"
                                    : "rgba(255, 220, 220, 0.8)",
                                width: 42,
                                height: 42,
                                color:
                                  log.status === "Approved"
                                    ? "#2e7d32"
                                    : log.status === "Pending"
                                    ? "#ed6c02"
                                    : "#d32f2f",
                              }}
                            >
                              {getStatusIcon(log.status)}
                            </Avatar>

                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              color="text.primary"
                            >
                              {log.title}
                            </Typography>
                          </Box>
                          <Chip
                            label={log.status}
                            variant="outlined"
                            size="small"
                            sx={{
                              fontWeight: 500,
                              color:
                                log.status === "Approved"
                                  ? "#2e7d32"
                                  : log.status === "Pending"
                                  ? "#ed6c02"
                                  : "#d32f2f",
                              borderColor:
                                log.status === "Approved"
                                  ? "#b2f0c0"
                                  : log.status === "Pending"
                                  ? "#ffedb3"
                                  : "#ffcdd2",
                              bgcolor:
                                log.status === "Approved"
                                  ? "#ecfdf3"
                                  : log.status === "Pending"
                                  ? "#fffbea"
                                  : "#fff5f5",
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Hours: {log.hours}
                          </Typography>
                          <Box display={"flex"} alignItems="center" gap={1}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Project:
                            </Typography>
                            <Chip
                              label={log.projectName}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: "#e3f2fd",
                                bgcolor: "#f5faff",
                                color: "#1976d2",
                              }}
                            />
                          </Box>
                        </Box>

                        {/* Remark */}

                        {log.remarks && (
                          <Box mt={2}>
                            <Tooltip title="Remarks">
                              <Typography
                                variant="caption"
                                mt={1}
                                sx={{
                                  p: 0.7,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.7,
                                  borderRadius: 1,
                                  bgcolor: "#fafbfc",
                                  border: "1px solid #f0f2f5",
                                }}
                              >
                                <Description fontSize="small" color="action" />
                                {log.remarks}
                              </Typography>
                            </Tooltip>{" "}
                          </Box>
                        )}
                      </Card>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography textAlign="center" color="text.secondary" py={5}>
            No worklogs found.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MyRecentWorklogs;
