import React, { useEffect, useState } from "react";
import Form from "../../../../../shared/components/reusableComponent/Form";
import {
  addInvoice,
  getInvoiceById,
  updateInvoice,
} from "../../../../../api/invoiceApi";
import { getContractByProject } from "../../../../../api/Contract";
import { Box, Typography, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

export default function InvoiceForm() {
  const { mode, projectId, id } = useParams();
  const isEdit = mode === "edit";
  const [contracts, setContracts] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFormLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await getContractByProject(projectId);

        if (Array.isArray(res?.data) && res.data.length > 0) {
          const formattedContracts = res.data.map((c) => ({
            _id: c._id || c.id, // normalize key
            contractName: c.contractName || c.name || "Unnamed Contract",
          }));
          setContracts(formattedContracts);
        } else {
          setContracts([]); // no contracts found
        }
      } catch (err) {
        console.error("Error loading contracts", err);
        setContracts([]);
      }
    };

    fetchContracts();
  }, [projectId]);

  useEffect(() => {
    if (isEdit && id) {
      const fetchInvoice = async () => {
        try {
          setFormLoading(true);
          const res = await getInvoiceById(id);
          if (res?.data) {
            setFormData(res.data);
            // Ensure contract exists
            setContracts((prev) => {
              const exists = prev.some((c) => c._id === res.data.contractId);
              if (!exists && res.data.contractId && res.data.contractName) {
                return [
                  ...prev,
                  {
                    _id: res.data.contractId,
                    contractName: res.data.contractName,
                  },
                ];
              }
              return prev;
            });
          }
        } finally {
          setFormLoading(false);
        }
      };
      fetchInvoice();
    }
  }, [isEdit, id]);

  const fields = [
    {
      name: "contractId",
      label: "Select Contract",
      type: "select",
      required: true,
      options: contracts.map((c) => ({
        label: c.contractName,
        value: c._id,
      })),
    },
    { name: "clientName", label: "Client Name", required: true },
    { name: "clientEmail", label: "Client Email" },
    {
      name: "billingAddress",
      label: "Billing Address",
      rules: {
        maxLength: {
          value: 45,
          message: "Billing Address cannot exceed 45 characters",
        },
      },
    },
    {
      name: "currency",
      label: "Currency",
      type: "select",
      required: true,
      options: [
        { label: "Indian Rupee (₹)", value: "INR" },
        { label: "US Dollar ($)", value: "USD" },
        { label: "Euro (€)", value: "EUR" },
        { label: "British Pound (£)", value: "GBP" },
        { label: "Australian Dollar (A$)", value: "AUD" },
        { label: "Canadian Dollar (C$)", value: "CAD" },
        { label: "UAE Dirham (د.إ)", value: "AED" },
        { label: "Japanese Yen (¥)", value: "JPY" },
        { label: "Chinese Yuan (¥)", value: "CNY" },
        { label: "Singapore Dollar (S$)", value: "SGD" },
      ],
    },
    { name: "amount", label: "Amount", type: "number", required: true },
    { name: "discount", label: "Discount (%)", type: "number" },
    { name: "taxRate", label: "Tax (%)", type: "number" },
    { name: "dueDate", label: "Due Date", type: "date", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Pending", value: "Pending" },
        { label: "Paid", value: "Paid" },
        { label: "Overdue", value: "Overdue" },
      ],
    },
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: "select",
      options: [
        { label: "Bank Transfer", value: "Bank Transfer" },
        { label: "UPI", value: "UPI" },
        { label: "Credit Card", value: "Credit Card" },
        { label: "Cash", value: "Cash" },
      ],
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      fullWidth: true,
      minRows: 2,
    },
  ];

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const res = isEdit
        ? await updateInvoice(id, { ...data, projectId })
        : await addInvoice({ ...data, projectId });
      if (res.isSuccess) navigate(-1);
    } catch (err) {
      console.error("Error saving invoice", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ pb: 3, borderRadius: 3, boxShadow: 3, m: {xs:1.5,md:5} }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        sx={{
          background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
          p: 3,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <Typography variant="h6" color="primary.main" fontWeight={600}>
          {isEdit ? "Edit Invoice" : "Create Invoice"}
        </Typography>
      </Box>
      <Form
        fields={fields.map((f) => ({
          ...f,
          defaultValue:
            f.type === "date" && formData[f.name]
              ? new Date(formData[f.name]).toISOString().split("T")[0]
              : formData[f.name] || "",
        }))}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        isLoading={loading}
        isFormLoading={isFormLoading}
        isEdit={isEdit}
        submitLabel={isEdit ? "Update Invoice" : "Add Invoice"}
      />
    </Paper>
  );
}
