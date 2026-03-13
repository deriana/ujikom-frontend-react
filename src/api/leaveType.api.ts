
import { LeaveType, LeaveTypeInput } from "@/types/leaveType.types";
import api from "./axios";
import { ApiResponse } from "@/types";

export const getLeaveType = async () => {
  const res = await api.get<ApiResponse<LeaveType[]>>("/leave_types");
  return res.data.data;
};

export const createLeaveType = async (payload: LeaveTypeInput) => {
  const res = await api.post<ApiResponse<LeaveType[]>>("/leave_types",payload);
  return res.data.data;
};

export const updateLeaveType = async (uuid: string, payload: LeaveTypeInput) => {
  const res = await api.put<ApiResponse<LeaveType[]>>(`/leave_types/${uuid}`,payload);
  // console.log(payload)
  return res.data.data;
};

export const deleteLeaveType = async (uuid: string) => {
  const res = await api.delete<ApiResponse<LeaveType[]>>(`/leave_types/${uuid}`);
  return res.data.data;
};