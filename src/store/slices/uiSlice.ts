

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SnackbarSeverity = "success" | "error" | "warning" | "info";

interface UiState {
  sidebarOpen: boolean;
  snackbar: { open: boolean; message: string; severity: SnackbarSeverity };
  createTaskDialogOpen: boolean;
  editTaskDialogId: string | null;
  createUserDialogOpen: boolean;
}

const initialState: UiState = {
  sidebarOpen: true,
  snackbar: { open: false, message: "", severity: "info" },
  createTaskDialogOpen: false,
  editTaskDialogId: null,
  createUserDialogOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen(state, { payload }: PayloadAction<boolean>) { state.sidebarOpen = payload; },
    showSnackbar(state, { payload }: PayloadAction<{ message: string; severity?: SnackbarSeverity }>) {
      state.snackbar = { open: true, message: payload.message, severity: payload.severity ?? "info" };
    },
    hideSnackbar(state) { state.snackbar.open = false; },
    openCreateTask(state) { state.createTaskDialogOpen = true; },
    closeCreateTask(state) { state.createTaskDialogOpen = false; },
    openEditTask(state, { payload }: PayloadAction<string>) { state.editTaskDialogId = payload; },
    closeEditTask(state) { state.editTaskDialogId = null; },
    openCreateUser(state) { state.createUserDialogOpen = true; },
    closeCreateUser(state) { state.createUserDialogOpen = false; },
  },
});

export const {
  toggleSidebar, setSidebarOpen,
  showSnackbar, hideSnackbar,
  openCreateTask, closeCreateTask,
  openEditTask, closeEditTask,
  openCreateUser, closeCreateUser,
} = uiSlice.actions;
export default uiSlice.reducer;// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface UiState {
//   sidebarOpen: boolean;
//   snackbar: {
//     open: boolean;
//     message: string;
//     severity: "success" | "error" | "warning" | "info";
//   };
// }

// const initialState: UiState = {
//   sidebarOpen: true,
//   snackbar: { open: false, message: "", severity: "success" },
// };

// const uiSlice = createSlice({
//   name: "ui",
//   initialState,
//   reducers: {
//     toggleSidebar: (state) => {
//       state.sidebarOpen = !state.sidebarOpen;
//     },
//     setSidebarOpen: (state, action: PayloadAction<boolean>) => {
//       state.sidebarOpen = action.payload;
//     },
//     showSnackbar: (
//       state,
//       action: PayloadAction<{
//         message: string;
//         severity?: "success" | "error" | "warning" | "info";
//       }>
//     ) => {
//       state.snackbar = {
//         open: true,
//         message: action.payload.message,
//         severity: action.payload.severity || "success",
//       };
//     },
//     hideSnackbar: (state) => {
//       state.snackbar.open = false;
//     },
//   },
// });

// export const { toggleSidebar, setSidebarOpen, showSnackbar, hideSnackbar } =
//   uiSlice.actions;
// export default uiSlice.reducer;