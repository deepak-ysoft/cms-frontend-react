import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  List,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Card,
  CircularProgress,
  ListItemButton,
  Grid,
  useTheme,
  useMediaQuery,
  CardContent,
  CardActions,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import {
  getNotifications,
  markNotificationRead,
} from "../../api/notifications";
import { useSocket } from "../../shared/context/SocketContext";
import UserContext from "../../shared/context/UserContext";
import SendNotificationModal from "./SendNotificationModal";
import { Link, useLocation } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { SendIcon, SettingsIcon } from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// --------------------------------------------------------
// Custom styled Card component for a clean, uniform design
// --------------------------------------------------------
const StyledCard = ({ children, sx, ...props }) => (
  <Card
    elevation={4} // Increased shadow for professional depth
    sx={{
      borderRadius: 2, // Slightly rounded corners
      ...sx,
    }}
    {...props}
  >
    {children}
  </Card>
);

export default function NotificationsPage() {
  const { notifications, setNotifications, markAsReadLocal } = useSocket();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [openSend, setOpenSend] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Using 'md' for clearer mobile/desktop split
  const [showDetails, setShowDetails] = useState(false);

  const userId = user?._id;
  const query = useQuery();
  const selectedIdFromUrl = query.get("selected");

  // Load notifications (Effect remains the same)
  useEffect(() => {
    if (!userId) return;

    async function load() {
      setLoading(true);
      try {
        const data = await getNotifications(userId);
        setNotifications(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId, setNotifications]);

  // Auto-select notification from URL (Effect remains the same)
  useEffect(() => {
    if (!loading && selectedIdFromUrl && notifications.length > 0) {
      const found = notifications.find((n) => n._id === selectedIdFromUrl);
      if (found) {
        setSelected(found);
        if (!found.isRead) {
          markNotificationRead(found._id, userId);
          markAsReadLocal(found._id);
        }
        if (isMobile) {
          setShowDetails(true);
        }
      }
    }
  }, [
    loading,
    selectedIdFromUrl,
    notifications,
    isMobile,
    markAsReadLocal,
    userId,
  ]);

  const handleSelect = async (n) => {
    setSelected(n);

    if (!n.isRead) {
      await markNotificationRead(n._id, userId);
      markAsReadLocal(n._id);
    }

    if (isMobile) {
      setShowDetails(true);
    }
  };

  console.log("selected", selected);
  // --------------------------------------------------------
  // LEFT PANEL: Notification List Component
  // --------------------------------------------------------
  const NotificationListComponent = (
    <StyledCard
      sx={{
        // Enforce the height for a desktop mail-client look
        height: isMobile ? "auto" : "calc(100vh - 150px)",
        // Use requested responsive styling pattern
        width: { xs: "100%", md: "100%" },
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            p: 2,
            borderBottom: "1px solid #eee",
            background: theme.palette.grey[50],
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}
          >
            <MailOutlineIcon
              sx={{ mr: 1, color: theme.palette.primary.main }}
            />{" "}
            Inbox
          </Typography>

          <IconButton
            title="Send Notification"
            color="primary"
            size="small"
            onClick={() => setOpenSend(true)}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <List
            sx={{
              maxHeight: isMobile ? 400 : "calc(100vh - 200px)",
              overflowY: "auto",
              p: 0,
            }}
          >
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <React.Fragment key={n._id}>
                  <ListItemButton
                    onClick={() => handleSelect(n)}
                    sx={{
                      py: 1.5,
                      // Highlight selected item clearly
                      background:
                        selected?._id === n._id
                          ? theme.palette.primary.light + "1a" // Light primary background
                          : n.isRead
                          ? theme.palette.background.paper
                          : theme.palette.info.light + "10", // Very light info color for unread
                      borderLeft:
                        selected?._id === n._id
                          ? `4px solid ${theme.palette.primary.main}`
                          : "4px solid transparent",
                      "&:hover": {
                        backgroundColor:
                          selected?._id === n._id
                            ? theme.palette.primary.light + "2a"
                            : theme.palette.action.hover,
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={
                          n.type !== "system" && n.sender?.profileImage
                            ? `${n.sender?.profileImage}`
                            : ""
                        }
                      >
                        {n.type === "system" && <SettingsIcon />}
                      </Avatar>
                    </ListItemAvatar>

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        noWrap
                        sx={{
                          fontWeight: n.isRead ? 400 : 600,
                          fontSize: 15,
                        }}
                      >
                        {n.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(n.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </ListItemButton>

                  <Divider component="li" variant="inset" sx={{ ml: 8 }} />
                </React.Fragment>
              ))
            ) : (
              <Typography
                sx={{ p: 3, textAlign: "center", color: "text.secondary" }}
              >
                All clear! No notifications.
              </Typography>
            )}
          </List>
        )}
      </CardContent>
    </StyledCard>
  );

  // --------------------------------------------------------
  // RIGHT PANEL: Notification Details Component
  // --------------------------------------------------------
  const NotificationDetailsComponent = (
    <StyledCard
      sx={{
        height: isMobile ? "auto" : "calc(100vh - 150px)",
        overflowY: "auto",
        // Use requested responsive styling pattern
        width: { xs: "100%", md: "100%" },
      }}
    >
      {isMobile && selected && (
        <CardActions sx={{ borderBottom: "1px solid #eee" }}>
          <Button
            size="small"
            onClick={() => setShowDetails(false)}
            startIcon={<ArrowBackIosIcon fontSize="small" />}
          >
            Back to Inbox
          </Button>
        </CardActions>
      )}
      <CardContent sx={{ p: 4, height: "100%" }}>
        {selected ? (
          <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {selected.title}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Avatar
                src={
                  selected.type !== "system" && selected.sender?.profileImage
                    ? `${selected.sender.profileImage}`
                    : ""
                }
              >
                {selected.type === "system" && <SettingsIcon />}
              </Avatar>

              <Box>
                {selected.type === "system" ? (
                  <Typography variant="body2" fontWeight={500}>
                    System
                  </Typography>
                ) : (
                  <Typography variant="body2" fontWeight={500}>
                    {`${selected.sender?.firstName} ${selected.sender?.lastName}`}{" "}
                    ( {selected.sender?.role || ""} )
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  {new Date(selected.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Typography
              variant="body1"
              sx={{ whiteSpace: "pre-line", lineHeight: 1.7 }}
            >
              {selected.message}
            </Typography>

            {selected.meta?.projectId && (
              <Box
                sx={{
                  mt: 4,
                  pt: 3,
                  borderTop: "2px solid",
                  borderColor: theme.palette.grey[200],
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Related Action:
                </Typography>
                <Link
                  to={`/projects/ProjectDetails/${selected.meta.projectId}`}
                >
                  View Project Details
                </Link>
              </Box>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              minHeight: 250,
              p: 3,
            }}
          >
            <MailOutlineIcon
              sx={{ fontSize: 60, color: theme.palette.grey[300], mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" textAlign="center">
              Start by selecting a message from the inbox.
            </Typography>
            <Typography
              variant="body2"
              color="text.disabled"
              textAlign="center"
            >
              Your message history will appear here.
            </Typography>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );

  return (
    // Outer container for padding and background
    <Box
      sx={{
        p: { xs: 1, md: 4 },
      }}
    >
      <Grid container sx={{ boxShadow: 1, borderRadius: 3 }}>
        {/* LEFT COLUMN (Notification List) */}
        <Grid
          // 3/12 width on large screens and up for a classic email client feel
          sx={{
            display: isMobile && showDetails ? "none" : "block",
            width: { xs: "100%", md: "40%", lg: "30%" },
            p: 1,
          }}
        >
          {NotificationListComponent}
        </Grid>

        {/* RIGHT COLUMN (Notification Details) */}
        <Grid
          sx={{
            display: isMobile && !showDetails ? "none" : "block",
            width: { xs: "100%", md: "60%", lg: "70%" },
            p: 1,
          }}
        >
          {NotificationDetailsComponent}
        </Grid>
      </Grid>

      <SendNotificationModal
        open={openSend}
        onClose={() => setOpenSend(false)}
      />
    </Box>
  );
}
