import { SystemLogParams, SystemLogResponse } from "@/types";
import api from "./axios";

/**
 * Fetch system logs for a specific date
 * @param params SystemLogParams containing the date (YYYY-MM-DD)
 */
export const getSystemLogs = async (params?: SystemLogParams) => {
  const res = await api.get<SystemLogResponse>("/system/logs", { params });
  return res.data.data;
};

/**
 * Download the system log file for a specific date
 * @param date string format YYYY-MM-DD
 */
export const downloadSystemLog = async (date: string) => {
  const res = await api.get(`/system/logs/${date}/download`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `laravel-${date}.log`);
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  link.remove();
  window.URL.revokeObjectURL(url);
  return res.data;
};
