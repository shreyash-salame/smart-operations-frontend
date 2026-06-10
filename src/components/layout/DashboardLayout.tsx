import { Box, Snackbar, Alert } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSide";
import AppHeader from "./AppHeader";
import { useAppDispatch, useAppSelector } from "@/store";
import { hideSnackbar } from "@/store/slices/uiSlice";
import CreateTaskDialog from "@/components/common/CreateTaskDialog";
import EditTaskDialog from "@/components/common/EditTaskDialog";
import CreateUserDialog from "@/components/common/CreateUserDialog";

export default function DashboardLayout() {
  const dispatch = useAppDispatch();
  const { sidebarOpen, snackbar } = useAppSelector((s) => s.ui);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <AppSidebar open={sidebarOpen} />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <AppHeader />
        <Box
          component="main"
          sx={{ flex: 1, overflow: "auto", p: 3, background: "#f5f5f5" }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Global dialogs */}
      <CreateTaskDialog />
      <EditTaskDialog />
      <CreateUserDialog />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => dispatch(hideSnackbar())}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => dispatch(hideSnackbar())}
          severity={snackbar.severity}
          variant="filled"
          sx={{ fontSize: "0.8125rem" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}