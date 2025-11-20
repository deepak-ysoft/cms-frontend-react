import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Group as UsersIcon,
  Work as ProjectIcon,
  Assignment as ContractIcon,
  Receipt as InvoiceIcon,
  MonetizationOn as RevenueIcon,
} from "@mui/icons-material";
import { getAdminDashboard } from "../../api/dashboardApi";
import OverviewCard from "../../shared/components/reusableComponent/OverviewCard";
import FinancialAnalytics from "./FinancialAnalytics";
import RecentActivity from "./RecentActivity";
import TeamPerformance from "./TeamPerformance";
import ProjectInsights from "./ProjectInsights";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getAdminDashboard();
      if (res.isSuccess) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!data)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );

  const { overview, projectInsights, performance, financials, activityFeed } =
    data;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        p: { xs: 1, md: 5 },
        backgroundColor: "#f9fafc",
      }}
    >
      {/* OVERVIEW CARDS */}
      <Grid container spacing={2} mb={3}>
        <OverviewCard
          icon={<UsersIcon />}
          title="Total Users"
          value={overview?.totalUsers}
          subtitleData={overview?.userByRole || []}
        />

        <OverviewCard
          icon={<ProjectIcon />}
          title="Projects"
          value={overview?.totalProjects}
          subtitleData={overview?.projectStatus || []}
        />
        <OverviewCard
          icon={<ContractIcon />}
          title="Contracts"
          value={overview?.totalContracts}
          subtitleData={overview?.contractStatus || []}
        />
        <OverviewCard
          icon={<InvoiceIcon />}
          title="Invoices"
          value={overview?.invoiceStatus.reduce((a, b) => a + b.count, 0)}
          subtitleData={overview?.invoiceStatus || []}
        />
        {role === "Admin" && (
          <OverviewCard
            icon={<RevenueIcon />}
            title="Revenue"
            value={`₹${overview?.revenue?.paidAmount?.toLocaleString() || 0}`}
            subtitleData={[
              {
                _id: "Outstanding:",
                count: `₹${
                  overview?.revenue?.outstanding?.toLocaleString() || 0
                }`,
              },
            ]}
          />
        )}
      </Grid>

      {/* PROJECT INSIGHTS */}
      <ProjectInsights projectInsights={projectInsights} />

      {/* TEAM PERFORMANCE */}
      <TeamPerformance performance={performance} />

      {/* FINANCIAL ANALYTICS */}
      {role === "Admin" && <FinancialAnalytics financials={financials} />}

      {/* ACTIVITY FEED */}
      <RecentActivity activityFeed={activityFeed} />
    </Box>
  );
}

// 🧩 Activity Feed Section
function FeedList({ title, data, renderItem }) {
  return (
    <Grid sx={{ width: { xs: "100%", md: "31%" } }}>
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 1 }} />
      {data?.length ? (
        data.map((item) => (
          <Typography key={item._id} variant="body2" sx={{ mb: 0.5 }}>
            {renderItem(item)}
          </Typography>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No recent activity
        </Typography>
      )}
    </Grid>
  );
}

// Helper for color
