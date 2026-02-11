import { useMutation, useQuery } from "@tanstack/react-query";
import { sendBulkAttendance, getAttendance, getDetailAttendance } from "@/api/attendance.api";
import {  BulkAttendanceInput } from "@/types";

export const useSendBulkAttendance = () => {
  return useMutation({
    mutationFn: (data: BulkAttendanceInput) => sendBulkAttendance(data),
    onSuccess: (data) => {
      console.log("Semua absen berhasil diproses", data);
    },
    onError: (error) => {
      console.error("Gagal memproses bulk attendance", error);
    }
  });
};

export const useAttendances = (params?: { start_date?: string; end_date?: string }) => {
  return useQuery({
    queryKey: ["attendances", params?.start_date, params?.end_date],
    queryFn: () => getAttendance(params),
    enabled: !!params?.start_date && !!params?.end_date,
    staleTime: 1000 * 60 * 5,  // 5 menit data dianggap fresh
    refetchOnWindowFocus: false,
    refetchOnMount: false,    // prevent fetch ulang saat mount
  });
};

export const useDetailAttendance = (id: number) => {
  return useQuery({
    queryKey: ["attendances", id],
    queryFn: () => getDetailAttendance(id),
    enabled: !!id,
  });
};