import { Holiday, HolidayInput } from "@/types/holiday.types";
import api from "./axios";
import { ApiResponse } from "@/types";

export const getHoliday = async () => {
  const res = await api.get<ApiResponse<Holiday[]>>("/holidays");
  return res.data.data;
};

export const createHoliday = async (payload: HolidayInput) => {
  const res = await api.post<ApiResponse<Holiday[]>>("/holidays",payload);
  return res.data.data;
};

export const updateHoliday = async (uuid: string, payload: HolidayInput) => {
  const res = await api.put<ApiResponse<Holiday[]>>(`/holidays/${uuid}`,payload);
  return res.data.data;
};

export const deleteHoliday = async (uuid: string) => {
  const res = await api.delete<ApiResponse<Holiday[]>>(`/holidays/${uuid}`);
  return res.data.data;
};