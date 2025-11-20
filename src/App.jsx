import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRouter from "./Routes/AppRouter";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./shared/context/UserContext";
import { useState } from "react";
import { GlobalStyles } from "@mui/material";

import { SocketProvider } from "./shared/context/SocketContext"; // ← ADD THIS

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <SocketProvider>
        {" "}
        {/* ← WRAP HERE */}
        <BrowserRouter>
          <GlobalStyles
            styles={{
              ".recharts-wrapper *:focus": {
                outline: "none !important",
              },
            }}
          />
          <AppRouter />
          <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
        </BrowserRouter>
      </SocketProvider>
    </UserContext.Provider>
  );
}

export default App;
