import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  IconButton,
  Chip,
  Tooltip,
  Divider,
  Avatar,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  Work,
  CalendarToday,
  MonetizationOn,
  AttachMoney,
  Person,
  Description,
  FilePresent,
  TaskAlt,
  Download,
} from "@mui/icons-material";
import { getContractById } from "../../../../../api/Contract";
import { formatDateTime } from "../../../../../utils/formatDateTime";
import ImagePreviewModal from "../../../../../shared/components/reusableComponent/ImagePreviewModal";

function ContractDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpenImage = (imgUrl) => setSelectedImage(imgUrl);
  const handleCloseImage = () => setSelectedImage(null);
  const isImage = /\.(png|jpe?g|gif|webp)$/i.test(contract?.fileUrl);

  // ✅ Fetch contract by ID
  useEffect(() => {
    const fetchContract = async () => {
      try {
        const res = await getContractById(id);
        setContract(res?.data || res);
      } catch (error) {
        console.error("Error fetching contract details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchContract();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!contract) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <Typography color="text.secondary">No contract found.</Typography>
      </Box>
    );
  }

  // ✅ Info Cards
  const infoCards = [
    {
      label: "Contract Name",
      value: contract.contractName,
      icon: <TaskAlt color="primary" />,
    },
    {
      label: "Project",
      value: contract.project?.name,
      icon: <Work color="primary" />,
    },
    {
      label: "Billing Type",
      value: contract.billingType,
      icon: <MonetizationOn color="primary" />,
    },
    {
      label: "Currency",
      value: contract.currency,
      icon: <AttachMoney color="primary" />,
    },
    {
      label: "Total Amount",
      value: `${contract.totalAmount} ${contract.currency}`,
      icon: <AttachMoney color="primary" />,
    },
    {
      label: "Status",
      value: contract.status,
      icon: <TaskAlt color="primary" />,
    },
    {
      label: "Start Date",
      value: contract.startDate,
      icon: <CalendarToday color="primary" />,
    },
    {
      label: "End Date",
      value: contract.endDate,
      icon: <CalendarToday color="primary" />,
    },
  ];
  const fileUrl = contract.fileUrl.startsWith("http")
    ? contract.fileUrl
    : `${contract.fileUrl}`;
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: { xs: 1, md: 5 },
        backgroundColor: "#f9fafc",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          backgroundColor: "#fff",
          overflow: "hidden",
          boxShadow: 1,
          width: "100%",
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          borderBottom="1px solid #e0e0e0"
          p={3}
          sx={{ background: "linear-gradient(90deg, #e8f0ff, #ffffff)" }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: "#fff",
              boxShadow: 1,
              border: "1px solid #e0e0e0",
              mr: 5,
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <IoMdArrowRoundBack size={22} />
          </IconButton>

          <Typography variant="h5" fontWeight={700} color="primary.main">
            Contract Details
          </Typography>
        </Box>
        {/* Info Section */}
        <Grid container sx={{ p: { xs: 0, md: 3 } }}>
          {infoCards.map((item, i) => (
            <Grid
              key={i}
              sx={{
                width: { xs: "100%", sm: "50%", lg: "33.33%" },
                p: 1,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background:
                    "linear-gradient(145deg, #f9fafc 0%, #ffffff 100%)",
                  transition: "0.25s ease",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                  {item.icon}
                  <Typography variant="subtitle2" color="text.secondary">
                    {item.label}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="text.primary"
                >
                  {item.value || "—"}
                </Typography>
              </Paper>
            </Grid>
          ))}
          {/* Developers Work (only for Hourly contracts) */}
          {contract.billingType === "Hourly" && (
            <Grid sx={{ width: { xs: "100%", lg: "44%" }, px: 1 }} pt={3}>
              <Paper
                elevation={1}
                sx={{
                  borderRadius: 3,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography
                  variant="h6"
                  color="primary.main"
                  sx={{
                    p: 2,
                    background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
                    fontWeight: 600,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    borderTop: "1px solid #e7e7e7ff",
                  }}
                >
                  Developers Work Summary
                </Typography>
                <Divider />
                <Box
                  sx={{
                    px: 2,
                    maxHeight: { xs: "40vh", sm: "42vh" }, // smaller scroll area on mobile
                    overflowY: "auto",
                    "&::-webkit-scrollbar": { width: "6px" },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#ccc",
                      borderRadius: "3px",
                    },
                  }}
                >
                  {contract.developersWork.length > 0 ? (
                    contract.developersWork.map((dev, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                          justifyContent: "space-between",
                          py: 1.5,
                          borderBottom: "1px solid #eee",
                          gap: { xs: 1, sm: 1 },
                        }}
                      >
                        {/* Left Section - Developer Info */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            flex: 1,
                            minWidth: 0, // ✅ prevents overflow
                          }}
                        >
                          <Avatar
                            sx={{ width: 34, height: 34 }}
                            alt={dev.name}
                            src={dev.profileImage || ""}
                          />
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              noWrap
                              sx={{ maxWidth: { xs: "100%", sm: "180px" } }}
                            >
                              {dev.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                wordBreak: "break-all",
                                fontSize: "0.85rem",
                                maxWidth: { xs: "100%", sm: "250px" },
                              }}
                            >
                              {dev.email}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Right Section - Work Info */}
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: {
                              xs: "space-around",
                              sm: "flex-end",
                            },
                            textAlign: { xs: "left", sm: "right" },
                            gap: 1.5,
                            mt: { xs: 1, sm: 0 },
                            width: { xs: "100%", sm: "auto" },
                          }}
                        >
                          <Typography variant="body2">
                            Hours: <b>{dev.hoursWorked}</b>
                          </Typography>
                          <Typography variant="body2">
                            Rate: <b>{dev.ratePerHour}</b>
                          </Typography>
                          <Typography variant="body2">
                            Total: <b>{dev.totalAmount}</b>
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      No developer work data found.
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          )}
          {/* File Section */}

          {contract?.fileUrl && (
            <Grid
              sx={{
                width:
                  contract.billingType !== "Hourly"
                    ? { xs: "100%", sm: "50%", lg: "33.33%" }
                    : { xs: "100%", sm: "50%", lg: "20%" },
                p: contract.billingType !== "Hourly" ? 1 : 0,
                px: contract.billingType === "Hourly" ? 1 : 1,
              }}
              mt={contract.billingType === "Hourly" ? 3 : 0}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1.5}
                  pb={1}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={1.5}
                  >
                    <FilePresent color="primary" />
                    <Typography variant="subtitle2" color="text.secondary">
                      Contract File
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Tooltip title="View Contract File">
                      <IconButton
                        onClick={() =>
                          isImage && handleOpenImage(contract.fileUrl)
                        }
                        href={!isImage ? fileUrl : undefined}
                        target={!isImage ? "_blank" : undefined}
                      >
                        <Description color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download File">
                      <IconButton
                        onClick={() => {
                          const fileName = contract.fileUrl.split("/").pop();
                          fetch(fileUrl)
                            .then((r) => r.blob())
                            .then((blob) => {
                              const link = document.createElement("a");
                              link.href = URL.createObjectURL(blob);
                              link.download = fileName;
                              link.click();
                            });
                        }}
                      >
                        <Download color="action" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          )}
          {/* Uploaded By */}
          <Grid
            sx={{
              width: { xs: "100%", sm: "50%", lg: "36%" },
              px: 1,
            }}
            mt={contract.billingType === "Hourly" ? 3 : 0}
          >
            <Paper
              elevation={1}
              sx={{ p: 3, borderRadius: 3, backgroundColor: "#f9f9f9" }}
            >
              <Typography variant="subtitle2" color="text.secondary" mb={1.5}>
                Uploaded By
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Person color="primary" />
                <Box>
                  <Typography fontWeight={600}>
                    {contract.uploadedBy?.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{
                      wordBreak: "break-all",
                    }}
                  >
                    {contract.uploadedBy?.email}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          {/* Created At */}
          <Grid
            display="flex"
            justifyContent="end"
            alignItems="flex-start"
            sx={{ width: { xs: "100%" }, p: 1 }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="right"
              sx={{
                fontSize: "0.8rem",
                letterSpacing: 0.3,
              }}
            >
              Created At:{" "}
              {formatDateTime(contract.createdAt, "datetime-sec") || "—"}
            </Typography>
          </Grid>
        </Grid>
        <ImagePreviewModal
          open={!!selectedImage}
          onClose={handleCloseImage}
          imageUrl={selectedImage}
          title="Contract File"
        />
      </Paper>
    </Box>
  );
}

export default ContractDetails;
