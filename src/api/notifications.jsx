import API from "../utils/Interceptor"; // ✅ correct axios instance import

// Send notification (to role OR specific user)
export const sendNotification = async (payload) => {
  const res = await API.post("/notifications/send", payload);
  return res.data; // { isSuccess, message, data }
};

// Get all notifications for user
export const getNotifications = async (userId) => {
  const res = await API.get(`/notifications/user/${userId}`);
  return res.data.data;
};

// Mark as read
export const markNotificationRead = async (notificationId, userId) => {
  const res = await API.patch(`/notifications/read/${notificationId}`, {
    userId,
  });
  return res.data;
};

// Mark all as read
export const markAllRead = async (userId) => {
  const res = await API.patch(`/notifications/read-all`, { userId });
  return res.data;
};
