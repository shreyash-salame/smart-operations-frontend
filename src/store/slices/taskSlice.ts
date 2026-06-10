import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskStatus, TaskPriority } from "@/types";

interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  search?: string;
  page: number;
  limit: number;
}

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  filters: TaskFilters;
  totalPages: number;
  totalResults: number;
  isLoading: boolean;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  filters: { page: 1, limit: 20 },
  totalPages: 1,
  totalResults: 0,
  isLoading: false,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks(state, { payload }: PayloadAction<{ tasks: Task[]; totalPages: number; totalResults: number }>) {
      state.tasks = payload.tasks;
      state.totalPages = payload.totalPages;
      state.totalResults = payload.totalResults;
    },
    setSelectedTask(state, { payload }: PayloadAction<Task | null>) {
      state.selectedTask = payload;
    },
    setTaskFilters(state, { payload }: PayloadAction<Partial<TaskFilters>>) {
      state.filters = { ...state.filters, ...payload, page: payload.page ?? 1 };
    },
    resetTaskFilters(state) {
      state.filters = { page: 1, limit: 20 };
    },
  },
});

export const { setTasks, setSelectedTask, setTaskFilters, resetTaskFilters } = taskSlice.actions;
export default taskSlice.reducer;
