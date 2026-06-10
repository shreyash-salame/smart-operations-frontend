import {
  createSlice,
} from "@reduxjs/toolkit";

import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  assignTask,
} from "./taskThunks";

import { TaskState } from "./taskTypes";

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,

  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,

  totalResults: 0,
  totalPages: 0,
  page: 1,
  limit: 10,

  error: null,
};

const taskSlice = createSlice({
  name: "task",

  initialState,

  reducers: {
    clearTaskError(state) {
      state.error = null;
    },

    clearSelectedTask(state) {
      state.selectedTask = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // GET TASKS

      .addCase(
        getTasks.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        getTasks.fulfilled,
        (state, action) => {
          state.loading = false;

          state.tasks =
            action.payload.results || [];

          state.page =
            action.payload.page || 1;

          state.limit =
            action.payload.limit || 10;

          state.totalPages =
            action.payload.totalPages || 0;

          state.totalResults =
            action.payload.totalResults || 0;
        }
      )

      .addCase(
        getTasks.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      )

      // GET SINGLE TASK

      .addCase(
        getTaskById.fulfilled,
        (state, action) => {
          state.selectedTask =
            action.payload;
        }
      )

      // CREATE TASK

      .addCase(
        createTask.pending,
        (state) => {
          state.createLoading = true;
        }
      )

      .addCase(
        createTask.fulfilled,
        (state, action) => {
          state.createLoading = false;

          state.tasks.unshift(
            action.payload
          );
        }
      )

      .addCase(
        createTask.rejected,
        (state, action) => {
          state.createLoading = false;

          state.error =
            action.payload as string;
        }
      )

      // UPDATE TASK

      .addCase(
        updateTask.pending,
        (state) => {
          state.updateLoading = true;
        }
      )

      .addCase(
        updateTask.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          const index =
            state.tasks.findIndex(
              (task) =>
                task.id ===
                action.payload.id
            );

          if (index !== -1) {
            state.tasks[index] =
              action.payload;
          }

          state.selectedTask =
            action.payload;
        }
      )

      .addCase(
        updateTask.rejected,
        (state, action) => {
          state.updateLoading = false;

          state.error =
            action.payload as string;
        }
      )

      // DELETE

      .addCase(
        deleteTask.pending,
        (state) => {
          state.deleteLoading = true;
        }
      )

      .addCase(
        deleteTask.fulfilled,
        (state, action) => {
          state.deleteLoading = false;

          state.tasks =
            state.tasks.filter(
              (task) =>
                task.id !== action.payload
            );
        }
      )

      .addCase(
        deleteTask.rejected,
        (state, action) => {
          state.deleteLoading = false;

          state.error =
            action.payload as string;
        }
      )

      // STATUS

      .addCase(
        updateTaskStatus.fulfilled,
        (state, action) => {
          const index =
            state.tasks.findIndex(
              (task) =>
                task.id ===
                action.payload.id
            );

          if (index !== -1) {
            state.tasks[index] =
              action.payload;
          }
        }
      )

      // ASSIGN

      .addCase(
        assignTask.fulfilled,
        (state, action) => {
          const index =
            state.tasks.findIndex(
              (task) =>
                task.id ===
                action.payload.id
            );

          if (index !== -1) {
            state.tasks[index] =
              action.payload;
          }
        }
      );
  },
});

export const {
  clearTaskError,
  clearSelectedTask,
} = taskSlice.actions;

export default taskSlice.reducer;