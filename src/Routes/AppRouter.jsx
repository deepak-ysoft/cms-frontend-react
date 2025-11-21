import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import InvoiceForm from "../views/Projects/ProjectDetailsTab/InvoiceIndex/InvoiceForm";
import InvoiceDetails from "../views/Projects/ProjectDetailsTab/InvoiceIndex/InvoiceDetails";
import AllInvoiceList from "../views/Invoice/InvoiceList";
import ResetPassword from "../views/Auth/ResetPassword";
import NotificationsPage from "../views/Notifications";

// 🔹 Lazy loaded components

const AdminDashboard = lazy(() => import("../views/AdminDashboard"));
const DeveloperDashboard = lazy(() => import("../views/DeveloperDashboard"));
const MyProjects = lazy(() => import("../views/Developer/MyProjects"));
const DeveloperProjectDetails = lazy(() =>
  import("../views/Developer/MyProjects/DeveloperProjectDetails")
);
const Login = lazy(() => import("../views/Auth/Login"));
const Register = lazy(() => import("../views/Auth/Register"));
const ForgotPassword = lazy(() => import("../views/Auth/ForgotPassword"));
const UserList = lazy(() => import("../views/User/UserList"));
const UserUpdate = lazy(() => import("../views/User/UserUpdate"));
const UserProfile = lazy(() => import("../views/User/Profile"));
const UserDetails = lazy(() => import("../views/User/UserDetails"));
const ProjectList = lazy(() => import("../views/Projects/ProjectList"));
const CreateProject = lazy(() => import("../views/Projects/CreateProject"));
const ContractDetails = lazy(() =>
  import("../views/Projects/ProjectDetailsTab/Contracts/ContractDetails")
);
const ContractList = lazy(() => import("../views/Contract/getContracts"));

const SubmitWorkLog = lazy(() =>
  import("../views/Developer/WorkLogList/SubmitWorkLog")
);
const WorkLogList = lazy(() => import("../views/Developer/WorkLogList"));
const WorkLogDetails = lazy(() =>
  import("../views/Projects/ProjectDetailsTab/WorkLogDetails")
);
const TabComponent = lazy(() =>
  import("../shared/components/reusableComponent/TabPanel")
);
const ProjectDetailsTab = lazy(() =>
  import("../views/Projects/ProjectDetailsTab")
);

function AppRouter() {
  return (
    <>
      {/* 🔹 Suspense fallback while lazy components load */}
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/userList" element={<UserList />} />
            <Route
              path="/userList/userUpdate"
              element={<UserUpdate mode="edit" />}
            />
            <Route
              path="/userList/userCreate"
              element={<UserUpdate mode="create" />}
            />
            <Route path="/userProfile" element={<UserProfile />} />
            <Route path="/userList/userDetails" element={<UserDetails />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route
              path="/projects/createprojects"
              element={<CreateProject />}
            />
            <Route
              path="/projects/updateprojects/:mode/:id"
              element={<CreateProject />}
            />
            <Route path="/tabComponent" element={<TabComponent />} />
            <Route
              path="/projects/:projectId/worklogs/edit/:workLogId/:from"
              element={<SubmitWorkLog mode="edit" />}
            />
            <Route path="/contracts" element={<ContractList />} />
            <Route
              path="/contracts/details/:id"
              element={<ContractDetails />}
            />
            <Route
              path="/projects/:projectId/contract/contractDetails/:id"
              element={<ContractDetails />}
            />
            <Route
              path="/projects/ProjectDetails/:id/:tab?"
              element={<ProjectDetailsTab />}
            />
            <Route
              path="/projects/ProjectDetails/:projectId/invocies/createInvoice/:mode"
              element={<InvoiceForm />}
            />
            <Route
              path="/projects/ProjectDetails/:projectId/invocies/updateInvoice/:mode/:id"
              element={<InvoiceForm />}
            />
            <Route
              path="/projects/ProjectDetails/:projectId/invocies/invoiceDetails/:id"
              element={<InvoiceDetails />}
            />
            <Route path="AllInvoiceList" />
            <Route path="/invocies" element={<AllInvoiceList />} />
            <Route
              path="/invocies/updateInvoice/:mode/:id"
              element={<InvoiceForm />}
            />
            <Route
              path="/invocies/invoiceDetails/:id"
              element={<InvoiceDetails />}
            />
            <Route
              path="/developerDashboard"
              element={<DeveloperDashboard />}
            />
            <Route path="/developer/projects" element={<MyProjects />} />
            <Route
              path="/developer/projects/:id"
              element={<DeveloperProjectDetails />}
            />
            <Route path="/developer/workLogs" element={<WorkLogList />} />
            <Route
              path="/developer/workLogs/add/:projectId"
              element={<SubmitWorkLog mode="create" />}
            />
            <Route
              path="/developer/workLogs/:projectId/edit/:workLogId"
              element={<SubmitWorkLog mode="edit" />}
            />
            <Route
              path="/developer/worklogs/:id"
              element={<WorkLogDetails />}
            />
            <Route path="/projects/worklogs/:id" element={<WorkLogDetails />} />
            <Route
              path="/projects/worklogs/add/:projectId"
              element={<SubmitWorkLog mode="create" />}
            />
            <Route
              path="/projects/:projectId/worklogs/edit/:workLogId"
              element={<SubmitWorkLog mode="edit" />}
            />
          </Route>
        </Routes>
      </Suspense>

      {/* 🔹 Global Toast Container (works everywhere) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default AppRouter;
