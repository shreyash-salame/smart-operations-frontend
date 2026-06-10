import { apiSlice } from "./apiSlice";
import type { ApiResponse, PaginatedResponse, Notification, DashboardData, ActivityLog } from "@/types";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<PaginatedResponse<Notification>, { page?: number; seen?: boolean }>({
      query: (params) => ({ url: "/notifications", params }),
      providesTags: ["Notification"],
    }),
    markSeen: builder.mutation<ApiResponse<Notification>, string>({
      query: (id) => ({ url: `/notifications/${id}/seen`, method: "PATCH" }),
      invalidatesTags: ["Notification"],
    }),
    markAllSeen: builder.mutation<ApiResponse<void>, void>({
      query: () => ({ url: "/notifications/seen-all", method: "PATCH" }),
      invalidatesTags: ["Notification"],
    }),
    getDashboard: builder.query<ApiResponse<DashboardData>, void>({
      query: () => "/dashboard",
      providesTags: ["Dashboard"],
    }),
    getActivityLogs: builder.query<PaginatedResponse<ActivityLog>, { page?: number; limit?: number }>({
      query: (params) => ({ url: "/activity-logs", params }),
      providesTags: ["Activity"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkSeenMutation,
  useMarkAllSeenMutation,
  useGetDashboardQuery,
  useGetActivityLogsQuery,
} = notificationApi;