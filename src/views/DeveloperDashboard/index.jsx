import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import {
  Work as WorkIcon,
  AccessTime as TimeIcon,
  DoneAll as DoneIcon,
  PendingActions as PendingIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { getDeveloperDashboard } from "../../api/dashboardApi";
import MyProjectsSection from "./MyProjectsSection";
import MyRecentWorklogs from "./MyRecentWorklogs";
import Productivity from "./Productivity";
import PersonalSummary from "./SummaryCard";
import DevOverviewCard from "../../shared/components/reusableComponent/OverviewCard/DevOverviewCard";

const DeveloperDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDeveloperDashboard();
        if (res.isSuccess) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
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

  const {
    overview,
    myProjects,
    myWorklogs,
    productivity,
    notifications,
    summary,
  } = data || {};

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        p: { xs: 1.5, md: 5 },
        backgroundColor: "#f9fafc",
      }}
    >
      {/* --- Overview Cards --- */}
      <Grid container mb={3}>
        <DevOverviewCard
          icon={<WorkIcon />}
          title="Assigned Projects"
          value={overview?.assignedProjectsCount}
        />

        <DevOverviewCard
          icon={<TimeIcon />}
          title="Hours Logged"
          value={`${overview?.hoursLogged.thisWeek}h / ${overview?.hoursLogged.thisMonth}h`}
          subtitleData={[
            {
              _id: "(This Week / Month)",
            },
          ]}
        />
        <DevOverviewCard
          icon={<DoneIcon />}
          title="Approved Logs"
          value={overview?.logsStatus.approved}
          subtitleData={[
            {
              _id: "Pending:",
              count: `${overview?.logsStatus.pending || ""}`,
            },
          ]}
        />
        <DevOverviewCard
          icon={<MoneyIcon />}
          title="Billable Hours"
          value={overview?.billable.billableHours}
          subtitleData={[
            {
              _id: "Non-Billable:",
              count: `${overview?.billable.nonBillableHours || ""}`,
            },
          ]}
        />
      </Grid>
      {/* --- My Projects --- */}
      <MyProjectsSection myProjects={myProjects} />
      {/* --- Worklogs --- */}
      <MyRecentWorklogs myWorklogs={myWorklogs} />
      {/* --- Productivity Charts --- */}
      <Productivity productivity={productivity} />
      {/* --- Notifications --- */}{" "}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
          p: 2.5,
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
            🔔 Notifications
          </Typography>
          <Paper sx={{ p: 2, mb: 3 }}>
            {notifications?.length ? (
              <List>
                {notifications.map((n) => (
                  <React.Fragment key={n._id}>
                    <ListItem>
                      <NotificationsIcon color="primary" sx={{ mr: 1 }} />
                      <ListItemText
                        primary={n.message}
                        secondary={new Date(n.createdAt).toLocaleString()}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">
                No notifications available.
              </Typography>
            )}
          </Paper>
        </CardContent>
      </Card>
      {/* --- Personal Summary --- */}
      <PersonalSummary summary={summary} />
    </Box>
  );
};

// --- Reusable Components ---

const SectionTitle = ({ title }) => (
  <Typography variant="h6" fontWeight={600} mb={1} mt={2}>
    {title}
  </Typography>
);

const SummaryCard = ({ title, value }) => (
  <Card elevation={1} sx={{ p: 2 }}>
    <Typography variant="h6" fontWeight={600}>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {title}
    </Typography>
  </Card>
);

export default DeveloperDashboard;
