import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPointItems,
  getPointItemByUuid,
  createPointItem,
  updatePointItem,
  deletePointItem,
  toggleStatusPointItem,
  adjustStockPointItem,
  getPointInventories,
  usePointItem as usePointItemApi,
  redeemPointItem,
  getPointWallet,
  getPointMutations,
  exportPointItems,
} from "@/api/pointItem.api";
import { PointItemInput } from "@/types/pointItem.types";
import toast from "react-hot-toast";

export const usePointItems = () => {
  return useQuery({
    queryKey: ["point", "items"],
    queryFn: getPointItems,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUsePointItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => usePointItemApi(uuid),
    onSettled: () => qc.invalidateQueries({ queryKey: ["point", "inventories"] }),
  });
};

export const usePointItemByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["point", "items", uuid],
    queryFn: () => getPointItemByUuid(uuid),
    enabled: !!uuid,
  });
};

export const usePointInventories = () => {
  return useQuery({
    queryKey: ["point", "inventories"],
    queryFn: getPointInventories,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePointWallet = () => {
  return useQuery({
    queryKey: ["point", "wallet"],
    queryFn: getPointWallet,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePointMutations = () => {
  return useQuery({
    queryKey: ["point", "mutations"],
    queryFn: getPointMutations,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreatePointItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PointItemInput) => createPointItem(payload),
    onSettled: () => qc.invalidateQueries({ queryKey: ["point", "items"] }),
  });
};

export const useUpdatePointItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: PointItemInput }) =>
      updatePointItem(uuid, payload),
    onSettled: () => qc.invalidateQueries({ queryKey: ["point", "items"] }),
  });
};

export const useDeletePointItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => deletePointItem(uuid),
    onSettled: () => qc.invalidateQueries({ queryKey: ["point", "items"] }),
  });
};

export const useToggleStatusPointItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => toggleStatusPointItem(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["point", "items"] });
      const previous = qc.getQueryData(["point", "items"]);
      qc.setQueryData(["point", "items"], (old: any[] = []) =>
        old.map((item) =>
          item.uuid === uuid ? { ...item, is_active: !item.is_active } : item
        )
      );
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["point", "items"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["point", "items"] }),
  });
};

export const useAdjustStockPointItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, stock }: { uuid: string; stock: number }) =>
      adjustStockPointItem(uuid, stock),
    onSettled: () => qc.invalidateQueries({ queryKey: ["point", "items"] }),
  });
};

export const useExportPointItems = () => {
  return useMutation({
    mutationFn: (params?: { start_date?: string; end_date?: string }) =>
      exportPointItems(params),
    onSuccess: (response) => {
      const disposition = response.headers["content-disposition"];
      let fileName = "point_items_report.xlsx";

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
      toast.error("Failed to export point items");
    },
  });
};

export const useRedeemPointItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, quantity }: { uuid: string; quantity: number }) =>
      redeemPointItem(uuid, quantity),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["point", "items"] });
      qc.invalidateQueries({ queryKey: ["point", "inventories"] });
      qc.invalidateQueries({ queryKey: ["point", "wallet"] });
      qc.invalidateQueries({ queryKey: ["point", "mutations"] });
      qc.invalidateQueries({ queryKey: ["point", "leaderboard"] });
    },
  });
};