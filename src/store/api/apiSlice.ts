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
