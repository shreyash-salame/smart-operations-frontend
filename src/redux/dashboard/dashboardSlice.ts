import { createSlice } from "@reduxjs/toolkit";

import {
  getDashboard,
  getTeamInsights,
} from "./dashboardThunks";

import {
  DashboardState,
} from "./dashboardTypes";

const initialState: DashboardState = {
  data: null,
  teamInsights: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        getDashboard.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getDashboard.fulfilled,
        (state, action) => {
          state.loading = false;
          state.data = action.payload;
        }
      )

      .addCase(
        getDashboard.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      )

      .addCase(
        getTeamInsights.fulfilled,
        (state, action) => {
          state.teamInsights =
            action.payload;
        }
      );
  },
});

export default dashboardSlice.reducer;