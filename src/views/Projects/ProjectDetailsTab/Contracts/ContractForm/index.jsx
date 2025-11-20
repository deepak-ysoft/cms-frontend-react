import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  IconButton,
  Autocomplete,
  Box,
  Paper,
} from "@mui/material";
import { Add, Delete, UploadFile } from "@mui/icons-material";
import { searchDevelopers } from "../../../../../api/userApi";

const ContractForm = ({ projectId, onSubmit, contract }) => {
  const [developers, setDevelopers] = useState([]);
  const [file, setFile] = useState(null);
  const [allDevelopers, setAllDevelopers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [errors, setErrors] = useState({});

  const [editData, setFormData] = useState({
    contractName: "",
    billingType: "Fixed",
    fixedAmount: "",
    totalAmount: "",
    currency: "INR",
    startDate: "",
    endDate: "",
    file: null,
  });

  // 🟢 Auto-fill form fields in Edit Mode
  useEffect(() => {
    if (contract) {
      setFormData({
        contractName: contract.contractName || "",
        billingType: contract.billingType || "Fixed",
        fixedAmount: contract.fixedAmount || "",
        totalAmount: contract.totalAmount || "",
        currency: contract.currency || "INR",
        startDate: contract.startDate ? contract.startDate.split("T")[0] : "",
        endDate: contract.endDate ? contract.endDate.split("T")[0] : "",
        file: null, // file cannot be pre-filled
      });
    }
    if (contract?.developersWork) {
      setDevelopers(contract?.developersWork);
    }
  }, [contract]);

  // 🧠 Fetch all developers once
  useEffect(() => {
    const fetchAllDevelopers = async () => {
      try {
        const result = await searchDevelopers("");
        setAllDevelopers(result);
        setSearchResults(result);
      } catch (err) {
        console.error("Error fetching developers:", err);
      }
    };
    fetchAllDevelopers();
  }, []);

  // 🔎 Developer search
  const handleSearch = React.useCallback(
    (value = "") => {
      clearTimeout(searchTimeout);
      const timeout = setTimeout(() => {
        if (!value) {
          setSearchResults(allDevelopers);
        } else {
          const filtered = allDevelopers.filter((dev) =>
            dev.email.toLowerCase().includes(value.toLowerCase())
          );
          setSearchResults(filtered);
        }
      }, 200);
      setSearchTimeout(timeout);
    },
    [allDevelopers, searchTimeout]
  );

  // ➕ / ➖ Developer Rows
  const handleAddDeveloper = () =>
    setDevelopers([
      ...developers,
      { developer: "", email: "", hoursWorked: 0, ratePerHour: 0 },
    ]);

  const handleRemoveDeveloper = (index) =>
    setDevelopers(developers.filter((_, i) => i !== index));

  const handleDeveloperChange = (index, field, value) => {
    const updated = [...developers];
    updated[index][field] = value;
    setDevelopers(updated);
  };

  // 🧩 Validation Function
  const validateForm = () => {
    const newErrors = {};

    if (!editData.contractName.trim())
      newErrors.contractName = "Contract name is required.";

    if (!editData.currency) newErrors.currency = "Currency is required.";

    if (!editData.startDate) newErrors.startDate = "Start date is required.";
    if (!editData.endDate) newErrors.endDate = "End date is required.";

    if (editData.startDate && editData.endDate) {
      if (new Date(editData.endDate) < new Date(editData.startDate)) {
        newErrors.endDate = "End date must be after start date.";
      }
    }

    if (editData.billingType === "Fixed") {
      if (!editData.fixedAmount || editData.fixedAmount <= 0)
        newErrors.fixedAmount = "Enter a valid fixed amount.";
    }

    if (editData.billingType === "Hourly") {
      if (developers.length === 0)
        newErrors.developers = "Add at least one developer.";

      developers.forEach((dev, i) => {
        if (!dev.developer) newErrors[`developer-${i}`] = "Select a developer.";
        if (!dev.hoursWorked || dev.hoursWorked <= 0 || dev.hoursWorked > 10)
          newErrors[`hoursWorked-${i}`] = "Valid hours (1-10).";
        if (!dev.ratePerHour || dev.ratePerHour <= 0)
          newErrors[`ratePerHour-${i}`] = "Enter valid rate.";
      });
    }

    if (!contract && !file) newErrors.file = "Please upload a contract file.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 📝 Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("contractName", editData.contractName);
    formData.append("currency", editData.currency);
    formData.append("billingType", editData.billingType);
    formData.append("startDate", editData.startDate);
    formData.append("endDate", editData.endDate);
    formData.append("fixedAmount", editData.fixedAmount || 0);
    if (file) formData.append("file", file);

    if (editData.billingType === "Hourly") {
      formData.append("developersWork", JSON.stringify(developers));
    }

    onSubmit(formData);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 1, md: 4 },
        borderRadius: 3,
        backgroundColor: "#ffffffff",
        maxWidth: 800,
        mx: "auto",
      }}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2} mb={2}>
          {/* Contract Name */}
          <Grid sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              name="contractName"
              label="Contract Name"
              fullWidth
              value={editData.contractName}
              onChange={(e) =>
                setFormData({ ...editData, contractName: e.target.value })
              }
              size="small"
              required
              error={!!errors.contractName}
              helperText={errors.contractName}
            />
          </Grid>

          {/* Currency */}
          <Grid sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              select
              label="Currency"
              value={editData.currency}
              onChange={(e) =>
                setFormData({ ...editData, currency: e.target.value })
              }
              fullWidth
              size="small"
              required
            >
              {[
                { code: "INR", label: "Indian Rupee (₹)" },
                { code: "USD", label: "US Dollar ($)" },
                { code: "EUR", label: "Euro (€)" },
                { code: "GBP", label: "British Pound (£)" },
                { code: "AUD", label: "Australian Dollar (A$)" },
                { code: "CAD", label: "Canadian Dollar (C$)" },
                { code: "AED", label: "UAE Dirham (د.إ)" },
                { code: "JPY", label: "Japanese Yen (¥)" },
                { code: "CNY", label: "Chinese Yuan (¥)" },
                { code: "SGD", label: "Singapore Dollar (S$)" },
              ].map((option) => (
                <MenuItem key={option.code} value={option.code}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Dates */}
          <Grid sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              value={editData.startDate}
              onChange={(e) =>
                setFormData({ ...editData, startDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
              required
              error={!!errors.startDate}
              helperText={errors.startDate}
            />
          </Grid>

          <Grid sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              name="endDate"
              label="End Date"
              type="date"
              value={editData.endDate}
              onChange={(e) =>
                setFormData({ ...editData, endDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
              required
              error={!!errors.endDate}
              helperText={errors.endDate}
            />
          </Grid>

          {/* Billing Type */}
          <Grid sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              select
              label="Billing Type"
              value={editData.billingType}
              onChange={(e) =>
                setFormData({ ...editData, billingType: e.target.value })
              }
              fullWidth
              size="small"
            >
              <MenuItem value="Fixed">Fixed</MenuItem>
              <MenuItem value="Hourly">Hourly</MenuItem>
            </TextField>
          </Grid>

          {/* Fixed Amount */}
          {editData.billingType === "Fixed" && (
            <Grid sx={{ width: { xs: "100%", md: "48%" } }}>
              <TextField
                name="fixedAmount"
                label="Fixed Amount"
                type="number"
                value={editData.fixedAmount}
                onChange={(e) =>
                  setFormData({ ...editData, fixedAmount: e.target.value })
                }
                fullWidth
                size="small"
                required
                error={!!errors.fixedAmount}
                helperText={errors.fixedAmount}
              />
            </Grid>
          )}

          {/* Hourly Developers Section */}
          {editData.billingType === "Hourly" && (
            <Grid
              sx={{
                width: "100%",
                border: "1px solid #72eefeff",
                borderRadius: "15px",
                p: "16px",
                mt: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                color="primary.main"
                sx={{
                  background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
                  p: "5px",
                  mb: "25px",
                  borderTopLeftRadius: 8,
                }}
              >
                <Box pl={3}>Developers</Box>
              </Typography>

              {developers.map((dev, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    alignItems: "center",
                    mb: 4,
                  }}
                >
                  {/* Developer Selection */}
                  <Box sx={{ flex: 2, width: "100%", height: "55px" }}>
                    <Autocomplete
                      options={searchResults}
                      getOptionLabel={(option) => option?.email || ""}
                      value={
                        searchResults.find(
                          (opt) =>
                            opt._id === (dev?.developer?._id || dev?.developer)
                        ) || null
                      } // ✅ keep the selected developer visible
                      onInputChange={(e, value, reason) => {
                        if (reason === "input") handleSearch(value);
                      }}
                      onChange={(e, value) => {
                        handleDeveloperChange(
                          index,
                          "developer",
                          value?._id || ""
                        );
                        handleDeveloperChange(
                          index,
                          "email",
                          value?.email || ""
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Developer"
                          size="small"
                          fullWidth
                          error={!!errors[`developer-${index}`]}
                          helperText={errors[`developer-${index}`]}
                        />
                      )}
                    />
                  </Box>

                  {/* Hours Worked */}
                  <Box sx={{ flex: 1, width: "100%", height: "55px" }}>
                    <TextField
                      label="Hours Worked"
                      type="number"
                      size="small"
                      value={dev.hoursWorked}
                      onChange={(e) =>
                        handleDeveloperChange(
                          index,
                          "hoursWorked",
                          e.target.value
                        )
                      }
                      fullWidth
                      error={!!errors[`hoursWorked-${index}`]}
                      helperText={errors[`hoursWorked-${index}`]}
                    />
                  </Box>

                  {/* Rate per Hour */}
                  <Box sx={{ flex: 1, width: "100%", height: "55px" }}>
                    <TextField
                      label="Rate/Hour"
                      type="number"
                      size="small"
                      value={dev.ratePerHour}
                      onChange={(e) =>
                        handleDeveloperChange(
                          index,
                          "ratePerHour",
                          e.target.value
                        )
                      }
                      fullWidth
                      error={!!errors[`ratePerHour-${index}`]}
                      helperText={errors[`ratePerHour-${index}`]}
                    />
                  </Box>

                  {/* Delete Button */}
                  <Box sx={{ flexShrink: 0, height: "55px" }}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveDeveloper(index)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              ))}

              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Add />}
                onClick={handleAddDeveloper}
                sx={{ mt: 1 }}
              >
                Add Developer
              </Button>
            </Grid>
          )}

          {/* File Upload */}
          <Grid sx={{ width: "100%" }}>
            <Button
              component="label"
              variant="outlined"
              color={!errors.file ? "secondary" : "error"}
              startIcon={<UploadFile />}
              fullWidth
              size="small"
              sx={{ py: 1 }}
            >
              Upload Contract File
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
                // error={!!errors.file}
                // helperText={errors.file}
              />
            </Button>
            {!!errors.file && (
              <Typography mt={1} variant="body2" color="error">
                {errors.file}
              </Typography>
            )}
            {file && (
              <Typography mt={1} variant="body2" color="text.secondary">
                Selected: {file.name}
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Submit */}
        <Box display="flex" justifyContent={{ xs: "center", md: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              height: 42,
              fontSize: "0.95rem",
              textTransform: "none",
              borderRadius: 2,
              backgroundColor: "#00BCD4",
              "&:hover": { backgroundColor: "#0097A7" },
              px: 4,
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ContractForm;
