import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../../api/user.api";

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (payload: any, thunkAPI) => {
    try {
      return await userApi.getUsers(payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (id: string, thunkAPI) => {
    try {
      return await userApi.getUser(id);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (data: any, thunkAPI) => {
    try {
      return await userApi.createUser(data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: any;
    },
    thunkAPI
  ) => {
    try {
      return await userApi.updateUser(
        id,
        data
      );
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id: string, thunkAPI) => {
    try {
      return await userApi.deleteUser(id);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);