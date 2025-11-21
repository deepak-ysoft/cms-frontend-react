import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const DEPARTMENT_COLORS = {
  Frontend: "#4f96deff",
  Backend: "#bd5bcfff",
  Fullstack: "#ffb84eff",
  Mobile: "#7cf080ff",
  "UI/UX": "#ec847cff",
  DevOps: "#48d5e8ff",
  QA: "#e79c81ff",
};

export default function TeamPerformance({ performance }) {
  const [activeDept, setActiveDept] = useState(null);

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
          👨‍💻 Team Performance
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Grid container>
          <Grid sx={{ width: { xs: "100%", md: "100%", lg: "50%" } }}>
            <Typography variant="subtitle2" mb={1}>
              Department Utilization
            </Typography>

            <ResponsiveContainer width="100%" height={270}>
              <PieChart>
                <Pie
                  data={performance?.deptUtilization}
                  dataKey="count"
                  nameKey="_id"
                  outerRadius={100}
                  label
                  onMouseEnter={(_, index) =>
                    setActiveDept(performance?.deptUtilization[index]._id)
                  }
                  onMouseLeave={() => setActiveDept(null)}
                >
                  {performance?.deptUtilization.map((item, i) => {
                    const color = DEPARTMENT_COLORS[item._id] || "#ccc";
                    const isActive = activeDept === item._id;
                    return (
                      <Cell
                        key={item._id || i}
                        fill={color}
                        stroke={isActive ? "#979797ff" : "#fff"}
                        strokeWidth={isActive ? 2 : 1}
                        style={{
                          transform: isActive ? "scale(1.05)" : "scale(1)",
                          transformOrigin: "center",
                          transition: "transform 0.2s ease",
                          outline: "none", // ✅ removes square border
                          cursor: "pointer", // ✅ gives hover feel
                        }}
                      />
                    );
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Color Legend */}
            <Box
              mt={10}
              display="flex"
              flexWrap="wrap"
              gap={1.5}
              justifyContent="center"
            >
              {Object.entries(DEPARTMENT_COLORS).map(([dept, color]) => (
                <Box
                  key={dept}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{
                    backgroundColor:
                      activeDept === dept ? "rgba(25,118,210,0.1)" : "white",
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.5,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(25,118,210,0.1)",
                      transform: "scale(1.05)",
                    },
                  }}
                  onMouseEnter={() => setActiveDept(dept)}
                  onMouseLeave={() => setActiveDept(null)}
                >
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      backgroundColor: color,
                      borderRadius: "50%",
                      border:
                        activeDept === dept
                          ? "2px solid #1976d2"
                          : "1px solid #ccc",
                    }}
                  />
                  <Typography variant="body2" fontWeight={500}>
                    {dept}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Right side: developer info */}
          <Box
            sx={{
              width: { xs: "100%", md: "100%", lg: "50%" },
              mt: { xs: 2, lg: 0 },
            }}
          >
            <Grid
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "16px",
                p: 3,
                m: { xs: 0, md: 1 },
                background: "linear-gradient(145deg, #ffffff, #f9fafc)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              {/* Header */}
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 600,
                  color: "#1976d2",
                  mb: 1,
                }}
              >
                👩‍💻 Active Developers:
                <Typography
                  component="span"
                  sx={{ ml: 1, color: "#0d47a1", fontWeight: 700 }}
                >
                  {performance?.activeDevelopersCount || 0}
                </Typography>
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#374151",
                  mb: 2,
                }}
              >
                🏆 Top Developers
              </Typography>

              {/* If no data */}
              {(!performance?.topDevelopers ||
                performance.topDevelopers.length === 0) && (
                <Typography variant="body2" color="text.secondary">
                  No data available
                </Typography>
              )}

              {/* Top Developers List */}
              {performance?.topDevelopers?.map((dev, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1.8,
                    p: 1.5,
                    borderRadius: 2,
                    background:
                      "linear-gradient(90deg, rgba(25,118,210,0.05), rgba(255,255,255,0.9))",
                    boxShadow: "inset 0 0 4px rgba(25,118,210,0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, rgba(25,118,210,0.1), rgba(255,255,255,1))",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  {/* Left side (Avatar + Name) */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      src={dev?.profileImage ? `${dev.profileImage}` : ""}
                      alt={dev.name}
                      sx={{
                        width: 42,
                        height: 42,
                        bgcolor: `hsl(${i * 50}, 70%, 60%)`,
                        fontWeight: 600,
                        color: "white",
                      }}
                    >
                      {!dev?.profileImage && dev?.name?.[0]}
                    </Avatar>

                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {dev.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.85rem" }}
                      >
                        {dev.department || "—"} | {dev.totalHoursHHMM} hrs
                      </Typography>
                    </Box>
                  </Box>

                  {/* Right side (Progress bar) */}
                  <Box sx={{ width: "35%" }}>
                    <Box
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        backgroundColor: "#e0e0e0",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${dev.progressPercent || 0}%`,
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #1976d2, #42a5f5, #90caf9)",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", textAlign: "right", mt: 0.5 }}
                    >
                      {dev.progressPercent || 0}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Grid>
          </Box>
        </Grid>
      </CardContent>
    </Card>
  );
}
