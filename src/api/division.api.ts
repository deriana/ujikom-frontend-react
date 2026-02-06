import { Division, DivisionInput } from "@/types/division.types";
import api from "./axios";
import { ApiResponse } from "@/types";

export const getDivision = async () => {
  const res = await api.get<ApiResponse<Division[]>>("/divisions");
  return res.data.data;
};

export const getDivisionByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<Division>>(`/divisions/${uuid}`);
  return res.data.data;
}


export const createDivision = async (payload: DivisionInput) => {
  const res = await api.post<ApiResponse<Division[]>>("/divisions",payload);
  return res.data.data;
};

export const updateDivision = async (uuid: string, payload: DivisionInput) => {
  const res = await api.put<ApiResponse<Division[]>>(`/divisions/${uuid}`,payload);
  return res.data.data;
};

export const deleteDivision = async (uuid: string) => {
  const res = await api.delete<ApiResponse<Division[]>>(`/divisions/${uuid}`);
  return res.data.data;
};

export const restoreDivision = async (uuid: string) => {
  const res = await api.post<ApiResponse<Division[]>>(`/divisions/restore/${uuid}`);
  return res.data.data;
};

export const forceDeleteDivision = async (uuid: string) => {
  const res = await api.delete<ApiResponse<Division[]>>(`/divisions/force-delete/${uuid}`);
  return res.data.data;
};

export const getTrashedDivision = async () => {
  const res = await api.get<ApiResponse<Division[]>>("/divisions/trashed");
  return res.data.data;
}