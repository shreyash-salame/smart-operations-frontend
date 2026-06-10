import { createAsyncThunk } from "@reduxjs/toolkit";
import { taskApi } from "../../api/task.api";

export const getTasks = createAsyncThunk(
  "task/getTasks",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await taskApi.getTasks(payload);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch tasks"
      );
    }
  }
);

export const getTaskById = createAsyncThunk(
  "task/getTaskById",
  async (
    id: string,
    { rejectWithValue }
  ) => {
    try {
      return await taskApi.getTask(id);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch task"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "task/createTask",
  async (
    payload: any,
    { rejectWithValue }
  ) => {
    try {
      return await taskApi.createTask(payload);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to create task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: any;
    },
    { rejectWithValue }
  ) => {
    try {
      return await taskApi.updateTask(
        id,
        data
      );
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to update task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (
    id: string,
    { rejectWithValue }
  ) => {
    try {
      await taskApi.deleteTask(id);

      return id;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to delete task"
      );
    }
  }
);

export const updateTaskStatus =
  createAsyncThunk(
    "task/updateStatus",
    async (
      {
        id,
        status,
      }: {
        id: string;
        status: string;
      },
      { rejectWithValue }
    ) => {
      try {
        return await taskApi.updateStatus(
          id,
          status
        );
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data?.message ||
            "Failed to update status"
        );
      }
    }
  );

export const assignTask =
  createAsyncThunk(
    "task/assignTask",
    async (
      {
        id,
        userId,
      }: {
        id: string;
        userId: string;
      },
      { rejectWithValue }
    ) => {
      try {
        return await taskApi.assignTask(
          id,
          userId
        );
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data?.message ||
            "Failed to assign task"
        );
      }
    }
  );

export const addTaskComment =
  createAsyncThunk(
    "task/addComment",
    async (
      {
        id,
        comment,
      }: {
        id: string;
        comment: string;
      },
      { rejectWithValue }
    ) => {
      try {
        return await taskApi.addComment(
          id,
          comment
        );
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data?.message ||
            "Failed to add comment"
        );
      }
    }
  );