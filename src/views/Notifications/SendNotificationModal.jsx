import React, { useContext, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Form from "../../shared/components/reusableComponent/Form";
import UserContext from "../../shared/context/UserContext";
import { showToast } from "../../utils/toastHelper";
import { sendNotificationHelper } from "../../utils/sendNotificationHelper";

export default function SendNotificationModal({ open, onClose }) {
  const { user } = useContext(UserContext);
  const [sendTo, setSendTo] = useState("");

  // BASE FIELDS
  let fields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
    },
    {
      name: "message",
      label: "Message",
      type: "textarea",
      minRows: 3,
      required: true,
    },
    {
      name: "type",
      label: "Type",
      type: "select",
      required: true,
      options: [
        { label: "Info", value: "info" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Chat", value: "chat" },
        { label: "System", value: "system" },
      ],
    },
    {
      name: "sendTo",
      label: "Send To",
      type: "select",
      required: true,
      onChange: (e) => setSendTo(e.target.value),
      options: [
        { value: "developers", label: "All Developers" },
        { value: "managers", label: "All Project Managers" },
        { value: "specific", label: "Specific User" },
      ],
    },
  ];

  // 👉 If sendTo = "specific", add email input field

  if (sendTo === "specific") {
    fields.push({
      name: "email",
      label: "Enter Email",
      type: "text",
      required: true,
    });
  }

  const handleSubmit = async (formData) => {
    const res = await sendNotificationHelper({ user, formData });
    showToast(res.isSuccess ? "success" : "error", res.message);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontSize: 18, fontWeight: 700 }}>
        Send Notification
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Form
        fields={fields}
        onSubmit={handleSubmit}
        submitLabel="Send"
        isFullWidth={false}
      />
      <DialogContent dividers></DialogContent>
    </Dialog>
  );
}
