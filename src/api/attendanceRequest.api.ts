import {
  AttendanceRequest,
  AttendanceRequestDetail,
  AttendanceRequestInput,
} from "@/types/attendanceRequest.types";
import api from "./axios";
import { ApiResponse } from "@/types";
import { APPROVAL_INPUT } from "@/constants/Approval";

export const getAttendanceRequest = async () => {
  const res = await api.get<ApiResponse<AttendanceRequest[]>>(
    "/attendance_request",
  );
  return res.data.data;
};

export const getAttendanceRequestByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<AttendanceRequestDetail>>(
    `/attendance_request/${uuid}`,
  );
  return res.data.data;
};

export const createAttendanceRequest = async (
  payload: AttendanceRequestInput,
) => {
  console.log(payload);
  const res = await api.post<ApiResponse<AttendanceRequest[]>>(
    "/attendance_request",
    payload,
  );
  return res.data.data;
};

export const updateAttendanceRequest = async (
  uuid: string,
  payload: AttendanceRequestInput,
) => {
  const res = await api.put(`/attendance_request/${uuid}`, payload);
  return res.data.data;
};

export const deleteAttendanceRequest = async (uuid: string) => {
  const res = await api.delete<ApiResponse<AttendanceRequest[]>>(
    `/attendance_request/${uuid}`,
  );
  return res.data.data;
};

export const attendanceRequestApprovals = async (
  uuid: string,
  status: boolean,
  note?: string,
) => {
  const isApprove = status === APPROVAL_INPUT.APPROVED;

  const res = await api.put<ApiResponse<AttendanceRequest[]>>(
    `/attendance_request/${uuid}/approve`,
    {
      approve: isApprove,
      status: status,
      note: note || "",
    },
  );

  return res.data.data;
};

export const attendanceRequestApprovalsList = async () => {
  const response = await api.get<ApiResponse<AttendanceRequest[]>>(
    "/approvals/attendance_request",
  );
  return response.data.data;
};