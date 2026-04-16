import api from "./axios";
import { ApiResponse, Point, PointInput, PointLeaderboardResponse, PointLeaderboardDetailResponse } from "@/types";

export const getPoint = async () => {
  const res = await api.get<ApiResponse<Point[]>>("points");
  return res.data.data;
};

export const createPoint = async (payload: PointInput) => {
  const res = await api.post<ApiResponse<Point[]>>("points", payload);
  return res.data.data;
};

export const updatePoint = async (uuid: string, payload: PointInput) => {
  const res = await api.put<ApiResponse<Point[]>>(`points/${uuid}`, payload);
  return res.data.data;
};

export const deletePoint = async (uuid: string) => {
  const res = await api.delete<ApiResponse<Point[]>>(`points/${uuid}`);
  return res.data.data;
};

export const getLeaderboard = async () => {
  const res = await api.get<ApiResponse<PointLeaderboardResponse>>("points/leaderboard");
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
