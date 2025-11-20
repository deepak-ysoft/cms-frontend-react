import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  MenuItem,
  CircularProgress,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { CloudUpload as UploadIcon } from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

function Form({
  fields,
  onSubmit,
  onCancel,
  isLoading = false,
  isFormLoading = false,
  isEdit = false,
  submitLabel = "Submit",
  isFullWidth = true,
}) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {})
  );
  const [errors, setErrors] = useState({});
  const [dynamicOptions, setDynamicOptions] = useState({});
  const [loadingField, setLoadingField] = useState(null);
  const [showPassword, setShowPassword] = useState({});

  // ✅ FIX: update when fields or default values change
  React.useEffect(() => {
    if (isEdit) {
      const updatedFormData = fields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue || "";
        return acc;
      }, {});

      setFormData(updatedFormData);
    }
  }, [fields, isEdit]);

  const togglePassword = (fieldName) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  // ✅ Handle input changes (including files & checkboxes)
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (files) {
      // Handle single or multiple files
      setFormData({
        ...formData,
        [name]: e.target.multiple ? Array.from(files) : files[0],
      });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Enhanced validation logic
  const validate = () => {
    const newErrors = {};

    fields.forEach((field) => {
      const value = formData[field.name];
      const rules = field.rules || {};

      // Required
      if (
        field.required &&
        (value === "" || value === undefined || value === null)
      ) {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }
      ``;
      // Min value (for number/date)
      if (rules.min && Number(value) < rules.min.value) {
        newErrors[field.name] =
          rules.min.message ||
          `${field.label} must be at least ${rules.min.value}`;
        return;
      }

      // Max value
      if (rules.max && Number(value) > rules.max.value) {
        newErrors[field.name] =
          rules.max.message ||
          `${field.label} must not exceed ${rules.max.value}`;
        return;
      }

      // Min length
      if (rules.minLength && value?.length < rules.minLength.value) {
        newErrors[field.name] =
          rules.minLength.message ||
          `${field.label} must be at least ${rules.minLength.value} characters`;
        return;
      }

      // Max length
      if (rules.maxLength && value?.length > rules.maxLength.value) {
        newErrors[field.name] =
          rules.maxLength.message ||
          `${field.label} must be less than ${rules.maxLength.value} characters`;
        return;
      }

      // Pattern (regex)
      if (rules.pattern && value && !rules.pattern.value.test(value)) {
        newErrors[field.name] =
          rules.pattern.message || `${field.label} format is invalid`;
        return;
      }

      // Custom validate callback (returns true or string)
      if (typeof rules.validate === "function") {
        const result = rules.validate(value, formData);
        if (result !== true) {
          newErrors[field.name] = result || `${field.label} is invalid`;
          return;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) onSubmit(formData);
  };

  // ✅ Load options dynamically if needed
  const handleDropdownOpen = async (field) => {
    if (dynamicOptions[field.name]?.length > 0) return;
    if (field.loadOptions) {
      setLoadingField(field.name);
      const options = await field.loadOptions();
      setDynamicOptions((prev) => ({
        ...prev,
        [field.name]: options,
      }));
      setLoadingField(null);
    }
  };

  // ✅ Cancel button logic
  const handleCancel = () => {
    setFormData({});
    setErrors({});
    onCancel();
  };

  return (
    <Box
      sx={{
        maxWidth: "100%",
        p: 3,
        backgroundColor: "#fff",
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        {isFormLoading == false ? (
          <Grid container>
            {fields
              .filter((field) => !field.hide)
              .map((field) => (
                <Grid
                  key={field.name}
                  sx={{
                    width: isFullWidth
                      ? { xs: "100%", sm: "50%", lg: "33.33%" }
                      : "100%",
                    display: "flex",
                    justifyContent:
                      field.type === "radio" || field.type === "checkbox"
                        ? "flex-start"
                        : "center",
                    pt: 3,
                  }}
                >
                  {/* ✅ File Input */}
                  {field.type === "file" ? (
                    <>
                      <input
                        id={field.name}
                        type="file"
                        name={field.name}
                        multiple={field.multiple || false}
                        style={{ display: "none" }}
                        accept={field.accept || "*/*"}
                        onChange={handleChange}
                        disabled={field.readOnly}
                      />
                      <label htmlFor={field.name}>
                        <Box
                          component="span"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            border: "2px dashed #ccc",
                            borderRadius: 2,
                            height: 40,
                            mx: 2,
                            width: { xs: 280, sm: 265, md: 250, lg: 350 },
                            cursor: field.readOnly ? "not-allowed" : "pointer",
                            transition: "0.2s",
                            backgroundColor: field.readOnly
                              ? "#f5f5f5"
                              : "#fafafa",
                            "&:hover": !field.readOnly
                              ? {
                                  borderColor: "#00BCD4",
                                  backgroundColor: "#f0fafa",
                                }
                              : {},
                          }}
                        >
                          <UploadIcon
                            sx={{ fontSize: 22, color: "grey.600" }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.85rem",
                            }}
                          >
                            {formData[field.name]?.name ||
                              (Array.isArray(formData[field.name])
                                ? `${
                                    formData[field.name].length
                                  } files selected`
                                : "Upload File")}
                          </Typography>
                        </Box>
                      </label>
                      {errors[field.name] && (
                        <Typography color="error" variant="caption">
                          {errors[field.name]}
                        </Typography>
                      )}
                    </>
                  ) : field.type === "select" ? (
                    // ✅ Dropdown
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{
                        mx: 2,
                      }}
                    >
                      <InputLabel>
                        {
                          <span>
                            {field.label}{" "}
                            {field.required && (
                              <span style={{ color: "red", marginLeft: 4 }}>
                                *
                              </span>
                            )}
                          </span>
                        }
                      </InputLabel>
                      <Select
                        name={field.name}
                        label={
                          <span>
                            {field.label}{" "}
                            {field.required && (
                              <span style={{ color: "red", marginLeft: 4 }}>
                                *
                              </span>
                            )}
                          </span>
                        }
                        value={formData[field.name] || ""}
                        onChange={(e) => {
                          handleChange(e);
                          field.onChange?.(e);
                        }}
                        onOpen={() => handleDropdownOpen(field)}
                        error={!!errors[field.name]}
                        disabled={field.readOnly}
                        sx={{
                          borderRadius: 1,
                          backgroundColor: field.readOnly ? "#f5f5f5" : "#fff",
                        }}
                      >
                        {loadingField === field.name ? (
                          <MenuItem disabled>
                            <CircularProgress size={18} sx={{ mr: 1 }} />{" "}
                            Loading...
                          </MenuItem>
                        ) : (dynamicOptions[field.name] || field.options || [])
                            .length > 0 ? (
                          (dynamicOptions[field.name] || field.options).map(
                            (option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            )
                          )
                        ) : (
                          <MenuItem disabled>No options</MenuItem>
                        )}
                      </Select>
                      {errors[field.name] && (
                        <Typography color="error" variant="caption">
                          {errors[field.name]}
                        </Typography>
                      )}
                    </FormControl>
                  ) : field.type === "checkbox" ? (
                    // ✅ Checkbox
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!formData[field.name]}
                          onChange={handleChange}
                          name={field.name}
                          color="primary"
                        />
                      }
                      label={
                        <span>
                          {field.label}{" "}
                          {field.required && (
                            <span style={{ color: "red", marginLeft: 4 }}>
                              *
                            </span>
                          )}
                        </span>
                      }
                      sx={{
                        mx: 2,
                        borderRadius: 1,
                        backgroundColor: field.readOnly ? "#f5f5f5" : "#fff",
                      }}
                    />
                  ) : field.type === "radio" ? (
                    // ✅ Radio buttons

                    <FormControl component="fieldset">
                      <Typography variant="body2" mb={0.5}>
                        {
                          <span>
                            {field.label}{" "}
                            {field.required && (
                              <span style={{ color: "red", marginLeft: 4 }}>
                                *
                              </span>
                            )}
                          </span>
                        }
                      </Typography>
                      <RadioGroup
                        row
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                      >
                        {field.options?.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio color="primary" />}
                            label={option.label}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  ) : field.type === "textarea" ? (
                    <TextField
                      name={field.name}
                      label={
                        <span>
                          {field.label}{" "}
                          {field.required && (
                            <span style={{ color: "red", marginLeft: 4 }}>
                              *
                            </span>
                          )}
                        </span>
                      }
                      multiline
                      value={formData[field.name]}
                      onChange={handleChange}
                      error={!!errors[field.name]}
                      helperText={errors[field.name]}
                      fullWidth
                      size="small"
                      variant="outlined"
                      minRows={field.minRows || 3}
                      sx={{
                        mx: 2,
                        borderRadius: 1,
                        backgroundColor: field.readOnly ? "#f5f5f5" : "#fff",

                        "& .MuiInputBase-root": {
                          height: field.height || "auto", // ✅ custom height from caller
                          alignItems: "flex-start", // ✅ aligns text properly for taller inputs
                        },
                      }}
                    />
                  ) : (
                    // ✅ Default TextField (includes time/date/number)
                    <TextField
                      name={field.name}
                      label={
                        <span>
                          {field.label}{" "}
                          {field.required && (
                            <span style={{ color: "red", marginLeft: 4 }}>
                              *
                            </span>
                          )}
                        </span>
                      }
                      type={
                        field.type === "password"
                          ? showPassword[field.name]
                            ? "text"
                            : "password"
                          : field.type || "text"
                      }
                      value={formData[field.name]}
                      onChange={handleChange}
                      error={!!errors[field.name]}
                      helperText={errors[field.name]}
                      fullWidth
                      size="small"
                      variant="outlined"
                      InputLabelProps={
                        field.type === "date" || field.type === "time"
                          ? { shrink: true }
                          : {}
                      }
                      InputProps={{
                        endAdornment:
                          field.type === "password" ? (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => togglePassword(field.name)}
                              >
                                {showPassword[field.name] ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ) : null,
                      }}
                      sx={{
                        borderRadius: 1,
                        backgroundColor: field.readOnly ? "#f5f5f5" : "#fff",
                        mx: 2,
                      }}
                    />
                  )}
                </Grid>
              ))}
          </Grid>
        ) : (
          <>
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          </>
        )}

        {/* ✅ Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            mt: 4,
          }}
        >
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
            {isLoading ? (
              <CircularProgress
                size={20}
                color="inherit"
                sx={{ color: "#fff" }}
              />
            ) : (
              submitLabel
            )}
          </Button>
          {onCancel && (
            <Button
              type="button"
              onClick={handleCancel}
              variant="contained"
              sx={{
                height: 42,
                fontSize: "0.95rem",
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: "#b1b9baff",
                "&:hover": { backgroundColor: "#9b9b9bff" },
                px: 4,
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Form;
