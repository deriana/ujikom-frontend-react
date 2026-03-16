import {
  AttendanceCorrection,
  AttendanceCorrectionDetail,
  AttendanceCorrectionInput,
} from "@/types/attendance.types";
import api from "./axios";
import { ApiResponse } from "@/types";
import { APPROVAL_INPUT } from "@/constants/Approval";

export const getAttendanceCorrection = async () => {
  const res = await api.get<ApiResponse<AttendanceCorrection[]>>("/attendance_corrections");
  return res.data.data;
};

export const getAttendanceCorrectionApprovals = async () => {
  const res = await api.get<ApiResponse<AttendanceCorrection[]>>("/approvals/attendance_corrections");
  return res.data.data;
};

export const getAttendanceCorrectionByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<AttendanceCorrectionDetail>>(`/attendance_corrections/${uuid}`);
  return res.data.data;
};

export const createAttendanceCorrection = async (payload: AttendanceCorrectionInput) => {
  const res = await api.post<ApiResponse<AttendanceCorrection[]>>("/attendance_corrections", payload);
  return res.data.data;
};

export const updateAttendanceCorrection = async (uuid: string, payload: FormData) => {
  const res = await api.post(`/attendance_corrections/${uuid}`, payload);
  return res.data.data;
};

export const deleteAttendanceCorrection = async (uuid: string) => {
  const res = await api.delete<ApiResponse<AttendanceCorrection[]>>(`/attendance_corrections/${uuid}`);
  return res.data.data;
};

export const attendanceCorrectionApprovals = async (uuid: string, status: boolean, note?: string) => {
  const isApprove = status === APPROVAL_INPUT.APPROVED;

  const res = await api.put<ApiResponse<AttendanceCorrection[]>>(
    `/attendance_corrections/approvals/${uuid}/approve`,
    {
      approve: isApprove,
      status: status,
      note: note || "",
    }
  );

  return res.data.data;
};

export const downloadAttachment = async (filename: string) => {
  const response = await api.get(`/attendance_corrections/download-attachment/${filename}`, {
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