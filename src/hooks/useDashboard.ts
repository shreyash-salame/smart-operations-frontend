import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.getStats,
  });
};

export const useTeamInsights = () => {
  return useQuery({
    queryKey: ["team-insights"],
    queryFn: dashboardApi.getInsights,
  });
};