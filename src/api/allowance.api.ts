import { Allowance, AllowanceInput } from "@/types/allowance.types";
import api from "./axios";
import { ApiResponse } from "@/types";

export const getAllowance = async () => {
  const res = await api.get<ApiResponse<Allowance[]>>("/allowances");
  console.log("data", res)
  return res.data.data;
};

export const getAllowanceByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<Allowance>>(`/allowances/${uuid}`);
  return res.data.data;
}

export const createAllowance = async (payload: AllowanceInput) => {
  const res = await api.post<ApiResponse<Allowance[]>>("/allowances",payload);
  return res.data.data;
};

export const updateAllowance = async (uuid: string, payload: AllowanceInput) => {
  const res = await api.put<ApiResponse<Allowance[]>>(`/allowances/${uuid}`,payload);
  return res.data.data;
};

export const deleteAllowance = async (uuid: string) => {
  const res = await api.delete<ApiResponse<Allowance[]>>(`/allowances/${uuid}`);
  return res.data.data;
};

export const restoreAllowance = async (uuid: string) => {
  const res = await api.post<ApiResponse<Allowance[]>>(`/allowances/restore/${uuid}`);
  return res.data.data;
};

export const forceDeleteAllowance = async (uuid: string) => {
  const res = await api.delete<ApiResponse<Allowance[]>>(`/allowances/force-delete/${uuid}`);
  return res.data.data;
};

export const getTrashedAllowance = async () => {
  const res = await api.get<ApiResponse<Allowance[]>>("/allowances/trashed");
  return res.data.data;
}