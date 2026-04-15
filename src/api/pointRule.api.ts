import api from "./axios";
import { ApiResponse, PointRule, PointRuleInput } from "@/types";

export const getPointRule = async () => {
  const res = await api.get<ApiResponse<PointRule[]>>("point_rules");
  return res.data.data;
};

export const createPointRule = async (payload: PointRuleInput) => {
  const res = await api.post<ApiResponse<PointRule[]>>("point_rules",payload);
  return res.data.data;
};

export const updatePointRule = async (uuid: string, payload: PointRuleInput) => {
  const res = await api.put<ApiResponse<PointRule[]>>(`point_rules/${uuid}`,payload);
  return res.data.data;
};

export const deletePointRule = async (uuid: string) => {
  const res = await api.delete<ApiResponse<PointRule[]>>(`point_rules/${uuid}`);
  return res.data.data;
};

export const toggleStatusPointRule = async (uuid: string) => {
  const res = await api.put<ApiResponse<PointRule[]>>(`point_rules/${uuid}/toggle-status`);
  return res.data.data;
};
