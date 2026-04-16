import { useQuery, useMutation } from "@tanstack/react-query";
import { getSystemLogs, downloadSystemLog } from "@/api/systemLog.api";
import { SystemLogParams } from "@/types";
import toast from "react-hot-toast";

/**
 * Hook to fetch system logs for a specific date
 * @param params SystemLogParams containing the date (YYYY-MM-DD)
 */
export const useSystemLogs = (params?: SystemLogParams) => {
  return useQuery({
    queryKey: ["system-logs", params?.date],
    queryFn: () => getSystemLogs(params),
    enabled: !!params?.date,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

/**
 * Hook to download system log file
 */
export const useDownloadSystemLog = () => {
  return useMutation({
    mutationFn: (date: string) => downloadSystemLog(date),
    onMutate: () => {
      toast.loading("Preparing log file...", { id: "download-log" });
    },
    onSuccess: () => {
      toast.success("Log file downloaded successfully", {
        id: "download-log",
      });
    },
    onError: (error: any) => {
      console.error("Download error:", error);
      toast.error("Failed to download log file", { id: "download-log" });
    },
  });
};