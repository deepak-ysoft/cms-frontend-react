import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box, Paper, IconButton, Typography } from "@mui/material";
import { useParams, useNavigate, Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ProjectDetailsPage from "./ProjectOverview";
import WorkLog from "./WorkLog";
import { Contracts } from "../ProjectDetailsTab/Contracts";
import InvoiceList from "./InvoiceIndex/InvoiceList";

function ProjectDetailsTab() {
  const { id: projectId, tab: activeTab } = useParams();
  const navigate = useNavigate();

  const tabsData = [
    {
      label: "Overview",
      value: "overview",
      content: <ProjectDetailsPage projectId={projectId} />,
    },
    {
      label: "Worklogs",
      value: "worklogs",
      content: <WorkLog projectId={projectId} />,
    },
    {
      label: "Contracts",
      value: "contracts",
      content: <Contracts projectId={projectId} />,
    },
    {
      label: "Invoices",
      value: "invoices",
      content: <InvoiceList projectId={projectId} />,
    },
  ];

  const currentTabIndex = tabsData.findIndex(
    (t) => t.value.toLowerCase() === (activeTab?.toLowerCase() || "overview")
  );
  const [selectedTab, setSelectedTab] = useState(
    currentTabIndex >= 0 ? currentTabIndex : 0
  );

  useEffect(() => {
    setSelectedTab(currentTabIndex >= 0 ? currentTabIndex : 0);
  }, [activeTab]);

  const handleTabChange = (event, newIndex) => {
    const newTab = tabsData[newIndex].value;
    navigate(`/projects/ProjectDetails/${projectId}/${newTab}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          minHeight: "calc(100vh - 70px)",
          backgroundColor: "#f9fafb",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: { xs: 1, md: 5 },
          boxShadow: 1,
        }}
      >
        {/* --- Header Section --- */}

        {/* --- Main Card --- */}
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "#fff",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            sx={{
              background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
              borderTopLeftRadius: 8,
            }}
          >
            <IconButton
              onClick={() => navigate("/projects")}
              sx={{
                bgcolor: "#fff",
                boxShadow: 1,
                border: "1px solid #e0e0e0",
                m: 3,
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              <IoMdArrowRoundBack size={22} />
            </IconButton>
            <Typography
              variant="h5"
              fontWeight={700}
              color="primary.main"
              m={3}
            >
              Project Details
            </Typography>
          </Box>
          {/* --- Tabs Header --- */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              backgroundColor: "#f5f7fa",
              px: 2,
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="project tabs"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  color: "#555",
                  borderRadius: "10px 10px 0 0",
                  minHeight: 48,
                },
                "& .MuiTab-root.Mui-selected": {
                  color: "#1976d2",
                  backgroundColor: "#ffffff",
                },
              }}
            >
              {tabsData.map((tab) => (
                <Tab key={tab.value} label={tab.label} />
              ))}
            </Tabs>
          </Box>
          {/* --- Tab Content --- */}
          <Box
            sx={{
              px: { xs: 2, md: 5 },
              pt: { xs: 2, md: 5 },
              animation: "fadeIn 0.25s ease-out",
            }}
          >
            {tabsData[selectedTab]?.content}
          </Box>
          <Link
            href="/projects"
            onClick={(e) => {
              e.preventDefault();
              navigate("/projects");
            }}
            style={{
              display: "inline-block",
              margin: 16,
              marginLeft: 40,
              color: "#1976d2",
              textDecoration: "none",
            }}
            aria-label="Back to project list"
          >
            <u>Back to project list</u>
          </Link>
        </Paper>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </Box>
    </DndProvider>
  );
}

export default ProjectDetailsTab;
