import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/dev",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// On 401, clear storage and redirect — but do NOT dispatch logout()
// to avoid triggering React re-renders that cause white screen flashes
const baseQueryWith401: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("/login");
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWith401,
  tagTypes: ["Task", "User", "Notification", "Dashboard", "Activity"],
  endpoints: () => ({}),
});

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery: fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/dev",
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem("token");
//       if (token) headers.set("Authorization", `Bearer ${token}`);
//       return headers;
//     },
//   }),
//   tagTypes: ["Task", "User", "Notification", "Dashboard", "Activity"],
//   endpoints: () => ({}),
// });

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import {
//   ApiResponse,
//   PaginatedResponse,
//   Task,
//   User,
//   ActivityLog,
//   Notification,
//   DashboardData,
//   CreateTaskPayload,
//   UpdateTaskPayload,
// } from "@/types";

// const BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/dev";

// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery: fetchBaseQuery({
//     baseUrl: BASE_URL,
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem("token");
//       if (token) headers.set("Authorization", `Bearer ${token}`);
//       return headers;
//     },
//   }),
//   tagTypes: ["Task", "User", "ActivityLog", "Notification", "Dashboard"],

//   endpoints: (builder) => ({

//     // ─── DASHBOARD ─────────────────────────────────────────────────────
//     getDashboard: builder.query<DashboardData, void>({
//       query: () => "/dashboard",
//       transformResponse: (res: ApiResponse<DashboardData>) => res.data,
//       providesTags: ["Dashboard"],
//       keepUnusedDataFor: 60,
//     }),

//     // ─── TASKS ─────────────────────────────────────────────────────────
//     getTasks: builder.query<
//       PaginatedResponse<Task>,
//       Record<string, any>
//     >({
//       query: (params) => ({ url: "/tasks", params }),
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.data.map(({ id }) => ({ type: "Task" as const, id })),
//               { type: "Task", id: "LIST" },
//             ]
//           : [{ type: "Task", id: "LIST" }],
//     }),

//     getTaskById: builder.query<Task, string>({
//       query: (id) => `/tasks/${id}`,
//       transformResponse: (res: ApiResponse<{ task: Task }>) => res.data.task,
//       providesTags: (result, error, id) => [{ type: "Task", id }],
//     }),

//     getMyTasks: builder.query<PaginatedResponse<Task>, Record<string, any>>({
//       query: (params) => ({ url: "/tasks/my/assigned", params }),
//       providesTags: [{ type: "Task", id: "MY" }],
//     }),

//     createTask: builder.mutation<Task, CreateTaskPayload>({
//       query: (body) => ({ url: "/tasks", method: "POST", body }),
//       transformResponse: (res: ApiResponse<{ task: Task }>) => res.data.task,
//       invalidatesTags: [{ type: "Task", id: "LIST" }, "Dashboard"],
//     }),

//     updateTask: builder.mutation<Task, { id: string; body: UpdateTaskPayload }>({
//       query: ({ id, body }) => ({ url: `/tasks/${id}`, method: "PUT", body }),
//       transformResponse: (res: ApiResponse<{ task: Task }>) => res.data.task,
//       invalidatesTags: (result, error, { id }) => [
//         { type: "Task", id },
//         { type: "Task", id: "LIST" },
//         "Dashboard",
//       ],
//     }),

//     updateTaskStatus: builder.mutation<
//       Task,
//       { id: string; status: string }
//     >({
//       query: ({ id, status }) => ({
//         url: `/tasks/${id}/status`,
//         method: "PATCH",
//         body: { status },
//       }),
//       transformResponse: (res: ApiResponse<{ task: Task }>) => res.data.task,
//       invalidatesTags: (result, error, { id }) => [
//         { type: "Task", id },
//         { type: "Task", id: "LIST" },
//         "Dashboard",
//       ],
//       // Optimistic update — status feels instant
//       async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
//         const patchResult = dispatch(
//           apiSlice.util.updateQueryData(
//             "getTasks",
//             {},
//             (draft) => {
//               const task = draft.data.find((t) => t.id === id);
//               if (task) task.status = status as any;
//             }
//           )
//         );
//         try {
//           await queryFulfilled;
//         } catch {
//           patchResult.undo();
//         }
//       },
//     }),

//     assignTask: builder.mutation<Task, { id: string; assignedTo: string }>({
//       query: ({ id, assignedTo }) => ({
//         url: `/tasks/${id}/assign`,
//         method: "PATCH",
//         body: { assignedTo },
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         { type: "Task", id },
//         { type: "Task", id: "LIST" },
//       ],
//     }),

//     deleteTask: builder.mutation<void, string>({
//       query: (id) => ({ url: `/tasks/${id}`, method: "DELETE" }),
//       invalidatesTags: [{ type: "Task", id: "LIST" }, "Dashboard"],
//     }),

//     addComment: builder.mutation<any, { id: string; content: string }>({
//       query: ({ id, content }) => ({
//         url: `/tasks/${id}/comments`,
//         method: "POST",
//         body: { content },
//       }),
//       invalidatesTags: (result, error, { id }) => [{ type: "Task", id }],
//     }),

//     watchTask: builder.mutation<any, string>({
//       query: (id) => ({ url: `/tasks/${id}/watch`, method: "PATCH" }),
//       invalidatesTags: (result, error, id) => [{ type: "Task", id }],
//     }),

//     // ─── USERS ─────────────────────────────────────────────────────────
//     getUsers: builder.query<PaginatedResponse<User>, Record<string, any>>({
//       query: (params) => ({ url: "/users", params }),
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.data.map(({ id }) => ({ type: "User" as const, id })),
//               { type: "User", id: "LIST" },
//             ]
//           : [{ type: "User", id: "LIST" }],
//     }),

//     getUserById: builder.query<User, string>({
//       query: (id) => `/users/${id}`,
//       transformResponse: (res: ApiResponse<{ user: User }>) => res.data.user,
//       providesTags: (result, error, id) => [{ type: "User", id }],
//     }),

//     createUser: builder.mutation<User, Partial<User> & { password: string }>({
//       query: (body) => ({ url: "/users", method: "POST", body }),
//       invalidatesTags: [{ type: "User", id: "LIST" }],
//     }),

//     updateUser: builder.mutation<User, { id: string; body: Partial<User> }>({
//       query: ({ id, body }) => ({ url: `/users/${id}`, method: "PUT", body }),
//       invalidatesTags: (result, error, { id }) => [
//         { type: "User", id },
//         { type: "User", id: "LIST" },
//       ],
//     }),

//     deleteUser: builder.mutation<void, string>({
//       query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
//       invalidatesTags: [{ type: "User", id: "LIST" }],
//     }),

//     changeUserRole: builder.mutation<User, { id: string; role: string }>({
//       query: ({ id, role }) => ({
//         url: `/users/${id}/role`,
//         method: "PATCH",
//         body: { role },
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         { type: "User", id },
//         { type: "User", id: "LIST" },
//       ],
//     }),

//     // ─── ACTIVITY ──────────────────────────────────────────────────────
//     getActivityLogs: builder.query<
//       PaginatedResponse<ActivityLog>,
//       Record<string, any>
//     >({
//       query: (body) => ({
//         url: "/activity",
//         method: "POST",
//         body: { filterOptions: body },
//       }),
//       providesTags: ["ActivityLog"],
//     }),

//     // ─── NOTIFICATIONS ──────────────────────────────────────────────────
//     getNotifications: builder.query<
//       { data: Notification[]; unreadCount: number },
//       Record<string, any>
//     >({
//       query: (params) => ({ url: "/notifications", params }),
//       providesTags: ["Notification"],
//       keepUnusedDataFor: 30,
//     }),

//     markNotificationsSeen: builder.mutation<void, string[]>({
//       query: (notificationIds) => ({
//         url: "/notifications/seen",
//         method: "PATCH",
//         body: { notificationIds },
//       }),
//       invalidatesTags: ["Notification"],
//     }),

//     markAllNotificationsSeen: builder.mutation<void, void>({
//       query: () => ({ url: "/notifications/seen/all", method: "PATCH" }),
//       invalidatesTags: ["Notification"],
//     }),
//   }),
// });

// export const {
//   useGetDashboardQuery,
//   useGetTasksQuery,
//   useGetTaskByIdQuery,
//   useGetMyTasksQuery,
//   useCreateTaskMutation,
//   useUpdateTaskMutation,
//   useUpdateTaskStatusMutation,
//   useAssignTaskMutation,
//   useDeleteTaskMutation,
//   useAddCommentMutation,
//   useWatchTaskMutation,
//   useGetUsersQuery,
//   useGetUserByIdQuery,
//   useCreateUserMutation,
//   useUpdateUserMutation,
//   useDeleteUserMutation,
//   useChangeUserRoleMutation,
//   useGetActivityLogsQuery,
//   useGetNotificationsQuery,
//   useMarkNotificationsSeenMutation,
//   useMarkAllNotificationsSeenMutation,
// } = apiSlice;