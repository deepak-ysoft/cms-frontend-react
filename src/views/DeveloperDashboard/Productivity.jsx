import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Paper,
  Box,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { BarChart2Icon } from "lucide-react";

const Productivity = ({ productivity }) => {
  const weeklyData = productivity?.weeklyHours || [];
  const monthlyData = productivity?.monthlyLogs || [];

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
          }}
        >
          📊 Productivity Overview
        </Typography>

        <Divider />

        {/* Summary Boxes */}
        <Grid container my={3}>
          <Grid
            sx={{
              width: { xs: "100%", md: "33%" },
              px: { xs: 0, md: 2 },
              my: { xs: 0.5, md: 0 },
            }}
          >
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Typography color="text.secondary">
                Average Daily Hours
              </Typography>
              <Typography variant="h5" fontWeight={700} color="#1976d2">
                {productivity?.averageDailyHours || 0} hrs
              </Typography>
            </Paper>
          </Grid>

          <Grid
            sx={{
              width: { xs: "100%", md: "33%" },
              px: { xs: 0, md: 2 },
              my: { xs: 0.5, md: 0 },
            }}
          >
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Typography color="text.secondary">
                Approved Hours (Month)
              </Typography>
              <Typography variant="h5" fontWeight={700} color="#4caf50">
                {productivity?.avgApprovedMonthlyHours || "0.00"} hrs
              </Typography>
            </Paper>
          </Grid>

          <Grid
            sx={{
              width: { xs: "100%", md: "33%" },
              px: { xs: 0, md: 2 },
              my: { xs: 0.5, md: 0 },
            }}
          >
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Typography color="text.secondary">
                Pending Hours (Month)
              </Typography>
              <Typography variant="h5" fontWeight={700} color="#ff9800">
                {productivity?.avgPendingMonthlyHours || "0.00"} hrs
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container>
          {/* Weekly Chart */}
          <Grid
            sx={{
              width: { xs: "100%", lg: "50%" },
              px: { xs: 0, md: 2 },
              my: { xs: 1, md: 0 },
            }}
          >
            <Paper sx={{ p: 2.5, height: 320, borderRadius: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
                Weekly Hours
              </Typography>

              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="decimal"
                    fill="#1976d2"
                    name="Hours"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Monthly Chart */}
          <Grid
            sx={{
              width: { xs: "100%", lg: "50%" },
              px: { xs: 0, md: 2 },
              my: { xs: 1, md: 0 },
            }}
          >
            <Paper sx={{ p: 2.5, height: 320, borderRadius: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
                Monthly Logs
              </Typography>

              {monthlyData.some(
                (m) => m.approvedDecimal > 0 || m.pendingDecimal > 0
              ) ? (
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    <Bar
                      dataKey="approvedDecimal"
                      fill="#4caf50"
                      name="Approved"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="pendingDecimal"
                      fill="#ff9800"
                      name="Pending"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    opacity: 0.6,
                  }}
                >
                  <BarChart2Icon size={44} />
                  <Typography>No log data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Productivity;
