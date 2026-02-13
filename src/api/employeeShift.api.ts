import { EmployeeShift, EmployeeShiftInput } from "@/types/employeeShift.types";
import api from "./axios";
import { ApiResponse } from "@/types";

export const getEmployeeShift = async () => {
  const res = await api.get<ApiResponse<EmployeeShift[]>>("/employee_shift");
  return res.data.data;
};

export const getEmployeeShiftByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<EmployeeShift>>(`/employee_shift/${uuid}`);
  return res.data.data;
}

export const createEmployeeShift = async (payload: EmployeeShiftInput) => {
  const res = await api.post<ApiResponse<EmployeeShift[]>>("/employee_shift",payload);
  return res.data.data;
};

export const updateEmployeeShift = async (uuid: string, payload: EmployeeShiftInput) => {
  const res = await api.put<ApiResponse<EmployeeShift[]>>(`/employee_shift/${uuid}`,payload);
  return res.data.data;
};

export const deleteEmployeeShift = async (uuid: string) => {
  const res = await api.delete<ApiResponse<EmployeeShift[]>>(`/employee_shift/${uuid}`);
  return res.data.data;
};