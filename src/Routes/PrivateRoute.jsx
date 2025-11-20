import { Outlet, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import NavBar from "../shared/components/Navbar";
import SideBar from "../shared/components/SideBar";

export default function PrivateRoute() {
  const [isValid, setIsValid] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true); // ✅ open by default for desktop
  const token = localStorage.getItem("token");

  const isSmall = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    if (!token) setIsValid(false);
  }, [token]);

  if (!isValid) return <Navigate to="/login" replace />;

  const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* ✅ Desktop Sidebar */}
      {!isSmall && (
        <div
          style={{
            flexShrink: 0,
            position: "sticky",
            top: 0,
            height: "100vh",
            zIndex: 1000,
          }}
        >
          <SideBar open={sidebarOpen} /> {/* permanent mode */}
        </div>
      )}

      {/* ✅ Main Content Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        {/* Navbar (fixed top) */}
        <div style={{ position: "sticky", top: 0, zIndex: 1200 }}>
          <NavBar open={sidebarOpen} onToggleSidebar={handleToggleSidebar} />
        </div>

        {/* Scrollable Outlet */}
        <div
          style={{
            flexGrow: 1,
            overflowY: "auto",
            background: "#f9f9f9",
          }}
        >
          <Outlet />
        </div>
      </div>

      {/* ✅ Mobile Sidebar (overlay mode) */}
      {isSmall && (
        <SideBar
          open={sidebarOpen}
          onClose={handleCloseSidebar}
          isSmall={true}
        />
      )}
    </div>
  );
}
