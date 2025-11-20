import React from "react";
import {
  CardContent,
  Typography,
  Grid,
  Box,
  Stack,
  Chip,
  Card,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const FinancialAnalytics = ({ financials }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  // ✅ Adapted to new backend format
  const monthlyRevenueData = (financials?.monthlyRevenue || [])
    .filter((item) => item.total > 0)
    .map((item) => ({
      name: item?.month,
      total: item?.total,
    }));
  const topClients = financials?.topClients || [];
  const contracts = financials?.soonEndingContracts || [];

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
          💰 Financial Analytics
        </Typography>
        <Divider />
        <Grid container mt={2}>
          {/* 💼 Financial Summary */}
          <Grid
            sx={{
              width: { xs: "100%", md: "100%", lg: "30%" },
            }}
            border="1px solid #e8e8e8ff"
            p={2}
            borderRadius={5}
          >
            <Stack spacing={2}>
              {/* Outstanding Payments */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Outstanding Payments
                </Typography>
                <Typography
                  variant="h6"
                  color="error.main"
                  fontWeight={600}
                  sx={{ mt: 0.5 }}
                >
                  ₹{financials?.outstandingPayments?.toLocaleString() || 0}
                </Typography>
              </Box>

              {/* 🏆 Top Clients */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  Top Clients
                </Typography>
                {topClients.length > 0 ? (
                  topClients.map((client) => (
                    <Chip
                      key={client._id}
                      label={`${
                        client._id
                      }: ₹${client.totalPaid.toLocaleString()}`}
                      sx={{
                        m: 0.3,
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                        color: "#1976d2",
                        fontWeight: 500,
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No client data available
                  </Typography>
                )}
              </Box>

              <Divider />

              {/* 📅 Contracts Ending Soon */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  Contracts Ending Soon
                </Typography>
                {contracts.length > 0 ? (
                  <Stack spacing={0.5}>
                    {contracts.map((c) => (
                      <Box
                        key={c._id}
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          backgroundColor:
                            c.status === "Active"
                              ? "rgba(46, 204, 113, 0.08)"
                              : "rgba(231, 76, 60, 0.08)",
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="text.primary"
                        >
                          {c.contractName} — {c.project?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Ends:{" "}
                          {new Date(c.endDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          | {c.currency} | {c.billingType}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No contracts ending soon
                  </Typography>
                )}
              </Box>
            </Stack>
          </Grid>

          {/* 📊 Monthly Revenue Chart */}
          <Grid
            sx={{
              width: { xs: "100%", md: "100%", lg: "70%" },
              mt: { xs: 3, lg: 0 },
            }}
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1, ml: 2 }}
            >
              Monthly Revenue
            </Typography>

            {monthlyRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  data={monthlyRevenueData}
                  margin={
                    !isSmall
                      ? { top: 30, right: 0, left: 50, bottom: 0 }
                      : { top: 0, right: 0, left: 0, bottom: 0 }
                  }
                >
                  <CartesianGrid strokeDasharray="3 4" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[0, (dataMax) => dataMax * 1.2]} // ✅ 20% top padding
                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value) => `₹${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Bar
                    dataKey="total"
                    fill="#1976d2"
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No revenue data available
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FinancialAnalytics;
