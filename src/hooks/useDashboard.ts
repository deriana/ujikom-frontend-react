import {
  getAdminDashboard,
  getEmployeeDashboard,
  getMobileHomeData,
  getMobileStatsData,
} from "@/api/dashboard.api";
import { useQuery } from "@tanstack/react-query";

export const useAdminDashboard = (date?: string) => {
  return useQuery({
    queryKey: ["dashboard", "admin", date],
    queryFn: () => getAdminDashboard(date),
    staleTime: 1000 * 60 * 5,
  });
};

export const useEmployeeDashboard = () => {
  return useQuery({
    queryKey: ["dashboard", "employee"],
    queryFn: getEmployeeDashboard,
    staleTime: 1000 * 60 * 5,
  });
};

export const useMobileHomeData = () => {
  return useQuery({
    queryKey: ["dashboard", "mobile-home"],
    queryFn: () => getMobileHomeData(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useMobileStatsData = () => {
  return useQuery({
    queryKey: ["dashboard", "mobile-stats"],
    queryFn: () => getMobileStatsData(),
    staleTime: 1000 * 60 * 5,
  })
}