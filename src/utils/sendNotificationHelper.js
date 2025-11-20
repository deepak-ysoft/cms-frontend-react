// src/utils/sendNotificationHelper.js

import { sendNotification } from "../api/notifications";

/**
 * Send a notification.
 *
 * @param {Object} params
 * @param {Object} params.user - Current user object.
 * @param {Object} params.formData - Notification details.
 * @param {string} params.formData.title - Notification title.
 * @param {string} params.formData.message - Notification message.
 * @param {string} params.formData.type - Notification type.
 * @param {string} params.formData.sendTo - "developers" | "managers" | "specific".
 * @param {string} [params.formData.email] - Required if sendTo === "specific".
 * @returns {Promise<Object>} Response from API.
 */
export const sendNotificationHelper = async ({ user, formData }) => {
  try {
    let dataObj = {};

    // If formData is FormData → convert to object
    if (formData instanceof FormData) {
      formData.forEach((value, key) => {
        try {
          dataObj[key] = JSON.parse(value); // meta object case
        } catch {
          dataObj[key] = value;
        }
      });
    } else {
      // Already a JS object
      dataObj = formData;
    }

    const payload = {
      title: dataObj.title,
      message: dataObj.message,
      type: dataObj.type,
      senderId: user?._id,
      meta: dataObj.meta || {},
    };

    const sendTo = dataObj.sendTo;

    if (sendTo === "admin") payload.role = "Admin";
    else if (sendTo === "developers") payload.role = "Developer";
    else if (sendTo === "managers") payload.role = "ProjectManager";
    else if (sendTo === "specific") payload.email = dataObj.email;

    const res = await sendNotification(payload);
    return res;
  } catch (error) {
    console.error("Failed to send notification:", error);
    throw error;
  }
};
