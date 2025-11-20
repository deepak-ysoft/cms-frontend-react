import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Stack,
  Paper,
} from "@mui/material";
import {
  AssignmentTurnedIn,
  AccessTime,
  Star,
  Flag,
  CalendarToday,
} from "@mui/icons-material";
import MilestoneList from "./MilestoneList";

const SummaryCard = ({ icon, title, value, color }) => (
  <Paper
    elevation={2}
    sx={{
      p: 2,
      display: "flex",
      alignItems: "center",
      borderRadius: 3,
      height: "100%",
      background: `linear-gradient(145deg, ${color}22, ${color}11)`,
      border: `1px solid ${color}33`,
    }}
  >
    <Box
      sx={{
        bgcolor: `${color}22`,
        color,
        width: 48,
        height: 48,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mr: 2,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        fontWeight={500}
        mb={0.2}
      >
        {title}
      </Typography>
      <Typography variant="h6" fontWeight={700}>
        {value ?? 0}
      </Typography>
    </Box>
  </Paper>
);

export default function PersonalSummary({ summary = {} }) {
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
          📈 Personal Summary
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Summary Stats */}
        <Grid container spacing={2} mb={3}>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <SummaryCard
              title="Projects Worked"
              value={summary?.totalProjectsWorked}
              icon={<AssignmentTurnedIn />}
              color="#1976d2"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <SummaryCard
              title="Approved Hours"
              value={summary?.totalApprovedHours}
              icon={<AccessTime />}
              color="#43a047"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <SummaryCard
              title="Avg Rating"
              value={summary?.averageRating?.toFixed?.(1) ?? "0.0"}
              icon={<Star />}
              color="#fbc02d"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <SummaryCard
              title="Next Milestones"
              value={summary?.nextMilestones?.length}
              icon={<Flag />}
              color="#ef6c00"
            />
          </Grid>
        </Grid>

        {/* Next Milestones */}
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            color="text.primary"
            mb={1.5}
          >
            Upcoming Milestones
          </Typography>
          <MilestoneList summary={summary} />
        </Box>
      </CardContent>
    </Card>
  );
}
