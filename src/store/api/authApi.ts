

import { apiSlice } from "./apiSlice";
import type { ApiResponse, User } from "@/types";

interface LoginPayload { email: string; password: string; }
interface RegisterPayload { firstName: string; lastName: string; email: string; password: string; role?: string; department?: string; }
interface ChangePasswordPayload { currentPassword: string; newPassword: string; }

// Actual API response shapes from backend
interface LoginResponseData { user: User; token: string; }
interface ProfileResponseData { user: User; }

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponseData>, LoginPayload>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation<ApiResponse<User>, RegisterPayload>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    getProfile: builder.query<ApiResponse<ProfileResponseData>, void>({
      query: () => "/auth/profile",
    }),
    changePassword: builder.mutation<ApiResponse<void>, ChangePasswordPayload>({
      query: (body) => ({ url: "/auth/change-password", method: "POST", body }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useChangePasswordMutation,
} = authApi;// import { apiSlice } from "./apiSlice";
// import type { ApiResponse, User } from "@/types";

// interface LoginPayload { email: string; password: string; }
// interface RegisterPayload { firstName: string; lastName: string; email: string; password: string; role?: string; department?: string; }
// interface ChangePasswordPayload { currentPassword: string; newPassword: string; }
// interface LoginResponse { token: string; user: User; }

// export const authApi = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     login: builder.mutation<ApiResponse<LoginResponse>, LoginPayload>({
//       query: (body) => ({ url: "/auth/login", method: "POST", body }),
//     }),
//     register: builder.mutation<ApiResponse<User>, RegisterPayload>({
//       query: (body) => ({ url: "/auth/register", method: "POST", body }),
//     }),
//     getProfile: builder.query<ApiResponse<User>, void>({
//       query: () => "/auth/profile",
//     }),
//     changePassword: builder.mutation<ApiResponse<void>, ChangePasswordPayload>({
//       query: (body) => ({ url: "/auth/change-password", method: "POST", body }),
//     }),
//   }),
// });

// export const {
//   useLoginMutation,
//   useRegisterMutation,
//   useGetProfileQuery,
//   useChangePasswordMutation,
// } = authApi;