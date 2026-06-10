import { apiSlice } from "./apiSlice";
import type { ApiResponse, PaginatedResponse, User } from "@/types";

interface UserFilterPayload {
  page?: number;
  limit?: number;

  filterOptions?: {
    role?: string;
    status?: string;
    department?: string;
  };

  searchFields?: string[];
  searchValues?: string[];
}
interface CreateUserPayload { firstName: string; lastName: string; email: string; password: string; role?: string; department?: string; }
interface UpdateUserPayload { firstName?: string; lastName?: string; department?: string; status?: string; }

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listUsers: builder.mutation<PaginatedResponse<User>, UserFilterPayload>({
      query: (body) => ({ url: "/users/list", method: "POST", body }),
    }),
    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation<ApiResponse<User>, CreateUserPayload>({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<ApiResponse<User>, { id: string; data: UpdateUserPayload }>({
      query: ({ id, data }) => ({ url: `/users/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "User", id }],
    }),
    deleteUser: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
    }),
    changeUserRole: builder.mutation<ApiResponse<User>, { id: string; role: string }>({
      query: ({ id, role }) => ({ url: `/users/${id}/role`, method: "PATCH", body: { role } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "User", id }],
    }),
  }),
});

export const {
  useListUsersMutation,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangeUserRoleMutation,
} = userApi;