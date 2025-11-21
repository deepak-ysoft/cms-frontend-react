import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress, Fade } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import {
  addProject,
  getProjectById,
  updateProject,
} from "../../../api/ProjectApi";
import { getUsers } from "../../../api/userApi";

import Form from "../../../shared/components/reusableComponent/Form";
import { showToast } from "../../../utils/toastHelper";
import UserContext from "../../../shared/context/UserContext";
import { sendNotificationHelper } from "../../../utils/sendNotificationHelper";

function CreateProject() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const { mode, id } = useParams();
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState(null);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormLoading, setFormLoading] = useState(false);
  const { user } = useContext(UserContext);

  // ⭐ Load Managers
  const loadManagers = async () => {
    try {
      const data = await getUsers(1, 100, "", "Project Manager", true);
      const list = Array.isArray(data?.data?.users)
        ? data.data.users
        : data.data;

      return list.map((u) => ({
        label: `${u.firstName} ${u.lastName}`.trim(),
        value: u._id,
      }));
    } catch {
      return [];
    }
  };

  // ⭐ Load Initial Data (Managers + Project if editing)
  useEffect(() => {
    const init = async () => {
      setFormLoading(true);

      try {
        const managerList = await loadManagers();
        let formObj = {};
        const safeDate = (d) =>
          d && !isNaN(new Date(d))
            ? new Date(d).toISOString().split("T")[0]
            : "";
        if (isEdit && id) {
          const res = await getProjectById(id);

          const p = res.data;
          formObj = {
            name: p.name || "",
            description: p.description || "",
            managerId: p.manager?.id || "",

            status: p.status || "Active",
            priority: p.priority || "Medium",
            projectType: p.projectType || "Web",
            projectTech: p.projectTech || "",
            phase: p.phase || "Planning",

            clientName: p.client.name || "",
            clientEmail: p.client.email || "",
            clientPhone: p.client.phone || "",
            clientCompany: p.client.company || "",

            // ⭐ Fixed date fields (NO MORE CRASH!)
            startDate: safeDate(p.timeline.startDate),
            endDate: safeDate(p.timeline.endDate),
            deadline: safeDate(p.timeline.deadline),

            estimatedHours: p.timeline.estimatedHours || 0,
            actualHours: p.timeline.actualHours || 0,
            budget: p.financials.budget || 0,
            currency: p.financials.currency || "INR",
            attachments: p.attachments || null,
          };
          // 🚨 Fix: If current manager is missing, add it
          if (
            formObj.managerId &&
            !managerList.some((m) => m.value === formObj.managerId)
          ) {
            managerList.push({
              label: `${p.manager?.firstName || ""} ${
                p.manager?.lastName || ""
              }`.trim(),
              value: formObj.managerId,
            });
          }
        } else {
          formObj = {
            name: "",
            description: "",
            managerId: "",

            status: "Active",
            priority: "Medium",
            projectType: "Web",
            projectTech: "",
            phase: "Planning",

            clientName: "",
            clientEmail: "",
            clientPhone: "",
            clientCompany: "",

            // ⭐ Fixed date fields (NO MORE CRASH!)
            startDate: safeDate(Date.now(5)),
            endDate: safeDate(Date.now()),
            deadline: safeDate(Date.now()),

            estimatedHours: 0,
            actualHours: 0,
            budget: 0,
            currency: "INR",
            attachments: null,
          };
        }
        setManagers(managerList);
        setFormData(formObj);
      } finally {
        setFormLoading(false);
      }
    };

    init();
  }, [isEdit, id]);

  // ⭐ Form Fields
  const fields = [
    {
      name: "name",
      label: "Project Name",
      type: "text",
      defaultValue: formData?.name,
      required: true,
    },

    ...(role === "Admin"
      ? [
          {
            name: "managerId",
            label: "Project Manager",
            type: "select",
            required: true,
            defaultValue: formData?.managerId,
            options: managers,
          },
        ]
      : []),

    {
      name: "status",
      label: "Status",
      type: "select",
      defaultValue: formData?.status,
      required: true,
      options: [
        { label: "Active", value: "Active" },
        { label: "Pushed", value: "Pushed" },
        { label: "Completed", value: "Completed" },
        { label: "On Hold", value: "OnHold" },
        { label: "Cancelled", value: "Cancelled" },
      ],
    },

    {
      name: "priority",
      label: "Priority",
      type: "select",
      defaultValue: formData?.priority,
      required: true,
      options: [
        { label: "Low", value: "Low" },
        { label: "Medium", value: "Medium" },
        { label: "High", value: "High" },
        { label: "Critical", value: "Critical" },
      ],
    },

    {
      name: "projectType",
      label: "Project Type",
      type: "select",
      defaultValue: formData?.projectType,
      required: true,
      options: [
        { label: "Web", value: "Web" },
        { label: "Mobile", value: "Mobile" },
        { label: "Backend", value: "Backend" },
        { label: "Fullstack", value: "Fullstack" },
        { label: "Maintenance", value: "Maintenance" },
      ],
    },
    {
      name: "projectTech",
      label: "Project Technology",
      defaultValue: formData?.projectTech,
      type: "text",
      required: true,
    },
    {
      name: "phase",
      label: "Phase",
      type: "select",
      defaultValue: formData?.phase,
      required: true,
      options: [
        { label: "Planning", value: "Planning" },
        { label: "Design", value: "Design" },
        { label: "Development", value: "Development" },
        { label: "Testing", value: "Testing" },
        { label: "Deployment", value: "Deployment" },
        { label: "Maintenance", value: "Maintenance" },
      ],
    },
    {
      name: "clientName",
      label: "Client Name",
      defaultValue: formData?.clientName,
      type: "text",
      required: true,
      rules: {
        maxLength: { value: 50, message: "Name cannot exceed 50 characters" },
      },
    },
    {
      name: "clientEmail",
      label: "Client Email",
      defaultValue: formData?.clientEmail,
      type: "email",
      required: true,
      rules: {
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email format",
        },
      },
    },
    {
      name: "clientPhone",
      label: "Client Phone",
      defaultValue: formData?.clientPhone,
      type: "text",
      rules: {
        pattern: {
          value: /^\+?[0-9]{7,15}$/,
          message: "Enter a valid phone number",
        },
      },
    },
    {
      name: "clientCompany",
      label: "Client Company",
      defaultValue: formData?.clientCompany,
      type: "text",
    },
    {
      name: "startDate",
      label: "Start Date",
      defaultValue: formData?.startDate,
      type: "date",
      required: true,
      rules: { required: "Start date is required" },
    },
    {
      name: "endDate",
      label: "End Date",
      defaultValue: formData?.endDate,
      type: "date",
      required: true,
      rules: {
        required: "End date is required",
        validate: (value, formValues) => {
          if (new Date(value) < new Date(formValues.startDate)) {
            return "End date cannot be before start date";
          }
          return true;
        },
      },
    },
    {
      name: "deadline",
      label: "Deadline",
      defaultValue: formData?.deadline,
      type: "date",
      required: true,
      rules: {
        validate: (value, formValues) => {
          if (new Date(value) < new Date(formValues.startDate)) {
            return "Deadline cannot be before start date";
          }
          return true;
        },
      },
    },

    {
      name: "estimatedHours",
      label: "Estimated Hours",
      defaultValue: formData?.estimatedHours,
      type: "number",
      required: true,
      rules: {
        min: { value: 1, message: "Must be greater than 0" },
      },
    },

    {
      name: "actualHours",
      label: "Actual Hours",
      defaultValue: formData?.actualHours,
      type: "number",
      required: true,
      rules: {
        min: { value: 1, message: "Must be greater than 0" },
      },
    },

    {
      name: "budget",
      label: "Budget",
      defaultValue: formData?.budget,
      type: "number",
      required: true,
      rules: {
        min: { value: 0, message: "Budget cannot be negative" },
      },
    },
    {
      name: "currency",
      label: "Currency",
      type: "select",
      defaultValue: formData?.currency,
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
    {
      name: "attachments",
      label: "Project Attachments",
      type: "file",
      multiple: true,
      accept: ".pdf,.doc,.jpg,.png",
      required: false,
    },
    {
      name: "description",
      label: "Description",
      defaultValue: formData?.description,
      type: "textarea",
      minRows: 3,
      rules: {
        maxLength: {
          value: 500,
          message: "Description too long (max 500 chars)",
        },
      },
    },
  ];

  // ⭐ Submit Handler
  const handleSubmit = async (data) => {
    setLoading(true);

    try {
      const payload = new FormData(); // ✅ For file upload

      // Append all fields
      Object.keys(data).forEach((key) => {
        const value = data[key];

        if (key === "attachments") {
          // ✅ Normalize: always handle as array
          const files = Array.isArray(value) ? value : value ? [value] : [];

          files.forEach((file) => payload.append("attachments", file));
        } else {
          payload.append(key, value);
        }
      });

      const result = isEdit
        ? await updateProject(id, payload)
        : await addProject(payload);

      if (result?.isSuccess) {
        let techList = Array.isArray(result?.data?.projectTech)
          ? result?.data.projectTech
          : typeof result?.data?.projectTech === "string"
          ? result?.data.projectTech.split(",")
          : [];
        let payload;
        if (user.role === "Admin") {
          payload = {
            title: isEdit
              ? `Project "${result?.data?.name}" Updated`
              : `Assigned as Project Manager for "${result?.data?.name}"`,

            message: isEdit
              ? `
The project **${result?.data?.name}** (Code: ${
                  result?.data?.projectCode
                }) has been updated by the administrator. This update may include changes to the project details, timeline, priority, technologies, or client information.

**Key Updates:**
• Status: ${result?.data?.status}
• Priority: ${result?.data?.priority}
• Type: ${result?.data?.projectType}
• Technologies: ${techList.join(", ")}
• Client: ${result?.data?.clientName} (${result?.data?.clientEmail})
• Start: ${new Date(result?.data?.startDate).toDateString()}
• End: ${new Date(result?.data?.endDate).toDateString()}
• Deadline: ${new Date(result?.data?.deadline).toDateString()}

Please review the updated project information to ensure alignment with your schedule and responsibilities.
`
              : `
You have been assigned as the **Project Manager** for the newly created project **${
                  result?.data?.name
                }** (Code: ${result?.data?.projectCode}).

**Project Overview:**
• Client: ${result?.data?.clientName} (${result?.data?.clientEmail})
• Status: ${result?.data?.status}
• Priority: ${result?.data?.priority}
• Type: ${result?.data?.projectType}
• Technologies: ${techList.join(", ")}
• Start: ${new Date(result?.data?.startDate).toDateString()}
• End: ${new Date(result?.data?.endDate).toDateString()}
• Deadline: ${new Date(result?.data?.deadline).toDateString()}

Kindly review the project details and begin planning task distribution, timelines, and coordination activities.
`,

            type: "info",
            sendTo: "specific",
            senderId: user._id,
            email: result.data?.managerMail,
            meta: {},
          };
        } else {
          payload = {
            title: isEdit
              ? `Project "${result?.data?.name}" Updated By "${result?.data?.managerMail}"`
              : `New Project "${result?.data?.name}" Created By "${result?.data?.managerMail}"`,

            message: isEdit
              ? `
The project **${result?.data?.name}** (Code: ${
                  result?.data?.projectCode
                }) has been updated by the  By "${
                  result?.data?.managerMail
                }". This update may include changes to the project details, timeline, priority, technologies, or client information.

**Key Updates:**
• Status: ${result?.data?.status}
• Priority: ${result?.data?.priority}
• Type: ${result?.data?.projectType}
• Technologies: ${techList.join(", ")}
• Client: ${result?.data?.clientName} (${result?.data?.clientEmail})
• Start: ${new Date(result?.data?.startDate).toDateString()}
• End: ${new Date(result?.data?.endDate).toDateString()}
• Deadline: ${new Date(result?.data?.deadline).toDateString()}

Please review the updated project information to ensure alignment with your schedule and responsibilities.
`
              : `
New Project **${result?.data?.name}** (Code: ${
                  result?.data?.projectCode
                }) Created By "${result?.data?.managerMail}".

**Project Overview:**
• Client: ${result?.data?.clientName} (${result?.data?.clientEmail})
• Status: ${result?.data?.status}
• Priority: ${result?.data?.priority}
• Type: ${result?.data?.projectType}
• Technologies: ${techList.join(", ")}
• Start: ${new Date(result?.data?.startDate).toDateString()}
• End: ${new Date(result?.data?.endDate).toDateString()}
• Deadline: ${new Date(result?.data?.deadline).toDateString()}

Kindly review the project details and begin planning task distribution, timelines, and coordination activities.
`,
            type: "info",
            sendTo: "admin",
            senderId: result?.data?.manager,
            meta: {},
          };
        }

        await sendNotificationHelper({ user: user, formData: payload });
        showToast(
          "success",
          `Project ${isEdit ? "updated" : "created"} successfully!`
        );
        navigate("/projects");
      } else {
        showToast("error", result?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      showToast("error", "Failed to upload project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          width: "100%",
          minHeight: "calc(100vh - 180px)",
          display: "flex",
          justifyContent: "center",
          p: { xs: 1.5, md: 5 },
          backgroundColor: "#f9fafc",
        }}
      >
        <Paper sx={{ width: "100%", borderRadius: 3 }}>
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
            <Typography variant="h6" fontWeight={600} color="primary.main">
              {isEdit ? "Edit Project" : "Add Project"}
            </Typography>
          </Box>

          {/* Form — ⭐ Key added so defaultValues update properly */}
          <Form
            key={JSON.stringify(formData)}
            fields={fields}
            defaultValues={formData}
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            isLoading={loading}
            isFormLoading={isFormLoading}
            isEdit={isEdit}
            submitLabel={isEdit ? "Update Project" : "Create Project"}
          />
        </Paper>
      </Box>
    </Fade>
  );
}

export default CreateProject;
