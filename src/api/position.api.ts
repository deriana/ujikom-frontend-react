import { Position, PositionInput } from "@/types/position.types";
import api from "./axios";
import { ApiResponse } from "@/types";

export const getPosition = async () => {
  const res = await api.get<ApiResponse<Position[]>>("/positions");
  console.log("data", res)
  return res.data.data;
};

export const getPositionByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<Position>>(`/positions/${uuid}`);
  return res.data.data;
}

export const createPosition = async (payload: PositionInput) => {
  const res = await api.post<ApiResponse<Position[]>>("/positions",payload);
  return res.data.data;
};

export const updatePosition = async (uuid: string, payload: PositionInput) => {
  const res = await api.put<ApiResponse<Position[]>>(`/positions/${uuid}`,payload);
  return res.data.data;
};

export const deletePosition = async (uuid: string) => {
  const res = await api.delete<ApiResponse<Position[]>>(`/positions/${uuid}`);
  return res.data.data;
};

export const restorePosition = async (uuid: string) => {
  const res = await api.post<ApiResponse<Position[]>>(`/positions/restore/${uuid}`);
  return res.data.data;
};

export const forceDeletePosition = async (uuid: string) => {
  const res = await api.delete<ApiResponse<Position[]>>(`/positions/force-delete/${uuid}`);
  return res.data.data;
};

export const getTrashedPosition = async () => {
  const res = await api.get<ApiResponse<Position[]>>("/positions/trashed");
  return res.data.data;
}