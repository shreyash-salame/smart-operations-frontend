import {
  createSlice,
} from "@reduxjs/toolkit";

import {
  getNotifications,
} from "./notificationThunks";

interface NotificationState {
  notifications: any[];
  loading: boolean;
}

const initialState: NotificationState =
  {
    notifications: [],
    loading: false,
  };

const notificationSlice =
  createSlice({
    name: "notification",

    initialState,

    reducers: {},

    extraReducers: (
      builder
    ) => {
      builder

        .addCase(
          getNotifications.pending,
          (state) => {
            state.loading =
              true;
          }
        )

        .addCase(
          getNotifications.fulfilled,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.notifications =
              action.payload
                ?.data || [];
          }
        );
    },
  });

export default notificationSlice.reducer;