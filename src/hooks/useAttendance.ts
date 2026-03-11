import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  sendBulkAttendance,
  getAttendance,
  getDetailAttendance,
  exportAttendances,
  sendSingleAttendance,
  attendanceStatusToday,
} from "@/api/attendance.api";
import { BulkAttendanceInput, SingleAttendanceInput } from "@/types";

export const useSendBulkAttendance = () => {
  return useMutation({
    mutationFn: (data: BulkAttendanceInput) => sendBulkAttendance(data),
    onSuccess: (data) => {
      console.log("All attendance processed successfully", data);
    },
    onError: (error) => {
      console.error("Failed to process bulk attendance", error);
    },
  });
};

export const useSendSingleAttendance = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: SingleAttendanceInput) => sendSingleAttendance(data),
    onSuccess: (data) => {
      console.log("Attendance processed successfully", data);

      qc.invalidateQueries({
        queryKey: ["dashboard", "mobile-home"],
      });
    },
    onError: (error) => {
      console.error("Failed to process single attendance", error);
    },
  });
};

export const useAttendanceStatusToday = () => {
  return useQuery({
    queryKey: ["attendanceStatusToday"],
    queryFn: () => attendanceStatusToday(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export const useAttendances = (params?: {
  start_date?: string;
  end_date?: string;
}) => {
  return useQuery({
    queryKey: ["attendances", params?.start_date, params?.end_date],
    queryFn: () => getAttendance(params),
    enabled: !!params?.start_date && !!params?.end_date,
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
