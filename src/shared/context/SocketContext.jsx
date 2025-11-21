// /src/shared/context/SocketContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import UserContext from "./UserContext";
import { showToast } from "../../utils/toastHelper";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(UserContext);

  // Connect socket
  useEffect(() => {
    socketRef.current = io("http://localhost:1100", {
      transports: ["websocket"],
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Register user to socket
  useEffect(() => {
    if (user?._id && socketRef.current) {
      socketRef.current.emit("register", user._id);
    }
  }, [user]);

  // ⚡ LISTEN FOR REAL-TIME NOTIFICATIONS
  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    socket.on("notification", (newNotification) => {
      showToast(newNotification.type, newNotification.title);
      // Add to list in real-time
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  });

  // mark notification as read locally
  const markAsReadLocal = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        notifications,
        setNotifications,
        markAsReadLocal,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
