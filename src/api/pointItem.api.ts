import { ApiResponse } from "@/types";
import api from "./axios";
import { PointBalanceSummary, PointInventory, PointItem, PointItemInput, PointMutation } from "@/types/pointItem.types";

export const getPointItems = async () => {
  const res = await api.get<ApiResponse<PointItem[]>>("point_items");
  return res.data.data;
};

export const getPointItemByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<PointItem>>(`point_items/${uuid}`);
  return res.data.data;
};

export const getPointInventories = async () => {
  const res = await api.get<ApiResponse<PointInventory[]>>("point_items/inventories");
  return res.data.data;
};

export const getPointWallet = async () => {
  const res = await api.get<ApiResponse<PointBalanceSummary>>("point_items/wallet");
  return res.data.data;
};

export const getPointMutations = async () => {
  const res = await api.get<ApiResponse<PointMutation[]>>("point_items/mutations");
  return res.data.data;
};

export const usePointItem = async (uuid: string) => {
  const res = await api.put<ApiResponse<any>>(`point_items/${uuid}/use`);
  return res.data.data;
};

export const createPointItem = async (payload: PointItemInput) => {
  const res = await api.post<ApiResponse<PointItem[]>>("point_items", payload);
  return res.data.data;
};

export const updatePointItem = async (uuid: string, payload: PointItemInput) => {
  const res = await api.post<ApiResponse<PointItem[]>>(`point_items/${uuid}`, payload);
  return res.data.data;
};

export const deletePointItem = async (uuid: string) => {
  const res = await api.delete<ApiResponse<PointItem[]>>(`point_items/${uuid}`);
  return res.data.data;
};

export const toggleStatusPointItem = async (uuid: string) => {
  const res = await api.put<ApiResponse<PointItem[]>>(`point_items/${uuid}/toggle-status`);
  return res.data.data;
};

export const adjustStockPointItem = async (uuid: string, stock: number) => {
  const res = await api.put<ApiResponse<PointItem[]>>(`point_items/${uuid}/adjust-stock`, { stock });
  return res.data.data;
};

export const redeemPointItem = async (uuid: string, quantity: number) => {
  const res = await api.post<ApiResponse<any>>(`point_items/${uuid}/redeem`, { quantity });
  return res.data.data;
};

export const exportPointItems = async (params?: {
  start_date?: string;
  end_date?: string;
}) => {
  const res = await api.get("points/export", {
    params,
    responseType: "blob",
  });
  return res;
};
