import { AdminDashboardData, ApiResponse, EmployeeDashboardData } from "@/types";
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
