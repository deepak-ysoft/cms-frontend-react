import * as React from "react";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import NotificationsIcon from "@mui/icons-material/Notifications";

const drawerWidthOpen = 280;
const drawerWidthClosed = 70;

export default function SideBar({ open, onClose, isSmall = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role");

  const menuItems = [
    // Admin and Project Manager Menu Items
    ...(role === "Admin" || role === "Project Manager"
      ? [{ text: "Home", icon: <DashboardIcon />, route: "/adminDashboard" }]
      : []),
    ...(role === "Admin" || role === "Project Manager"
      ? [{ text: "User Management", icon: <GroupIcon />, route: "/userList" }]
      : []),
    ...(role === "Admin" || role === "Project Manager"
      ? [{ text: "Project Management", icon: <WorkIcon />, route: "/projects" }]
      : []),
    ...(role === "Admin" || role === "Project Manager"
      ? [
          {
            text: "Contracts",
            icon: <DescriptionIcon />,
            route: "/contracts",
          },
        ]
      : []),
    ...(role === "Admin" || role === "Project Manager"
      ? [
          {
            text: "Invoices",
            icon: <ReceiptLongIcon />,
            route: "/invocies",
          },
        ]
      : []),

    // Developer-specific Nav Items
    ...(role === "Developer"
      ? [
          {
            text: "Home",
            icon: <DashboardIcon />,
            route: "/developerDashboard",
          },
        ]
      : []),
    ...(role === "Developer"
      ? [
          {
            text: "My Projects",
            icon: <AssignmentIcon />, // More relevant icon for projects
            route: "/developer/projects",
          },
        ]
      : []),
    ...(role === "Developer"
      ? [
          {
            text: "Work Logs",
            icon: <AssignmentIndIcon />, // Represents work logs/assignments
            route: "/developer/workLogs",
          },
        ]
      : []),
    {
      text: "Notifications",
      icon: <NotificationsIcon />,
      route: "/notifications",
    },
  ];

  const handleNavigation = (route) => {
    navigate(route);
    if (isSmall && onClose) onClose(); // Auto-close sidebar on mobile after selecting
  };

  const DrawerList = (
    <Box
      sx={{
        width: open ? drawerWidthOpen : drawerWidthClosed,
        overflowX: "hidden",
        height: "100%",
        borderRight: "2px solid #e4ecfcff",
      }}
    >
      {/* Title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 64,
          borderBottom: "2px solid #e4ecfcff",
          background: " #e8f0ff",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            fontSize: open ? "1.2rem" : "1.5rem",
            transition: "all 0.3s ease",
          }}
        >
          CRM
        </Typography>
      </Box>

      {/* Menu Items */}
      <Box sx={{ mt: 1, px: open ? 2 : 1 }}>
        <List disablePadding>
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.route ||
              location.pathname.startsWith(item.route + "/") ||
              matchPath({ path: item.route + "/*" }, location.pathname);

            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.route)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: open ? 2.5 : 1.5,
                    borderRadius: 1.5,
                    bgcolor: isActive
                      ? "rgba(0, 123, 255, 0.1)"
                      : "transparent",
                    color: isActive ? "primary.main" : "rgba(0, 0, 0, 0.7)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "rgba(0, 123, 255, 0.08)",
                      color: "primary.main",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2.5 : "auto",
                      justifyContent: "center",
                      color: isActive ? "primary.main" : "rgba(0, 0, 0, 0.6)",
                      transition: "color 0.3s ease, margin 0.3s ease",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {open && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? "bold" : "normal",
                        fontSize: "0.95rem",
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Divider sx={{ my: 1, borderColor: "transparent" }} />
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isSmall ? "temporary" : "permanent"}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // ✅ smoother open on mobile
      }}
      sx={{
        width: open ? drawerWidthOpen : drawerWidthClosed,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: open ? drawerWidthOpen : drawerWidthClosed,
          transition: "width 0.3s ease",
          boxSizing: "border-box",
          overflowX: "hidden",
          bgcolor: "#f9f9f9",
          boxShadow: isSmall ? "0px 4px 12px rgba(0,0,0,0.2)" : "none",
          border: "none",
        },
      }}
    >
      {DrawerList}
    </Drawer>
  );
}
