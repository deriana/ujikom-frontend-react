import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLeave,
  createLeave,
  updateLeave,
  deleteLeave,
  getLeaveByUuid,
} from "@/api/leave.api";
import { LeaveInput } from "@/types/leave.types";

export const useLeaves = () => {
  return useQuery({
    queryKey: ["leaves"],
    queryFn: getLeave,
    staleTime: 1000 * 60 * 5,
  });
};

export const useLeaveByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["leaves", uuid],
    queryFn: () => getLeaveByUuid(uuid),
    enabled: !!uuid,
  });
}

// CREATE with optimistic update
export const useCreateLeave = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: LeaveInput) => createLeave(data),
    onMutate: async (newLeave) => {
      await qc.cancelQueries({ queryKey: ["leaves"] });
      const previous = qc.getQueryData(["leaves"]);
      qc.setQueryData(["leaves"], (old: any[] = []) => [...old, { ...newLeave, id: Date.now() }]);
      return { previous };
    },
    onError: (_err, _newLeave, context: any) => {
      if (context?.previous) qc.setQueryData(["leaves"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["leaves"] }),
  });
};

// UPDATE with optimistic update
export const useUpdateLeave = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: LeaveInput }) => updateLeave(uuid, data),
    onMutate: async ({ uuid, data }) => {
      await qc.cancelQueries({ queryKey: ["leaves"] });
      const previous = qc.getQueryData(["leaves"]);
      qc.setQueryData(["leaves"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, ...data } : d))
      );
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["leaves"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["leaves"] }),
  });
};

// DELETE with optimistic update
export const useDeleteLeave = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteLeave(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["leaves"] });
      const previous = qc.getQueryData(["leaves"]);
      qc.setQueryData(["leaves"], (old: any[] = []) => old.filter((d) => d.uuid !== uuid));
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["leaves"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["leaves"] }),
  });
};