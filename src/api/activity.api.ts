import api from "./axios";
import { API } from "./endpoints";

export const activityApi = {
  getActivities: async (
    payload: any
  ) => {
    const res = await api.post(
      API.activity.list,
      payload
    );

    return res.data;
  },

  getResourceActivities:
    async (
      resourceType: string,
      resourceId: string
    ) => {
      const res =
        await api.post(
          API.activity.resource(
            resourceType,
            resourceId
          )
        );

      return res.data;
    },
};