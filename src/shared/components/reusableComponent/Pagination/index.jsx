import React from "react";
import { Pagination } from "@mui/material";

function CustomPagination({ currentPage, totalPages, onPageChange }) {
  const handleChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={handleChange}
      variant="outlined"
      shape="rounded"
      siblingCount={1}
      boundaryCount={1}
      sx={{
        "& .MuiPaginationItem-root": {
          fontSize: "0.9rem",
          fontWeight: 600,
          borderRadius: "12px",
          border: "1px solid #d0d7de",
          transition: "all 0.2s ease",
        },
        "& .MuiPaginationItem-root:hover": {
          backgroundColor: "#f0f6ff",
          borderColor: "#90caf9",
        },
        "& .Mui-selected": {
          backgroundColor: "#1976d2 !important",
          color: "#fff",
          borderColor: "#1565c0",
          boxShadow: "0px 2px 6px rgba(25,118,210,0.4)",
        },
      }}
    />
  );
}

export default CustomPagination;
