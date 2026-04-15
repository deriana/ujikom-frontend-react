import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPoint,
  createPoint,
  updatePoint,
  deletePoint,
  getLeaderboard,
  getLeaderboardDetail,
  exportPoints,
} from "@/api/point.api";
import { PointInput } from "@/types/point.types";
import toast from "react-hot-toast";

export const usePoint = (options = {}) => {
  return useQuery({
    queryKey: ["point"],
    queryFn: getPoint,
    staleTime: 1000 * 60 * 5,
    ...options
  });
};

// CREATE with optimistic update
export const useCreatePoint = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: PointInput) => createPoint(data),
    onMutate: async (newCategory) => {
      await qc.cancelQueries({ queryKey: ["point"] });
      const previous = qc.getQueryData(["point"]);
      qc.setQueryData(["point"], (old: any[] = []) => [...old, { ...newCategory, id: Date.now() }]);
      return { previous };
    },
    onError: (_err, _newCategory, context: any) => {
      if (context?.previous) qc.setQueryData(["point"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["point"] }),
  });
};

// UPDATE with optimistic update
export const useUpdatePoint = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: PointInput }) => updatePoint(uuid, data),
    onMutate: async ({ uuid, data }) => {
      await qc.cancelQueries({ queryKey: ["point"] });
      const previous = qc.getQueryData(["point"]);
      qc.setQueryData(["point"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, ...data } : d))
      );
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["point"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["point"] }),
  });
};

/** ===== Leaderboard Hooks ===== */

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ["point", "leaderboard"],
    queryFn: getLeaderboard,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes to prevent frequent refetching
    refetchOnWindowFocus: false, // Only fetch once or when explicitly invalidated
  });
};

export const useLeaderboardDetail = (nik: string) => {
  return useQuery({
    queryKey: ["point", "leaderboard", nik],
    queryFn: () => getLeaderboardDetail(nik),
    enabled: !!nik,
    staleTime: 1000 * 60 * 5,
  });
};

export const useExportPoints = () => {
  return useMutation({
    mutationFn: (params: { start_date?: string; end_date?: string }) =>
      exportPoints(params),
    onSuccess: (response) => {
      const disposition = response.headers["content-disposition"];
      let fileName = "points_report.xlsx";

      if (disposition && disposition.includes("filename=")) {
        fileName = disposition
          .split("filename=")[1]
          .replace(/"/g, "")
          .trim();
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Export started");
    },
    onError: () => {
      toast.error("Failed to export points data");
    },
  });
};

// DELETE with optimistic update
export const useDeletePoint = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deletePoint(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["point"] });
      const previous = qc.getQueryData(["point"]);
      qc.setQueryData(["point"], (old: any[] = []) => old.filter((d) => d.uuid !== uuid));
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["point"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["point"] }),
  });
};