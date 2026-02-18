import { WorkSchedule, WorkScheduleInput } from "@/types/workSchedule.types";
import api from "./axios";
import { ApiResponse } from "@/types";

export const getWorkSchedule = async () => {
  const res = await api.get<ApiResponse<WorkSchedule[]>>("/work_schedules");
  return res.data.data;
};

export const getWorkScheduleByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<WorkSchedule>>(`/work_schedules/${uuid}`);
  return res.data.data;
}

export const createWorkSchedule = async (payload: WorkScheduleInput) => {
  const res = await api.post<ApiResponse<WorkSchedule[]>>("/work_schedules",payload);
  return res.data.data;
};

export const updateWorkSchedule = async (uuid: string, payload: WorkScheduleInput) => {
  const res = await api.put<ApiResponse<WorkSchedule[]>>(`/work_schedules/${uuid}`,payload);
  return res.data.data;
};

export const deleteWorkSchedule = async (uuid: string) => {
  const res = await api.delete<ApiResponse<WorkSchedule[]>>(`/work_schedules/${uuid}`);
  return res.data.data;
};

export const restoreWorkSchedule = async (uuid: string) => {
  const res = await api.post<ApiResponse<WorkSchedule[]>>(`/work_schedules/restore/${uuid}`);
  return res.data.data;
};

export const forceDeleteWorkSchedule = async (uuid: string) => {
  const res = await api.delete<ApiResponse<WorkSchedule[]>>(`/work_schedules/force-delete/${uuid}`);
  return res.data.data;
};

export const getTrashedWorkSchedule = async () => {
  const res = await api.get<ApiResponse<WorkSchedule[]>>("/work_schedules/trashed");
  return res.data.data;
}