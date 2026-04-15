import api from "./axios";
import { ApiResponse, PointRule, PointRuleInput, PointLeaderboardResponse, PointLeaderboardDetailResponse } from "@/types";

export const getPointRule = async () => {
  const res = await api.get<ApiResponse<PointRule[]>>("points");
  return res.data.data;
};

export const createPointRule = async (payload: PointRuleInput) => {
  const res = await api.post<ApiResponse<PointRule[]>>("points", payload);
  return res.data.data;
};

export const updatePointRule = async (uuid: string, payload: PointRuleInput) => {
  const res = await api.put<ApiResponse<PointRule[]>>(`points/${uuid}`, payload);
  return res.data.data;
};

export const deletePointRule = async (uuid: string) => {
  const res = await api.delete<ApiResponse<PointRule[]>>(`points/${uuid}`);
  return res.data.data;
};

export const getLeaderboard = async () => {
  const res = await api.get<PointLeaderboardResponse>("points/leaderboard");
  return res.data.data;
};

export const getLeaderboardDetail = async (nik: string) => {
  const res = await api.get<PointLeaderboardDetailResponse>(`points/leaderboard/${nik}`);
  return res.data.data;
};

export const exportPoints = async (params?: {
  start_date?: string;
  end_date?: string;
}) => {
  const res = await api.get("points/export", {
    params,
    responseType: "blob",
  });
  return res;
};
