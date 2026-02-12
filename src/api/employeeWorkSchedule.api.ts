import { EmployeeWorkSchedule, EmployeeWorkScheduleInput } from "@/types/employeeWorkSchedule.types";
import api from "./axios";
import { ApiResponse } from "@/types";

export const getEmployeeWorkSchedule = async () => {
  const res = await api.get<ApiResponse<EmployeeWorkSchedule[]>>("/employee_work_schedules");
  return res.data.data;
};

export const getEmployeeWorkScheduleByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<EmployeeWorkSchedule>>(`/employee_work_schedules/${uuid}`);
  return res.data.data;
}

export const createEmployeeWorkSchedule = async (payload: EmployeeWorkScheduleInput) => {
  const res = await api.post<ApiResponse<EmployeeWorkSchedule[]>>("/employee_work_schedules",payload);
  return res.data.data;
};

export const updateEmployeeWorkSchedule = async (uuid: string, payload: EmployeeWorkScheduleInput) => {
  const res = await api.put<ApiResponse<EmployeeWorkSchedule[]>>(`/employee_work_schedules/${uuid}`,payload);
  return res.data.data;
};

export const deleteEmployeeWorkSchedule = async (uuid: string) => {
  const res = await api.delete<ApiResponse<EmployeeWorkSchedule[]>>(`/employee_work_schedules/${uuid}`);
  return res.data.data;
};