import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { Save } from "@mui/icons-material";

import Form from "../../../../shared/components/reusableComponent/Form";
import {
  getWorkLogById,
  submitWorkLog,
  updateWorkLog,
} from "../../../../api/WorkLogApi";

import { showToast } from "../../../../utils/toastHelper";
import { formatDateTime } from "../../../../utils/formatDateTime";
import { sendNotificationHelper } from "../../../../utils/sendNotificationHelper";
import UserContext from "../../../../shared/context/UserContext";

export default function SubmitWorkLog({ mode = "create", onCancel }) {
  const { projectId, workLogId, from } = useParams();
  const isEdit = mode === "edit";
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFormLoading, setFormLoading] = useState(false);
  const role = localStorage.getItem("role");
  const { user } = useContext(UserContext);

  // Fetch worklog details
  useEffect(() => {
    if (isEdit && workLogId) fetchWorkLogDetails(workLogId);
  }, [isEdit]);

  const fetchWorkLogDetails = async (id) => {
    try {
      setFormLoading(true);
      const res = await getWorkLogById(id);

      if (res) {
        setFormData({
          title: res.title,
          status: res.status || "ToDo",
          date: res.date
            ? new Date(res.date).toISOString().split("T")[0]
            : today,
          startTime: res.startTime ? formatDateTime(res.startTime, "time") : "",
          endTime: res.endTime ? formatDateTime(res.endTime, "time") : "",
          hours: res.hours,
          approvalStatus: res.approvalStatus || "Pending",
          description: res.description || "",
          isBillable: res.isBillable || false,
          projectPhase: res.projectPhase || "NA",
        });
      }
    } catch (err) {
      console.error("Error fetching work log:", err);
    } finally {
      setFormLoading(false);
    }
  };

  // Form fields
  const fields = [
    { name: "title", label: "Title", required: true },

    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "To Do", value: "ToDo" },
        { label: "In Progress", value: "InProgress" },
        { label: "Blocked", value: "Blocked" },
        { label: "Completed", value: "Completed" },
        { label: "Reviewed", value: "Reviewed" },
      ],
    },

    { name: "startTime", label: "Start Time", type: "time", required: true },
    { name: "endTime", label: "End Time", type: "time", required: true },

    { name: "projectPhase", label: "Project Phase" },

    {
      name: "attachments",
      label: "Attachments",
      type: "file",
      multiple: false,
    },

    ...(isEdit && role === "Admin"
      ? [
          {
            name: "approvalStatus",
            label: "Approval Status",
            type: "select",
            required: true,
            options: [
              { label: "Pending", value: "Pending" },
              { label: "Approved", value: "Approved" },
              { label: "Rejected", value: "Rejected" },
            ],
          },
        ]
      : []),

    {
      name: "description",
      label: "Description",
      type: "textarea",
      fullWidth: true,
      minRows: 2,
    },

    {
      name: "isBillable",
      label: "Billable Work",
      type: "checkbox",
    },
  ];

  // Submit Handler
  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const todayDate = new Date().toISOString().split("T")[0];

      let startTimeFull = null;
      let endTimeFull = null;

      if (data.startTime && data.endTime) {
        startTimeFull = new Date(`${todayDate}T${data.startTime}`);
        endTimeFull = new Date(`${todayDate}T${data.endTime}`);

        if (endTimeFull <= startTimeFull) {
          showToast("warning", "Start time must be less than end time.");
        }
      }

      const payload = new FormData();

      const baseData = {
        projectId,
        title: data.title,
        status: data.status || "ToDo",
        date: todayDate,
        startTime: startTimeFull?.toISOString() || "",
        endTime: endTimeFull?.toISOString() || "",
        approvalStatus: data?.approvalStatus ?? formData.approvalStatus,
        description: data.description,
        isBillable: !!data.isBillable,
        projectPhase: data.projectPhase,
      };
      Object.entries(baseData).forEach(([key, val]) => {
        payload.append(key, val ?? "");
      });

      // Attach file if exists
      if (data.attachments) {
        payload.append("attachments", data.attachments);
      }

      // API Call
      const res = isEdit
        ? await updateWorkLog(workLogId, payload)
        : await submitWorkLog(payload);

      showToast(res.isSuccess ? "success" : "error", res.message);
      if (res.isSuccess) {
        // Navigation
        if (from === "Admin") {
          const notificationData = {
            title: `Your Worklog "${res?.data?.title}" Has Been Updated by the Admin`,
            message: `
Your worklog entry has been updated by the admin. Please review the latest details below:

**Updated Worklog Details:**
• Title: ${res.data.title}
• Status: ${res.data.status}
• Date: ${new Date(res.data.date).toDateString()}
• Start Time: ${new Date(res.data.startTime).toLocaleTimeString()}
• End Time: ${new Date(res.data.endTime).toLocaleTimeString()}
• Total Hours: ${res.data.hours}
• Approval Status: ${res.data.approvalStatus}

If you notice any discrepancies, kindly reach out to your project manager or admin.
`,
            type: "info",
            sendTo: "specific",
            email: res?.data?.developer?.email,
            meta: {},
          };

          await sendNotificationHelper({
            user: user,
            formData: notificationData,
          });

          navigate(`/projects/ProjectDetails/${projectId}/worklogs`);
        } else {
          navigate(`/developer/worklogs`);
        }
      }
    } catch (err) {
      console.error("Error submitting work log:", err);
      showToast("error", err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // if (loading)
  //   return (
  //     <Box textAlign="center" mt={3}>
  //       <CircularProgress />
  //       <p>Loading work log...</p>
  //     </Box>
  //   );

  return (
    <Paper sx={{ m: { xs: 1.5, md: 5 }, pb: 3, borderRadius: 3, boxShadow: 3 }}>
      {/* Header */}
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
          {isEdit ? "Edit Work Log" : "Submit Work Log"}
        </Typography>
      </Box>

      {/* Form */}
      <Form
        fields={fields.map((f) => ({
          ...f,
          defaultValue:
            f.type === "date" && formData[f.name]
              ? new Date(formData[f.name]).toISOString().split("T")[0]
              : formData[f.name] || "",
        }))}
        onSubmit={handleSubmit}
        onCancel={onCancel || (() => navigate(-1))}
        isLoading={loading}
        isFormLoading={isFormLoading}
        isEdit={isEdit}
        submitLabel={isEdit ? "Update Log" : "Submit Log"}
        startIcon={<Save />}
      />
    </Paper>
  );
}
