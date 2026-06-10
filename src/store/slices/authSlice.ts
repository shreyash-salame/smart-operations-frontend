import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "@/types";

const stored = localStorage.getItem("user");
const initialState: AuthState = {
  user: stored ? JSON.parse(stored) : null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, { payload }: PayloadAction<{ user: User; token: string }>) {
      state.user = payload.user;
      state.token = payload.token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("token", payload.token);
      localStorage.setItem("user", JSON.stringify(payload.user));
    },
    updateUser(state, { payload }: PayloadAction<User>) {
      state.user = payload;
      localStorage.setItem("user", JSON.stringify(payload));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setAuthLoading(state, { payload }: PayloadAction<boolean>) {
      state.isLoading = payload;
    },
    setAuthError(state, { payload }: PayloadAction<string | null>) {
      state.error = payload;
    },
  },
});

export const { setCredentials, updateUser, logout, setAuthLoading, setAuthError } = authSlice.actions;
export default authSlice.reducer;

// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { AuthState, User } from "@/types";
// import axiosInstance from "@/utils/axios";

// const initialState: AuthState = {
//   user: JSON.parse(localStorage.getItem("user") || "null"),
//   token: localStorage.getItem("token"),
//   isAuthenticated: !!localStorage.getItem("token"),
//   isLoading: false,
//   error: null,
// };

// export const login = createAsyncThunk(
//   "auth/login",
//   async (
//     credentials: { email: string; password: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const { data } = await axiosInstance.post("/auth/login", credentials);
//       localStorage.setItem("token", data.data.token);
//       localStorage.setItem("user", JSON.stringify(data.data.user));
//       return data.data;
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Login failed");
//     }
//   }
// );

// export const getMe = createAsyncThunk(
//   "auth/getMe",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await axiosInstance.get("/auth/me");
//       localStorage.setItem("user", JSON.stringify(data.data.user));
//       return data.data.user;
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       state.error = null;
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//     updateUser: (state, action: PayloadAction<User>) => {
//       state.user = action.payload;
//       localStorage.setItem("user", JSON.stringify(action.payload));
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.isAuthenticated = true;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(getMe.fulfilled, (state, action) => {
//         state.user = action.payload;
//       });
//   },
// });

// export const { logout, clearError, updateUser } = authSlice.actions;
// export default authSlice.reducer;