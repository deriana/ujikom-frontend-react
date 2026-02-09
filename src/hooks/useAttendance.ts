import { useMutation } from "@tanstack/react-query";
import { sendBulkAttendance } from "@/api/attendance.api";
import { BulkAttendanceInput } from "@/types";

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