import api from "./axios";
import { API } from "./endpoints";

export const userApi = {
  getUsers: async (
    payload: any
  ) => {
    const res = await api.post(
      API.users.list,
      payload
    );

    return res.data;
  },

  getUser: async (
    id: string
  ) => {
    const res = await api.get(
      API.users.get(id)
    );

    return res.data;
  },

  createUser: async (
    data: any
  ) => {
    const res = await api.post(
      API.users.create,
      data
    );

    return res.data;
  },

  updateUser: async (
    id: string,
    data: any
  ) => {
    const res = await api.put(
      API.users.update(id),
      data
    );

    return res.data;
  },

  deleteUser: async (
    id: string
  ) => {
    const res = await api.delete(
      API.users.delete(id)
    );

    return res.data;
  },

  changeRole: async (
    id: string,
    role: string
  ) => {
    const res = await api.patch(
      API.users.role(id),
      { role }
    );

    return res.data;
  },
};