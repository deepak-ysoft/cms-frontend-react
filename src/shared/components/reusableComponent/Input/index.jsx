// src/components/common/InputField.js
import React from "react";

function InputField({
  label,
  type = "text",
  id,
  placeholder,
  value,
  onChange,
  required = false,
  options = [], // for dropdown
}) {
  // ✅ Checkbox
  if (type === "checkbox") {
    return (
      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id={id}
          checked={value}
          onChange={onChange}
          required={required}
        />
        <label className="form-check-label" htmlFor={id}>
          {label}
        </label>
      </div>
    );
  }

  // ✅ Dropdown
  if (type === "select") {
    return (
      <div className="mb-3">
        {label && (
          <label htmlFor={id} className="form-label">
            {label}
          </label>
        )}
        <select
          id={id}
          className="form-select"
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value="">
            {placeholder || "Please select"}
          </option>
          {options.map((opt, index) => (
            <option key={index} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // ✅ Default Input (text, email, password, etc.)
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        type={type}
        className="form-control"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

export default InputField;
