import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPayroll,
  getPayrollByUuid,
  updatePayroll,
  finalizePayroll,
  voidPayroll,
  downloadPayroll,
  bulkFinalizePayroll,
} from "@/api/payroll.api";
import { PayrollUpdateInput } from "@/types/payroll.types";

export const usePayrolls = () => {
  return useQuery({
    queryKey: ["payrolls"],
    queryFn: getPayroll,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFinalizePayroll = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => finalizePayroll(uuid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payrolls"] });
    },
  });
};

export const useBulkFinalizePayroll = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: { payroll_uuids: string[] }) => bulkFinalizePayroll(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payrolls"] });
    },
  });
};

export const useDownloadPayroll = () => {
  return useMutation({
    mutationFn: (uuid: string) => downloadPayroll(uuid),
  });
};

export const useVoidPayroll = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, note }: { uuid: string; note: string }) =>
      voidPayroll(uuid, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payrolls"] });
    },
  });
};

export const usePayrollByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["payrolls", uuid],
    queryFn: () => getPayrollByUuid(uuid),
    enabled: !!uuid,
  });
};

// UPDATE with optimistic update
export const useUpdatePayroll = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: PayrollUpdateInput }) =>
      updatePayroll(uuid, data),
    onMutate: async ({ uuid, data }) => {
      await qc.cancelQueries({ queryKey: ["payrolls"] });
      const previous = qc.getQueryData(["payrolls"]);
      qc.setQueryData(["payrolls"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, ...data } : d)),
      );
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["payrolls"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["payrolls"] }),
  });
};
