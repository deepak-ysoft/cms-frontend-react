import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import {
  ArrowBack,
  Description,
  Download,
  FilePresent,
  Person,
  MonetizationOn,
  Sell,
  CalendarToday,
  TaskAlt,
  Email,
} from "@mui/icons-material";
import {
  getInvoiceById,
  handleGenerateDOCX,
  handleGeneratePDF,
} from "../../../../../api/invoiceApi";
import { formatDateTime } from "../../../../../utils/formatDateTime";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate, useParams } from "react-router-dom";

export default function InvoiceDetails() {
  const { id } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await getInvoiceById(id);
        setInvoiceData(res?.data || res);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchInvoice();
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

  if (!invoiceData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <Typography color="text.secondary">No Invoice Found.</Typography>
      </Box>
    );
  }

  // 🔹 ICON INFO CARDS
  const infoCards = [
    {
      label: "Invoice No.",
      value: invoiceData.invoiceNumber,
      icon: <TaskAlt color="primary" />,
    },
    {
      label: "Client",
      value: invoiceData.clientName,
      icon: <Person color="primary" />,
    },
    {
      label: "Email",
      value: invoiceData.clientEmail || "—",
      icon: <Person color="primary" />,
    },
    {
      label: "Billing Address",
      value: invoiceData.billingAddress || "—",
      icon: <Email color="primary" />,
    },
    {
      label: "Status",
      value: invoiceData.status,
      icon: <TaskAlt color="primary" />,
    },
    {
      label: "Amount",
      value: `₹${invoiceData.amount}`,
      icon: <MonetizationOn color="primary" />,
    },
    {
      label: "Discount",
      value: `${invoiceData.discount}%`,
      icon: <Sell color="primary" />,
    },
    {
      label: "Tax",
      value: `${invoiceData.taxRate}%`,
      icon: <Sell color="primary" />,
    },
    {
      label: "Total Amount",
      value: `₹${invoiceData.grandTotal?.toFixed(2)}`,
      icon: <MonetizationOn color="primary" />,
    },
    {
      label: "Issue Date",
      value: formatDateTime(invoiceData.issueDate, "datetime-sec"),
      icon: <CalendarToday color="primary" />,
    },
    {
      label: "Due Date",
      value: formatDateTime(invoiceData.dueDate, "datetime-sec"),
      icon: <CalendarToday color="primary" />,
    },
    {
      label: "Project",
      value: invoiceData.projectName,
      icon: <TaskAlt color="primary" />,
    },
    {
      label: "Contract",
      value: invoiceData.contractName,
      icon: <TaskAlt color="primary" />,
    },
  ];

  const fileUrl = invoiceData.fileUrl?.startsWith("http")
    ? invoiceData.fileUrl
    : `${invoiceData.fileUrl}`;

  return (
    <Paper
      sx={{
        borderRadius: 3,
        backgroundColor: "#fff",
        m: { xs: 1, md: 5 },
      }}
    >
      {/* 🔹 HEADER */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        mb={3}
        sx={{
          background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
          p: { xs: 1, md: 3 },
          borderTopLeftRadius: 8,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: "#fff",
              boxShadow: 1,
              border: "1px solid #e0e0e0",
              mr: 4,
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" fontWeight={700} color="primary.main">
            Invoice Details
          </Typography>
        </Box>
        <Box sx={{ mt: { xs: 2, md: 0 } }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: "auto", mr: 2 }}
            startIcon={<PictureAsPdfIcon />}
            onClick={() => handleGeneratePDF(invoiceData._id)}
          >
            Download PDF
          </Button>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: { xs: 1, md: 0 } }}
            startIcon={<DescriptionIcon />}
            onClick={() => handleGenerateDOCX(invoiceData._id)}
          >
            Download Word
          </Button>
        </Box>
      </Box>

      {/* 🔹 INFO CARDS */}
      <Grid container sx={{ p: { xs: 0, md: 3 } }}>
        {infoCards.map((item, index) => (
          <Grid
            key={index}
            sx={{
              width: { xs: "100%", sm: "100%", md: "50%", lg: "33.33%" },
              p: 1,
              wordBreak: "break-all",
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: "linear-gradient(145deg, #f9fafc 0%, #ffffff 100%)",
                transition: ".25s ease",
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
                component="div"
                fontWeight={600}
                color="text.primary"
              >
                {item.value || "—"}
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* 🔹 UPLOADED BY */}
        <Grid
          sx={{
            width: { xs: "100%", sm: "100%", md: "50%", lg: "33.33%" },
            p: 1,
            wordBreak: "break-all",
          }}
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
                  {invoiceData.uploadedBy}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* 🔹 NOTES SECTION */}
        {invoiceData.notes && (
          <Grid
            sx={{
              width: "100%",
              p: 1,
              wordBreak: "break-all",
            }}
          >
            <Paper
              elevation={1}
              sx={{ p: 3, borderRadius: 3, backgroundColor: "#f9f9f9" }}
            >
              <Typography
                variant="h6"
                color="primary.main"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  borderBottom: "1px solid #e0e0e0",
                  pb: 1,
                }}
              >
                Notes
              </Typography>
              <Typography sx={{ wordBreak: "break-all" }}>
                {invoiceData.notes}
              </Typography>
            </Paper>
          </Grid>
        )}
        {/* 🔹 FILE SECTION */}
        {invoiceData.fileUrl && (
          <Grid sx={{ width: { xs: "100%", md: "25%", lg: "15%" } }}>
            <Paper
              elevation={1}
              sx={{ p: 3, borderRadius: 3, backgroundColor: "#f9f9f9" }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1.5}
                borderBottom="1px solid #dcdcdc"
                pb={1}
              >
                <FilePresent color="primary" />
                <Typography variant="subtitle2" color="text.secondary">
                  Invoice File
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-around" mt={2}>
                <Tooltip title="View File">
                  <IconButton onClick={() => window.open(fileUrl, "_blank")}>
                    <Description color="primary" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Download File">
                  <IconButton
                    onClick={() => {
                      const fileName = invoiceData.fileUrl.split("/").pop();
                      fetch(fileUrl)
                        .then((res) => res.blob())
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
            </Paper>
          </Grid>
        )}
        {/* 🔹 CREATED AT */}
        <Grid width="100%" display="flex" justifyContent="end" p={1}>
          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="right"
          >
            Created At:{" "}
            {formatDateTime(invoiceData.createdAt, "datetime-sec") || "—"}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
