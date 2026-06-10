import { createAsyncThunk } from "@reduxjs/toolkit";

import { authApi } from "../../api/auth.api";

import {
  LoginPayload,
  LoginResponse,
} from "./authTypes";

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response =
        await authApi.login(payload);

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "role",
        response.data.user.role
      );

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Login failed"
      );
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await authApi.profile();

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Unable to fetch profile"
      );
    }
  }
);

export const changePassword =
  createAsyncThunk(
    "auth/changePassword",
    async (
      data: {
        currentPassword: string;
        newPassword: string;
      },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await authApi.changePassword(
            data
          );

        return response;
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data?.message ||
            "Unable to change password"
        );
      }
    }
  );