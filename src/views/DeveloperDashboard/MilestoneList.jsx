import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Stack,
  Chip,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import React from "react";

const phaseStyles = {
  Planning: {
    label: "Planning",
    color: "#0077ffff",
    bg: "rgba(21,101,192,0.1)",
  },
  Design: { label: "Design", color: "#2E7D32", bg: "rgba(46,125,50,0.1)" },
  Development: {
    label: "Development",
    color: "#155e88ff",
    bg: "rgba(2,119,189,0.1)",
  },
  Testing: { label: "Testing", color: "#F9A825", bg: "rgba(249,168,37,0.1)" },
  Deployment: {
    label: "Deployment",
    color: "#EF6C00",
    bg: "rgba(239,108,0,0.1)",
  },
  Maintenance: {
    label: "Maintenance",
    color: "#6D4C41",
    bg: "rgba(109,76,65,0.1)",
  },
};

export default function MilestoneList({ summary }) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  return summary?.nextMilestones?.length ? (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.06)",
        bgcolor: "#fff",
      }}
    >
      <List disablePadding>
        {summary.nextMilestones.map((m, idx) => {
          const phaseStyle = phaseStyles[m.milestone] || {
            color: "#455A64",
            bg: "rgba(69,90,100,0.1)",
          };

          return (
            <React.Fragment key={idx}>
              <ListItem
                sx={{
                  px: 3,
                  py: 2,
                  alignItems: "flex-start",
                  transition: "background 0.2s ease",
                  "&:hover": { bgcolor: "rgba(25,118,210,0.02)" },
                }}
              >
                <ListItemText
                  primary={
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box sx={{ width: "30%" }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{ color: "#1a237e" }}
                        >
                          {m.project}
                        </Typography>
                      </Box>
                      {!isSmall && (
                        <Box sx={{ width: "30%"}}>
                          <CalendarToday sx={{ fontSize: 14 }} />
                          <Typography variant="caption" ml={1}>
                            Due:{" "}
                            {new Date(m.dueDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ width: "40%",display:"flex", justifyContent:"end" }}>
                        <Chip
                          label={phaseStyle.label}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            color: phaseStyle.color,
                            bgcolor: phaseStyle.bg,
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    </Box>
                  }
                  secondary={
                    isSmall && (
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={0.6}
                        mt={0.8}
                        color="text.secondary"
                      >
                        <CalendarToday sx={{ fontSize: 14 }} />
                        <Typography variant="caption">
                          Due:{" "}
                          {new Date(m.dueDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                      </Stack>
                    )
                  }
                />
              </ListItem>
              {idx !== summary.nextMilestones.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  ) : (
    <Typography
      variant="body2"
      color="text.secondary"
      textAlign="center"
      sx={{ py: 2 }}
    >
      No upcoming milestones available.
    </Typography>
  );
}
