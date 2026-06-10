import api from "./axios";

export const dashboardApi = {
  getDashboard: async () => {
    const response =
      await api.get("/dashboard");

    return response.data;
  },

  getTeamInsights: async () => {
    const response =
      await api.get(
        "/dashboard/team-insights"
      );

    return response.data;
  },
};