import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function Search({
  value,
  onChange,
  placeholder = "Search...",
  fullWidth = false,
}) {
  return (
    <TextField
      style={{ width: fullWidth ? "100%" : 300 }}
      variant="outlined"
      sx={{ backgroundColor: "white" }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}

export default Search;
