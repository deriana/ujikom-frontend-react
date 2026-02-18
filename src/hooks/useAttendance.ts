import { useMutation, useQuery } from "@tanstack/react-query";
import {
  sendBulkAttendance,
  getAttendance,
  getDetailAttendance,
  exportAttendances,
} from "@/api/attendance.api";
import { BulkAttendanceInput } from "@/types";

export const useSendBulkAttendance = () => {
  return useMutation({
    mutationFn: (data: BulkAttendanceInput) => sendBulkAttendance(data),
    onSuccess: (data) => {
      console.log("Semua absen berhasil diproses", data);
    },
    onError: (error) => {
      console.error("Gagal memproses bulk attendance", error);
    },
  });
};

export const useAttendances = (params?: {
  start_date?: string;
  end_date?: string;
}) => {
  return useQuery({
    queryKey: ["attendances", params?.start_date, params?.end_date],
    queryFn: () => getAttendance(params),
    enabled: !!params?.start_date && !!params?.end_date,
    staleTime: 1000 * 60 * 5, // 5 menit data dianggap fresh
    refetchOnWindowFocus: false,
    refetchOnMount: false, // prevent fetch ulang saat mount
  });
};

export const useDetailAttendance = (id: number) => {
  return useQuery({
    queryKey: ["attendances", id],
    queryFn: () => getDetailAttendance(id),
    enabled: !!id,
  });
};

export const useExportAttendance = () => {
  return useMutation({
    mutationFn: (params: { start_date?: string; end_date?: string }) =>
      exportAttendances(params),

    onSuccess: (response) => {
      const disposition = response.headers["content-disposition"];

      let fileName = "attendances.xlsx";

      if (disposition && disposition.includes("filename=")) {
        fileName = disposition.split("filename=")[1].replace(/"/g, "").trim();
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
};
