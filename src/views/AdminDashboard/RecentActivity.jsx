import React from "react";
import {
  CardContent,
  Typography,
  Grid,
  Box,
  Divider,
  Avatar,
  Stack,
  Card,
} from "@mui/material";
import { motion } from "framer-motion";
import { UserPlus, FileText, FolderGit2 } from "lucide-react"; // icons for each category

const MotionBox = motion.create(Box);

const iconMap = {
  "New Users": <UserPlus size={18} color="#1976d2" />,
  "Projects Updated": <FolderGit2 size={18} color="#0288d1" />,
  Invoices: <FileText size={18} color="#2e7d32" />,
};

export default function RecentActivity({ activityFeed }) {
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
          🕒 Recent Activity
        </Typography>
        <Divider />
        <Grid container mt={2}>
          <FeedList
            title="New Users"
            icon={iconMap["New Users"]}
            data={activityFeed?.recentUsers}
            renderItem={(u) => `${u.firstName} ${u.lastName} (${u.role})`}
          />
          <FeedList
            title="Projects Updated"
            icon={iconMap["Projects Updated"]}
            data={activityFeed?.recentProjects}
            renderItem={(p) => `${p.name} (${p.status})`}
          />
          <FeedList
            title="Invoices"
            icon={iconMap["Invoices"]}
            data={activityFeed?.recentInvoices}
            renderItem={(i) =>
              `${i.invoiceNumber} — ${i.status} ₹${i.amount.toLocaleString()}`
            }
          />
        </Grid>
      </CardContent>
    </Card>
  );
}

// 🧩 FeedList Component
function FeedList({ title, data, renderItem, icon }) {
  return (
    <Grid sx={{ width: { xs: "100%", md: "33.33%" }, mt: { xs: 3, lg: 0 } }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={1} mx={2}>
        <Avatar
          sx={{
            bgcolor: "rgba(25, 118, 210, 0.1)",
            width: 28,
            height: 28,
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
      </Stack>

      <Divider sx={{ mb: 1 }} />

      {data?.length ? (
        <Stack spacing={1} mx={2}>
          {data.map((item, index) => (
            <MotionBox
              key={item._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              sx={{
                p: 1.2,
                borderRadius: 2,
                backgroundColor:
                  index % 2 === 0
                    ? "rgba(25, 118, 210, 0.05)"
                    : "rgba(25, 118, 210, 0.02)",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: 13, color: "text.primary" }}
              >
                {renderItem(item)}
              </Typography>
            </MotionBox>
          ))}
        </Stack>
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic", mt: 1 }}
        >
          No recent activity
        </Typography>
      )}
    </Grid>
  );
}
