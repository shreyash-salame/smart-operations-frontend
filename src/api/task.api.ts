import api from "./axios";
import { API } from "./endpoints";

export const taskApi = {
  getTasks: async (
    payload: any
  ) => {
    const res = await api.post(
      API.tasks.list,
      payload
    );

    return res.data;
  },

  getTask: async (
    id: string
  ) => {
    const res = await api.get(
      API.tasks.get(id)
    );

    return res.data;
  },

  createTask: async (
    data: any
  ) => {
    const res = await api.post(
      API.tasks.create,
      data
    );

    return res.data;
  },

  updateTask: async (
    id: string,
    data: any
  ) => {
    const res = await api.put(
      API.tasks.update(id),
      data
    );

    return res.data;
  },

  deleteTask: async (
    id: string
  ) => {
    const res = await api.delete(
      API.tasks.delete(id)
    );

    return res.data;
  },

  updateStatus: async (
    id: string,
    status: string
  ) => {
    const res = await api.patch(
      API.tasks.status(id),
      { status }
    );

    return res.data;
  },

  assignTask: async (
    id: string,
    userId: string
  ) => {
    const res = await api.patch(
      API.tasks.assign(id),
      { userId }
    );

    return res.data;
  },

  addComment: async (
    id: string,
    content: string
  ) => {
    const res = await api.post(
      API.tasks.comments(id),
      { content }
    );

    return res.data;
  },
};