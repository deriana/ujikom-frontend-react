import {
  Overtime,
  OvertimeDetail,
  OvertimeInput,
} from "@/types/overtime.types";
import api from "./axios";
import { ApiResponse } from "@/types";
import { APPROVAL_INPUT } from "@/constants/Approval";

export const getOvertime = async () => {
  const res = await api.get<ApiResponse<Overtime[]>>(
    "/overtime",
  );
  return res.data.data;
};

export const getOvertimeByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<OvertimeDetail>>(
    `/overtime/${uuid}`,
  );
  return res.data.data;
};

export const createOvertime = async (
  payload: OvertimeInput,
) => {
  // console.log(payload);
  const res = await api.post<ApiResponse<Overtime[]>>(
    "/overtime",
    payload,
  );
  return res.data.data;
};

export const updateOvertime = async (
  uuid: string,
  payload: OvertimeInput,
) => {
  const res = await api.put(`/overtime/${uuid}`, payload);
  return res.data.data;
};

export const deleteOvertime = async (uuid: string) => {
  const res = await api.delete<ApiResponse<Overtime[]>>(
    `/overtime/${uuid}`,
  );
  return res.data.data;
};

export const overtimeApprovals = async (
  uuid: string,
  status: boolean,
  note?: string,
) => {
  const isApprove = status === APPROVAL_INPUT.APPROVED;

  const res = await api.put<ApiResponse<Overtime[]>>(
    `/overtime/${uuid}/approve`,
    {
      approve: isApprove,
      status: status,
      note: note || "",
    },
  );

  return res.data.data;
};

export const overtimeApprovalsList = async () => {
  const response = await api.get<ApiResponse<Overtime[]>>(
    "/approvals/overtime",
  );
  return response.data.data;
};