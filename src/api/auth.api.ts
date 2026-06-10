import api from "./axios";
import { API } from "./endpoints";

export const authApi = {
  login: async (data: {
    email: string;
    password: string;
  }) => {
    const res = await api.post(
      API.auth.login,
      data
    );

    return res.data;
  },

  register: async (
    data: any
  ) => {
    const res = await api.post(
      API.auth.register,
      data
    );

    return res.data;
  },

  profile: async () => {
    const res = await api.get(
      API.auth.profile
    );

    return res.data;
  },

  changePassword: async (
    data: {
      currentPassword: string;
      newPassword: string;
    }
  ) => {
    const res = await api.post(
      API.auth.changePassword,
      data
    );

    return res.data;
  },
};