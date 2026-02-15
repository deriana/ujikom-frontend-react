import { Leave, LeaveDetail, LeaveInput } from "@/types/leave.types";
import api from "./axios";
import { ApiResponse } from "@/types";
import { APPROVAL_INPUT } from "@/constants/Approval";

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

export const leaveApprovals = async (uuid: string, status: boolean, note?: string) => {
  const isApprove = status === APPROVAL_INPUT.APPROVED;

  const res = await api.put<ApiResponse<Leave[]>>(
    `/leaves/approvals/${uuid}/approve`,
    {
      approve: isApprove,
      status: status,
      note: note || ""
    },
  );

  return res.data.data;
};

export const downloadAttachment = async (filename: string) => {
  const response = await api.get(`/leaves/download-attachment/${filename}`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));

  const link = document.createElement("a");
  link.href = url;

  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
