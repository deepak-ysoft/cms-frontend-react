import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Badge,
  MenuItem,
  Menu,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import MailIcon from "@mui/icons-material/Mail";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { userProfile } from "../../../api/userApi";
import UserContext from "../../context/UserContext";
import WelcomeHeader from "../reusableComponent/WelcomeHeader";
import { Image_BASE_URL } from "../../../api/config";
import LogoutDialog from "../Logout";
import NotificationBell from "./NotificationBell";

export default function NavBar({ onToggleSidebar, open }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useContext(UserContext);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // Fetch user data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await userProfile();
      setUser(response.data);
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  };

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogoutClick = () => {
    handleMenuClose();
    setConfirmLogout(true);
  };

  const handleLogout = () => {
    setConfirmLogout(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/userProfile");
  };

  const menuId = "primary-profile-menu";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        elevation: 3,
        sx: {
          mt: 1.5,
          minWidth: 180,
          borderRadius: 2,
          bgcolor: "#fff",
          "& .MuiMenuItem-root": {
            px: 2,
            py: 1,
            fontSize: "0.9rem",
            color: "#333",
            "&:hover": {
              bgcolor: "rgba(0, 123, 255, 0.08)",
              color: "primary.main",
            },
          },
        },
      }}
    >
      <MenuItem onClick={handleProfile}>
        <PersonOutlineIcon
          sx={{ mr: 1, fontSize: 20, color: "primary.main" }}
        />
        Profile
      </MenuItem>

      <MenuItem onClick={handleLogoutClick}>
        <LogoutIcon sx={{ mr: 1, fontSize: 20, color: "error.main" }} />
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: " #e8f0ff",
          color: "#333",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="toggle sidebar"
            onClick={onToggleSidebar}
            sx={{
              mr: 2,
              transition: "transform 0.3s ease",
              transform: open ? "rotate(0deg)" : "rotate(180deg)",
            }}
          >
            {open ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton> */}

            <NotificationBell />

            <WelcomeHeader user={{ name: user?.firstName }} />

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar
                src={
                  user?.profileImage
                    ? `${Image_BASE_URL}${user?.profileImage}`
                    : ""
                }
                sx={{ color: "inherit", width: 32, height: 32 }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {renderMenu}

      {/* ✔ Professional Logout Dialog */}
      <LogoutDialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
      />
    </Box>
  );
}
