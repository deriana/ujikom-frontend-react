import { ApiResponse, GeneralValues, SettingCategory, SettingsData } from "@/types";
import api from "./axios";

export const getSettings = async () => {
  const res = await api.get<ApiResponse<SettingsData>>("/settings/get");
  return res.data.data;
};

export const getGeneral = async () => {
  const res = await api.get<ApiResponse<{ general: SettingCategory<GeneralValues> }>>("/settings/get/general");
  return res.data.data.general.values;
}

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
