import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllowance,

  createAllowance,
  updateAllowance,
  deleteAllowance,
  restoreAllowance,
  forceDeleteAllowance,
  getTrashedAllowance,
  getAllowanceByUuid,
} from "@/api/allowance.api";
import { AllowanceInput } from "@/types/allowance.types";

export const useAllowances = (trashed = false) => {
  return useQuery({
    queryKey: ["allowances", { trashed }],
    queryFn: trashed ? getTrashedAllowance : getAllowance,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAllowanceByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["allowances", uuid],
    queryFn: () => getAllowanceByUuid(uuid),
    enabled: !!uuid,
  });
}

// CREATE with optimistic update
export const useCreateAllowance = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: AllowanceInput) => createAllowance(data),
    onMutate: async (newAllowance) => {
      await qc.cancelQueries({ queryKey: ["allowances"] });
      const previous = qc.getQueryData(["allowances"]);
      qc.setQueryData(["allowances"], (old: any[] = []) => [...old, { ...newAllowance, id: Date.now() }]);
      return { previous };
    },
    onError: (_err, _newAllowance, context: any) => {
      if (context?.previous) qc.setQueryData(["allowances"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["allowances"] }),
  });
};

// UPDATE with optimistic update
export const useUpdateAllowance = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: AllowanceInput }) => updateAllowance(uuid, data),
    onMutate: async ({ uuid, data }) => {
      await qc.cancelQueries({ queryKey: ["allowances"] });
      const previous = qc.getQueryData(["allowances"]);
      qc.setQueryData(["allowances"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, ...data } : d))
      );
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["allowances"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["allowances"] }),
  });
};

// DELETE with optimistic update
export const useDeleteAllowance = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteAllowance(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["allowances"] });
      const previous = qc.getQueryData(["allowances"]);
      qc.setQueryData(["allowances"], (old: any[] = []) => old.filter((d) => d.uuid !== uuid));
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["allowances"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["allowances"] }),
  });
};

// RESTORE with optimistic update
export const useRestoreAllowance = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => restoreAllowance(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["allowances"], exact: false });
      const trashed = qc.getQueryData(["allowances", {trashed: true}]);
      qc.setQueryData(["allowances", {trashed: true}], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid)
      );
      return { previousTrashed: trashed };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previousTrashed)
        qc.setQueryData(["allowances", {trashed: true}], context.previousTrashed);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["allowances"], exact: false }),
  });
};

// FORCE DELETE with optimistic update
export const useForceDeleteAllowance = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => forceDeleteAllowance(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["allowances", {trashed: true}] });
      const previous = qc.getQueryData(["allowances", {trashed: true}]);
      qc.setQueryData(["allowances", {trashed: true}], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid)
      );
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["allowances", {trashed: true}], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["allowances", {trashed: true}] }),
  });
};
