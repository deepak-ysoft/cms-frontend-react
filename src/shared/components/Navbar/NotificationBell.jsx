// /src/components/common/NotificationBell.jsx
import React, { useContext, useEffect, useState } from "react";
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { useSocket } from "../../context/SocketContext";
import {
  markNotificationRead,
  markAllRead,
  getNotifications,
} from "../../../api/notifications";
import UserContext from "../../context/UserContext";
import { SettingsIcon } from "lucide-react";

export default function NotificationBell() {
  const { user } = useContext(UserContext);
  const { notifications, setNotifications, markAsReadLocal } = useSocket();
  const [anchorEl, setAnchorEl] = useState(null);

  // LOAD NOTIFICATIONS ON ANY PAGE
  useEffect(() => {
    if (!user?._id) return;

    async function load() {
      try {
        const data = await getNotifications(user._id);
        setNotifications(data);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    }

    load();
  }, [user?._id]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const open = Boolean(anchorEl);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // 🔹 When clicking a notification
  const handleClickNotification = async (n) => {
    try {
      if (!n.isRead) {
        await markNotificationRead(n._id, user?._id);
        markAsReadLocal(n._id);
      }
    } catch (err) {
      console.error("Mark read error", err);
    }

    // always go to NotificationsPage with selected ID
    window.location.href = `/notifications?selected=${n._id}`;
  };

  // 🔹 Mark all as read
  const handleMarkAll = async () => {
    try {
      await markAllRead(user?._id);
      notifications.forEach((n) => markAsReadLocal(n._id));
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  return (
    <>
      <IconButton size="large" color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 360, height: 492 } }}
      >
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle1">Notifications</Typography>
        </Box>
        <Divider />

        {/* LIST */}
        <List
          sx={{
            height: 400,
            overflowY: "auto",
          }}
        >
          {notifications.length === 0 && (
            <ListItem>
              <ListItemText primary="No notifications" />
            </ListItem>
          )}

          {notifications.map((n) => (
            <ListItem
              button
              key={n._id}
              onClick={() => handleClickNotification(n)}
              sx={{
                bgcolor: n.isRead ? "transparent" : "rgba(0,0,0,0.05)",
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={
                    n.type !== "system" && n.sender?.profileImage
                      ? `${n.sender.profileImage}`
                      : ""
                  }
                >
                  {n.type === "system" && <SettingsIcon />}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Typography variant="subtitle2">
                    {n.title}
                    <Typography
                      variant="caption"
                      sx={{ display: "block", color: "text.secondary" }}
                    >
                      {new Date(n.createdAt).toLocaleString()}
                    </Typography>
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        {/* FOOTER BUTTONS */}
        <Box sx={{ p: 1, display: "flex", justifyContent: "space-between" }}>
          <Button size="small" onClick={handleMarkAll}>
            Mark all read
          </Button>
          <Button
            size="small"
            onClick={() => (window.location.href = "/notifications")}
          >
            View all
          </Button>
        </Box>
      </Popover>
    </>
  );
}
