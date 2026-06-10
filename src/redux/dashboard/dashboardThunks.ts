import { createAsyncThunk } from "@reduxjs/toolkit";

import { dashboardApi } from "../../api/dashboard.api";

export const getDashboard =
  createAsyncThunk(
    "dashboard/getDashboard",
    async () => {
      const response =
        await dashboardApi.getDashboard();

      return response.data;
    }
  );

export const getTeamInsights =
  createAsyncThunk(
    "dashboard/getTeamInsights",
    async () => {
      const response =
        await dashboardApi.getTeamInsights();

      return response.data;
    }
  );