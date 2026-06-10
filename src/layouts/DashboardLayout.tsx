import {
  Box,
  Toolbar,
} from "@mui/material";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const DashboardLayout = () => {
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Header />

      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          background:
            "#F5F7FA",
          minHeight: "100vh",
        }}
      >
        <Toolbar />

        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;

// import { Outlet } from "react-router-dom";

// import Sidebar from "../components/layout/Sidebar";
// import Header from "../components/layout/Header";

// const DashboardLayout = () => {
//   return (
//     <div className="layout">
//       <Sidebar />

//       <div className="main-content">
//         <Header />

//         <div className="page-content">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;