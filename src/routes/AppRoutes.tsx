import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "@/store";
import DashboardLayout from "../components/layout/DashboardLayout";
import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import TasksPage from "../pages/tasks/TasksPage";
import TaskDetailPage from "../pages/tasks/TaskdetailPage";
import TeamPage from "../pages/team/TeamPage";
import ActivityPage from "../pages/activity/ActivityPage";
import NotificationsPage from "../pages/notification/NotificationsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"        element={<DashboardPage />} />
        <Route path="tasks"            element={<TasksPage />} />
        <Route path="tasks/:id"        element={<TaskDetailPage />} />
        <Route path="team"             element={<TeamPage />} />
        <Route path="activity"         element={<ActivityPage />} />
        <Route path="notifications"    element={<NotificationsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

// import {
//   BrowserRouter,
//   Routes,
//   Route,
// } from "react-router-dom";

// import DashboardLayout from "../layouts/DashboardLayout";
// import AuthLayout from "../layouts/AuthLayout";

// import ProtectedRoute from "./ProtectedRoute";
// import PublicRoute from "./PublicRoute";
// import RoleGuard from "./RoleGuard";

// import Login from "../pages/Login";
// // import ForgotPassword from "../pages/auth/ForgotPassword";

// import Dashboard from "../pages/DashBoard";

// // import Tasks from "../pages/tasks/Tasks";
// // import AddTask from "../pages/tasks/AddTask";
// // import EditTask from "../pages/tasks/EditTask";
// // import TaskDetails from "../pages/tasks/TaskDetails";

// // import Users from "../pages/users/Users";
// // import AddUser from "../pages/users/AddUser";
// // import EditUser from "../pages/users/EditUser";

// // import Team from "../pages/team/Team";

// // import ActivityLogs from "../pages/activity/ActivityLogs";

// // import Notifications from "../pages/notifications/Notifications";

// // import Settings from "../pages/settings/Settings";

// // import NotFound from "../pages/NotFound";

// const AppRoutes = () => {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* PUBLIC */}

//         <Route element={<PublicRoute />}>
//           <Route element={<AuthLayout />}>
//             <Route
//               path="/login"
//               element={<Login />}
//             />

//             {/* <Route
//               path="/forgot-password"
//               element={<ForgotPassword />}
//             /> */}
//           </Route>
//         </Route>

//         {/* PRIVATE */}

//         <Route element={<ProtectedRoute />}>
//           <Route element={<DashboardLayout />}>

//             <Route
//               path="/"
//               element={<Dashboard />}
//             />

//             {/* TASKS */}

//             {/* <Route
//               path="/tasks"
//               element={<Tasks />}
//             /> */}

//             {/* <Route
//               path="/tasks/new"
//               element={<AddTask />}
//             />

//             <Route
//               path="/tasks/edit/:id"
//               element={<EditTask />}
//             />

//             <Route
//               path="/tasks/:id"
//               element={<TaskDetails />}
//             /> */}

//             {/* TEAM */}

//             {/* <Route
//               path="/team"
//               element={<Team />}
//             /> */}

//             {/* ACTIVITY */}

//             {/* <Route
//               path="/activity"
//               element={<ActivityLogs />}
//             /> */}

//             {/* NOTIFICATIONS */}

//             {/* <Route
//               path="/notifications"
//               element={<Notifications />}
//             /> */}

//             {/* SETTINGS */}

//             {/* <Route
//               path="/settings"
//               element={<Settings />}
//             /> */}

//             {/* ADMIN ONLY */}

//             {/* <Route
//               path="/users"
//               element={
//                 <RoleGuard
//                   allowedRoles={[
//                     "admin",
//                     "manager",
//                   ]}
//                 >
//                   <Users />
//                 </RoleGuard>
//               }
//             />

//             <Route
//               path="/users/new"
//               element={
//                 <RoleGuard
//                   allowedRoles={[
//                     "admin",
//                   ]}
//                 >
//                   <AddUser />
//                 </RoleGuard>
//               }
//             />

//             <Route
//               path="/users/edit/:id"
//               element={
//                 <RoleGuard
//                   allowedRoles={[
//                     "admin",
//                   ]}
//                 >
//                   <EditUser />
//                 </RoleGuard>
//               }
//             /> */}

//           </Route>
//         </Route>

//         {/* NOT FOUND */}

//         {/* <Route
//           path="*"
//           element={<NotFound />}
//         /> */}
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default AppRoutes;