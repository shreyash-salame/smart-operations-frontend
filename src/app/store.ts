import {
  configureStore,
} from "@reduxjs/toolkit";

import authReducer from "../redux/auth/authSlice";
import taskReducer from "../redux/task/taskSlice";
import userReducer from "../redux/user/userSlice";
import notificationReducer from "../redux/notification/notificationSlice";
import dashboardReducer from "../redux/dashboard/dashboardSlice";

export const store =
  configureStore({
    reducer: {
      auth: authReducer,
      task: taskReducer,
      user: userReducer,
      notification:
        notificationReducer,
      dashboard:
        dashboardReducer,
    },
  });

export type RootState =
  ReturnType<
    typeof store.getState
  >;

export type AppDispatch =
  typeof store.dispatch;

// import { configureStore } from "@reduxjs/toolkit";

// import authReducer from "../redux/auth";

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });

// export type RootState =
//   ReturnType<typeof store.getState>;

// export type AppDispatch =
//   typeof store.dispatch;