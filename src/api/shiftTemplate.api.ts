import { ShiftTemplate, ShiftTemplateInput } from "@/types/shiftTemplate.types";
import api from "./axios";
import { ApiResponse } from "@/types";

export const getShiftTemplate = async () => {
  const res = await api.get<ApiResponse<ShiftTemplate[]>>("/shift_templates");
  return res.data.data;
};

export const getShiftTemplateByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<ShiftTemplate>>(`/shift_templates/${uuid}`);
  return res.data.data;
}

export const createShiftTemplate = async (payload: ShiftTemplateInput) => {
  const res = await api.post<ApiResponse<ShiftTemplate[]>>("/shift_templates",payload);
  return res.data.data;
};

export const updateShiftTemplate = async (uuid: string, payload: ShiftTemplateInput) => {
  const res = await api.put<ApiResponse<ShiftTemplate[]>>(`/shift_templates/${uuid}`,payload);
  return res.data.data;
};

export const deleteShiftTemplate = async (uuid: string) => {
  const res = await api.delete<ApiResponse<ShiftTemplate[]>>(`/shift_templates/${uuid}`);
  return res.data.data;
};

export const restoreShiftTemplate = async (uuid: string) => {
  const res = await api.post<ApiResponse<ShiftTemplate[]>>(`/shift_templates/restore/${uuid}`);
  return res.data.data;
};

export const forceDeleteShiftTemplate = async (uuid: string) => {
  const res = await api.delete<ApiResponse<ShiftTemplate[]>>(`/shift_templates/force-delete/${uuid}`);
  return res.data.data;
};

export const getTrashedShiftTemplate = async () => {
  const res = await api.get<ApiResponse<ShiftTemplate[]>>("/shift_templates/trashed");
  return res.data.data;
}