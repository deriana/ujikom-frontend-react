import { AdminDashboardData, ApiResponse, EmployeeDashboardData, MobileDailyTrackerData, MobileHomeData, MobileStatsData } from "@/types";
import api from "./axios";

export const getAdminDashboard = async (date?: string) => {
  const params = date ? { date } : {};
  const res = await api.get<ApiResponse<AdminDashboardData>>(`/dashboard/admin`, { params });
  return res.data.data;
};
export const getEmployeeDashboard = async () => {
  const res = await api.get<ApiResponse<EmployeeDashboardData>>("/dashboard/employee");
  return res.data.data;
}
export const getMobileHomeData = async () => {
    const res = await api.get<ApiResponse<MobileHomeData>>("/mobile-home-data");
  return res.data.data;
}
export const getMobileStatsData = async () => {
    const res = await api.get<ApiResponse<MobileStatsData>>("/mobile-stats-data");
  return res.data.data;
}
export const getMobileDailyTrackerData = async (date?: string) => {
  const params = date ? { date } : {};
  const res = await api.get<ApiResponse<MobileDailyTrackerData>>("/mobile-daily-tracker-data", { params });
  return res.data.data;
}