import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPayroll,
  getPayrollByUuid,
  updatePayroll,
  finalizePayroll,
  voidPayroll,
  downloadPayroll,
  bulkFinalizePayroll,
  createPayroll,
  exportPayroll,
} from "@/api/payroll.api";
import { PayrollUpdateInput, PayrollCreateInput } from "@/types/payroll.types";

export const usePayrolls = (params?: {
  month: string;
}) => {
  return useQuery({
    queryKey: ["payrolls", params?.month],
    queryFn: () => getPayroll(params),
    enabled: !!params?.month,
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

// CREATE with optimistic update
export const useCreatePayroll = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PayrollCreateInput) => createPayroll(data),
    onMutate: async (newPayroll) => {
      await qc.cancelQueries({ queryKey: ["payrolls"] });
      const previous = qc.getQueryData<any[]>(["payrolls"]);
      qc.setQueryData(["payrolls"], (old: any[] = []) => [
        ...old,
        {
          ...newPayroll,
          uuid: `temp-${Date.now()}`,
          status: 'pending'
        }
      ]);

      return { previous };
    },
    onError: (_err, _newPayroll, context: any) => {
      if (context?.previous) {
        qc.setQueryData(["payrolls"], context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["payrolls"] });
    },
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

export const useExportPayrrol = () => {
  return useMutation({
    mutationFn: (params: { month?: string }) =>
      exportPayroll(params),

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
