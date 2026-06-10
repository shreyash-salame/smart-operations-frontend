

import api from "./axios";
import { API } from "./endpoints";

export const notificationApi = {
  getNotifications:
    async () => {
      const res =
        await api.get(
          API.notifications.list
        );

      return res.data;
    },

  markSeen: async (
    notificationIds: string[]
  ) => {
    const res = await api.patch(
      API.notifications.markSeen,
      {
        notificationIds,
      }
    );

    return res.data;
  },

  markAllSeen:
    async () => {
      const res =
        await api.patch(
          API.notifications
            .markAllSeen
        );

      return res.data;
    },
};