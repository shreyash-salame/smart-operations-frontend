import { apiSlice } from "./apiSlice";
import type { ApiResponse, PaginatedResponse, Task, CreateTaskPayload, UpdateTaskPayload } from "@/types";

// interface TaskFilterPayload {
//   page?: number;
//   limit?: number;
//   status?: string;
//   priority?: string;
//   assignedTo?: string;
//   department?: string;
//   project?: string;
//   search?: string;
//   isAtRisk?: boolean;
// }
interface TaskFilterPayload {
  page?: number;
  limit?: number;

  filterOptions?: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    department?: string;
    project?: string;
    isAtRisk?: boolean;
  };

  searchFields?: string[];
  searchValues?: string[];
}
export const taskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listTasks: builder.mutation<PaginatedResponse<Task>, TaskFilterPayload>({
      query: (body) => ({ url: "/tasks/list", method: "POST", body }),
    }),
    getMyTasks: builder.mutation<PaginatedResponse<Task>, TaskFilterPayload>({
      query: (body) => ({ url: "/tasks/my-assigned", method: "POST", body }),
    }),
    getTaskById: builder.query<ApiResponse<Task>, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Task", id }],
    }),
    createTask: builder.mutation<ApiResponse<Task>, CreateTaskPayload>({
      query: (body) => ({ url: "/tasks", method: "POST", body }),
      invalidatesTags: ["Task", "Dashboard"],
    }),
    updateTask: builder.mutation<ApiResponse<Task>, { id: string; data: UpdateTaskPayload }>({
      query: ({ id, data }) => ({ url: `/tasks/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Task", id }, "Dashboard"],
    }),
    deleteTask: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: "DELETE" }),
      invalidatesTags: ["Task", "Dashboard"],
    }),
    updateTaskStatus: builder.mutation<ApiResponse<Task>, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/tasks/${id}/status`, method: "PATCH", body: { status } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Task", id }, "Dashboard"],
    }),
    assignTask: builder.mutation<ApiResponse<Task>, { id: string; assignedTo: string }>({
      query: ({ id, assignedTo }) => ({ url: `/tasks/${id}/assign`, method: "PATCH", body: { assignedTo } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Task", id }],
    }),
    addComment: builder.mutation<ApiResponse<Task>, { id: string; content: string }>({
      query: ({ id, content }) => ({ url: `/tasks/${id}/comments`, method: "POST", body: { content } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Task", id }],
    }),
    watchTask: builder.mutation<ApiResponse<Task>, string>({
      query: (id) => ({ url: `/tasks/${id}/watch`, method: "PATCH" }),
      invalidatesTags: (_r, _e, id) => [{ type: "Task", id }],
    }),
  }),
});

export const {
  useListTasksMutation,
  useGetMyTasksMutation,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
  useAssignTaskMutation,
  useAddCommentMutation,
  useWatchTaskMutation,
} = taskApi;