import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Chip,
  Typography,
} from "@mui/material";
import { IoEyeSharp } from "react-icons/io5";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { Description } from "@mui/icons-material";

// ✅ DocumentViewer: View-only button
function ViewDocument({ fileUrl }) {
  const handleView = () => {
    if (!fileUrl) {
      alert("No file available to view");
      return;
    }

    const fileExtension = fileUrl.split(".").pop().toLowerCase();
    const viewableFormats = ["pdf", "png", "jpg", "jpeg", "gif", "txt", "webp"];

    if (viewableFormats.includes(fileExtension)) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      alert(`Preview not supported for .${fileExtension} files.`);
    }
  };

  return <IoEyeSharp onClick={handleView} fontSize={25} />;
}

// ✅ DocumentDownloader: Download-only button
function DownloadDocument({ fileUrl, fileName }) {
  const handleDownload = () => {
    if (!fileUrl) {
      alert("No file available to download");
      return;
    }

    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileName || "document");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <FaCloudDownloadAlt fontSize={25} onClick={handleDownload} />;
}

// ✅ ReusableTable with conditional status chip
function ReusableTable({ columns, rows, isLoading, tableName }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead style={{ backgroundColor: "#4276a9ff" }}>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell
                key={index}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  "&:hover": {
                    color: "white",
                    fontWeight: "bold",
                  },
                  "&:active": {
                    color: "white",
                    fontWeight: "bold",
                  },
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex}>
                    {col.render ? (
                      col.render(row)
                    ) : col.field === "viewDoc" ? (
                      <ViewDocument fileUrl={row["fileUrl"]} />
                    ) : col.field === "downloadDoc" ? (
                      <DownloadDocument
                        fileUrl={row["fileUrl"]}
                        fileName={row["fileName"] || "document"}
                      />
                    ) : col.field === "status" ? (
                      row.status === "Active" ? (
                        <span className="MuiChip-label MuiChip-labelMedium css-qbwvub">
                          Active
                        </span>
                      ) : (
                        row.status
                      )
                    ) : col.field === "startDate" || col.field === "endDate" ? (
                      row[col.field] ? (
                        new Date(row[col.field]).toLocaleDateString()
                      ) : (
                        "-"
                      )
                    ) : (
                      row[col.field]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Paper
                  sx={{
                    p: 6,
                    m: 1,
                    textAlign: "center",
                    borderRadius: 4,
                    background: "linear-gradient(145deg, #f5f7fa, #e4ebf1)",
                    boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
                    borderTopLeftRadius: 8,
                  }}
                >
                  <Description
                    sx={{ fontSize: 60, color: "text.secondary", mb: 1 }}
                  />
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    No {tableName} Found
                  </Typography>
                </Paper>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ReusableTable;
