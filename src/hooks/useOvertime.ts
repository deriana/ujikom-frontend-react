import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOvertime,
  createOvertime,
  updateOvertime,
  deleteOvertime,
  overtimeApprovals,
  getOvertimeByUuid,
  overtimeApprovalsList,
} from "@/api/overtime.api";
import { OvertimeInput } from "@/types/overtime.types";

export const useOvertimes = () => {
  return useQuery({
    queryKey: ["overtimes"],
    queryFn: getOvertime,
    staleTime: 1000 * 60 * 5,
  });
};

export const useOvertimeApprovalsList = () => {
  return useQuery({
    queryKey: ["overtimes", "approvals"],
    queryFn: overtimeApprovalsList,
    staleTime: 1000 * 60 * 5,
  });
}

export const useOvertimeByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["overtimes", uuid],
    queryFn: () => getOvertimeByUuid(uuid),
    enabled: !!uuid,
  });
};

// CREATE with optimistic update
export const useCreateOvertime = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: OvertimeInput) => createOvertime(data),
    onMutate: async (newOvertime) => {
      await qc.cancelQueries({ queryKey: ["overtimes"] });
      const previous = qc.getQueryData(["overtimes"]);
      qc.setQueryData(["overtimes"], (old: any[] = []) => [
        ...old,
        { ...newOvertime, id: Date.now() },
      ]);
      return { previous };
    },
    onError: (_err, _newOvertime, context: any) => {
      if (context?.previous) qc.setQueryData(["overtimes"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["overtimes"] }),
  });
};

export const useUpdateOvertime = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: OvertimeInput }) =>
      updateOvertime(uuid, data),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["overtimes"] });
      const previous = qc.getQueryData(["overtimes"]);

      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["overtimes"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["overtimes"] }),
  });
};

// DELETE with optimistic update
export const useDeleteOvertime = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteOvertime(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["overtimes"] });
      const previous = qc.getQueryData(["overtimes"]);
      qc.setQueryData(["overtimes"], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid),
      );
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["overtimes"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["overtimes"] }),
  });
};

export const useOvertimeApprovals = () => {
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
    }) => overtimeApprovals(uuid, status, note),

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["overtimes"] });
    },
  });
};
