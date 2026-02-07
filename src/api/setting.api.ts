import { ApiResponse, SettingCategory, SettingsData } from "@/types";
import api from "./axios";

export const getSettings = async () => {
  const res = await api.get<ApiResponse<SettingsData>>("/settings/get");
  return res.data.data;
};

export const updateSetting = async <T>(
  type: "general" | "attendance" | "geo_fencing",
  data: T,
) => {
  const res = await api.post<ApiResponse<SettingCategory<T>>>(
    `/settings/${type}`,
    data,
  );
  return res.data.data;
};
