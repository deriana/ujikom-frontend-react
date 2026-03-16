import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEarlyLeave,
  earlyLeaveApprovalsList,
  createEarlyLeave,
  updateEarlyLeave,
  deleteEarlyLeave,
  earlyLeaveApprovals,
  getEarlyLeaveByUuid,
  exportEarlyLeaves,
} from "@/api/earlyLeave.api";
import { EarlyLeaveInput } from "@/types/earlyLeave.types";

export const useEarlyLeaves = (params?: {
  start_date?: string;
  end_date?: string;
}) => {
  return useQuery({
    queryKey: ["earlyLeaves", params?.start_date, params?.end_date],
    queryFn: () => getEarlyLeave(params),
    enabled: !!params?.start_date && !!params?.end_date,
    staleTime: 1000 * 60 * 5,
  });
};

export const useEarlyLeaveApprovalsList = () => {
  return useQuery({
    queryKey: ["earlyLeaves", "approvals"],
    queryFn: earlyLeaveApprovalsList,
    staleTime: 1000 * 60 * 5,
  });
}

export const useEarlyLeaveByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["earlyLeaves", uuid],
    queryFn: () => getEarlyLeaveByUuid(uuid),
    enabled: !!uuid,
  });
};

// CREATE with optimistic update
export const useCreateEarlyLeave = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: EarlyLeaveInput) => createEarlyLeave(data),
    onMutate: async (newEarlyLeave) => {
      await qc.cancelQueries({ queryKey: ["earlyLeaves"] });
      const previous = qc.getQueryData(["earlyLeaves"]);
      qc.setQueryData(["earlyLeaves"], (old: any[] = []) => [
        ...old,
        { ...newEarlyLeave, id: Date.now() },
      ]);
      return { previous };
    },
    onError: (_err, _newEarlyLeave, context: any) => {
      if (context?.previous) qc.setQueryData(["earlyLeaves"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["earlyLeaves"] }),
  });
};

export const useUpdateEarlyLeave = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: FormData }) =>
      updateEarlyLeave(uuid, data),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["earlyLeaves"] });
      const previous = qc.getQueryData(["earlyLeaves"]);

      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["earlyLeaves"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["earlyLeaves"] }),
  });
};

// DELETE with optimistic update
export const useDeleteEarlyLeave = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteEarlyLeave(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["earlyLeaves"] });
      const previous = qc.getQueryData(["earlyLeaves"]);
      qc.setQueryData(["earlyLeaves"], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid),
      );
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["earlyLeaves"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["earlyLeaves"] }),
  });
};

export const useEarlyLeaveApprovals = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      status,
      note,
    }: {
      uuid: string;
      status: boolean;
      note?: string;
    }) => earlyLeaveApprovals(uuid, status, note),

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["earlyLeaves"] });
    },
  });
};

export const useExportEarlyLeave = () => {
  return useMutation({
    mutationFn: (params: { start_date?: string; end_date?: string }) =>
      exportEarlyLeaves(params),

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
