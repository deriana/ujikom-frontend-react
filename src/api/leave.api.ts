import { Leave, LeaveDetail, LeaveInput } from "@/types/leave.types";
import api from "./axios";
import { ApiResponse } from "@/types";

export const getLeave = async () => {
  const res = await api.get<ApiResponse<Leave[]>>("/leaves");
  return res.data.data;
};

export const getLeaveByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<LeaveDetail>>(`/leaves/${uuid}`);
  return res.data.data;
};

export const createLeave = async (payload: LeaveInput) => {
  const res = await api.post<ApiResponse<Leave[]>>("/leaves", payload);
  return res.data.data;
};

export const updateLeave = async (uuid: string, payload: FormData) => {
  const res = await api.post(`/leaves/${uuid}`, payload);
  return res.data.data;
};

export const deleteLeave = async (uuid: string) => {
  const res = await api.delete<ApiResponse<Leave[]>>(`/leaves/${uuid}`);
  return res.data.data;
};

export const leaveApprovals = async (uuid: string, status: 0 | 1 | 2) => {
  const res = await api.put<ApiResponse<Leave[]>>(
    `/leaves/approvals/${uuid}/approve`,
    { status },
  );
  return res.data.data;
};

export const downloadAttachment = async (uuid: string) => {
  const res = await api.get<ApiResponse<Leave[]>>(
    `/leaves/download-attachment/${uuid}`,
  );
  return res.data.data;
};
