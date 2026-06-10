import {
  createSlice,
} from "@reduxjs/toolkit";

import {
  getUsers,
  getUserById,
} from "./userThunks";

import {
  UserState,
} from "./userTypes";

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

const userSlice =
  createSlice({
    name: "user",
    initialState,

    reducers: {},

    extraReducers: (
      builder
    ) => {
      builder

        .addCase(
          getUsers.pending,
          (state) => {
            state.loading =
              true;
          }
        )

        .addCase(
          getUsers.fulfilled,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.users =
              action.payload
                ?.data || [];
          }
        )

        .addCase(
          getUsers.rejected,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.error =
              action.payload as string;
          }
        )

        .addCase(
          getUserById.fulfilled,
          (
            state,
            action
          ) => {
            state.selectedUser =
              action.payload
                ?.data;
          }
        );
    },
  });

export default userSlice.reducer;