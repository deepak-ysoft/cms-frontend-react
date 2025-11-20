import React from "react";
import { TableSortLabel } from "@mui/material";

function SortHeader({ columnKey, label, orderBy, order, onSort }) {
  const handleSort = () => {
    const isAsc = orderBy === columnKey && order === "asc";
    onSort(columnKey, isAsc ? "desc" : "asc");
  };

  return (
    <TableSortLabel
      active={orderBy === columnKey}
      direction={orderBy === columnKey ? order : "asc"}
      onClick={handleSort}
      style={{ cursor: "pointer", color: "White", }}
    >
      {label}
    </TableSortLabel>
  );
}

export default SortHeader;
