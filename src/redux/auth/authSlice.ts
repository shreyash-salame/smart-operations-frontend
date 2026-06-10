import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import {
  loginUser,
  getProfile,
} from "./authThunks";

import { AuthState } from "./authTypes";

const initialState: AuthState = {
  token:
    localStorage.getItem("token") || null,

  user: null,

  loading: false,

  isAuthenticated:
    !!localStorage.getItem("token"),

  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },

    clearError(state) {
      state.error = null;
    },

    setUser(
      state,
      action: PayloadAction<any>
    ) {
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        loginUser.fulfilled,
        (state, action) => {
          state.loading = false;

          state.token =
            action.payload.token;

          state.user =
            action.payload.user;

          state.isAuthenticated = true;
        }
      )

      .addCase(
        loginUser.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Login failed";
        }
      )

      // PROFILE

      .addCase(
        getProfile.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        getProfile.fulfilled,
        (state, action) => {
          state.loading = false;

          state.user = action.payload;
        }
      )

      .addCase(
        getProfile.rejected,
        (state) => {
          state.loading = false;

          state.user = null;
        }
      );
  },
});

export const {
  logout,
  clearError,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;