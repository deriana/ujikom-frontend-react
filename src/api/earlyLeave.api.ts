import {
  EarlyLeave,
  EarlyLeaveDetail,
  EarlyLeaveInput,
} from "@/types/earlyLeave.types";
import api from "./axios";
import { ApiResponse } from "@/types";
import { APPROVAL_INPUT } from "@/constants/Approval";

export const getEarlyLeave = async () => {
  const res = await api.get<ApiResponse<EarlyLeave[]>>("/early_leaves");
  return res.data.data;
};

export const getEarlyLeaveByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<EarlyLeaveDetail>>(
    `/early_leaves/${uuid}`,
  );
  return res.data.data;
};

export const createEarlyLeave = async (payload: EarlyLeaveInput) => {
  const res = await api.post<ApiResponse<EarlyLeave[]>>(
    "/early_leaves",
    payload,
  );
  return res.data.data;
};

export const updateEarlyLeave = async (uuid: string, payload: FormData) => {
  const res = await api.post(`/early_leaves/${uuid}`, payload);
  return res.data.data;
};

export const deleteEarlyLeave = async (uuid: string) => {
  const res = await api.delete<ApiResponse<EarlyLeave[]>>(
    `/early_leaves/${uuid}`,
  );
  return res.data.data;
};

export const earlyLeaveApprovals = async (
  uuid: string,
  status: boolean,
  note?: string,
) => {
  const isApprove = status === APPROVAL_INPUT.APPROVED;

  const res = await api.put<ApiResponse<EarlyLeave[]>>(
    `/early_leaves/approvals/${uuid}/approve`,
    {
      approve: isApprove,
      status: status,
      note: note || "",
    },
  );

  return res.data.data;
};

export const downloadAttachment = async (filename: string) => {
  const response = await api.get(
    `/early_leaves/download-attachment/${filename}`,
    {
      responseType: "blob",
    },
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));

  const link = document.createElement("a");
  link.href = url;

  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const earlyLeaveApprovalsList = async () => {
  const response = await api.get<ApiResponse<EarlyLeave[]>>(
    "/approvals/early_leaves",
  );
  return response.data.data;
};
