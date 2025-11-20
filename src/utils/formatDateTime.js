// src/utils/formatDateTime.js
export const formatDateTime = (inputDate, formatType = "date") => {
  if (!inputDate) return "";

  const date = new Date(inputDate);
  const options = { timeZone: "Asia/Kolkata" };

  const day = date.toLocaleString("en-IN", { day: "2-digit", ...options });
  const month = date.toLocaleString("en-IN", { month: "short", ...options });
  const year = date.toLocaleString("en-IN", { year: "numeric", ...options });

  const formattedDate = `${day}-${month}-${year}`;

  // ✅ 12-hour format (AM/PM in uppercase)
  const time12hr = date
    .toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    })
    .replace("am", "AM")
    .replace("pm", "PM");

  const time12hrSec = date
    .toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    })
    .replace("am", "AM")
    .replace("pm", "PM");

  // ✅ 24-hour format
  const time24hr = date.toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });

  // 🔹 Full ISO-like string in IST
  const isoInIST = (() => {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST = UTC +5:30
    const istDate = new Date(date.getTime() + istOffset);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${istDate.getFullYear()}-${pad(istDate.getMonth() + 1)}-${pad(
      istDate.getDate()
    )}T${pad(istDate.getHours())}:${pad(istDate.getMinutes())}:${pad(
      istDate.getSeconds()
    )}+05:30`;
  })();

  // ✅ Return based on formatType
  switch (formatType) {
    case "date":
      return formattedDate;
    case "datetime":
      return `${formattedDate} ${time12hr}`;
    case "datetime-sec":
      return `${formattedDate} ${time12hrSec}`;
    case "time": // 24-hour format
      return time24hr;
    case "time-daytype": // 12-hour format with AM/PM
      return time12hr;
    case "full": // ISO-style IST
      return isoInIST;
    default:
      return formattedDate;
  }
};
