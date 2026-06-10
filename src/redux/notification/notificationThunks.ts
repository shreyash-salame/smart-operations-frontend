import { createAsyncThunk } from "@reduxjs/toolkit";

import { notificationApi } from "../../api/notification.api";

export const getNotifications =
  createAsyncThunk(
    "notification/getNotifications",
    async (_, thunkAPI) => {
      try {
        return await notificationApi.getNotifications();
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message
        );
      }
    }
  );

export const markAllSeen =
  createAsyncThunk(
    "notification/markAllSeen",
    async (_, thunkAPI) => {
      try {
        return await notificationApi.markAllSeen();
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message
        );
      }
    }
  );