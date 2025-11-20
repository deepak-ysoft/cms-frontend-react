import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
} from "@mui/material";

export default function ProjectInsights({ projectInsights }) {
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
          📊 Project Insights
        </Typography>
        <Divider />
        <Grid container spacing={2} mt={2}>
          {projectInsights.map((p) => (
            <Grid
              key={p._id}
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  overflow: "hidden",
                  p: 2.5,
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(245,247,250,0.8))",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent>
                  <Typography fontWeight={600}>{p.name}</Typography>
                  <Chip
                    label={p.status}
                    color={getStatusColor(p.status)}
                    size="small"
                    sx={{ mt: 1, mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Manager: {p.managerDetails?.firstName}{" "}
                    {p.managerDetails?.lastName}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
function getStatusColor(status) {
  switch (status) {
    case "Active":
      return "primary";
    case "Completed":
      return "info";
    case "OnHold":
      return "warning";
    case "Cancelled":
      return "error";
    case "Pushed":
      return "secondary";
    default:
      return "default";
  }
}
