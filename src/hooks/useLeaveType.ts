import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLeaveType,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
} from "@/api/leaveType.api";
import { LeaveTypeInput } from "@/types/leaveType.types";

export const useLeaveTypes = () => {
  return useQuery({
    queryKey: ["leaveTypes"],
    queryFn: getLeaveType,
    staleTime: 1000 * 60 * 5,
  });
};
// CREATE with optimistic update
export const useCreateLeaveType = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: LeaveTypeInput) => createLeaveType(data),
    onMutate: async (newLeaveType) => {
      await qc.cancelQueries({ queryKey: ["leaveTypes"] });
      const previous = qc.getQueryData(["leaveTypes"]);
      qc.setQueryData(["leaveTypes"], (old: any[] = []) => [...old, { ...newLeaveType, id: Date.now() }]);
      return { previous };
    },
    onError: (_err, _newLeaveType, context: any) => {
      if (context?.previous) qc.setQueryData(["leaveTypes"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["leaveTypes"] }),
  });
};

// UPDATE with optimistic update
export const useUpdateLeaveType = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: LeaveTypeInput }) => updateLeaveType(uuid, data),
    onMutate: async ({ uuid, data }) => {
      await qc.cancelQueries({ queryKey: ["leaveTypes"] });
      const previous = qc.getQueryData(["leaveTypes"]);
      qc.setQueryData(["leaveTypes"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, ...data } : d))
      );
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["leaveTypes"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["leaveTypes"] }),
  });
};

// DELETE with optimistic update
export const useDeleteLeaveType = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteLeaveType(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["leaveTypes"] });
      const previous = qc.getQueryData(["leaveTypes"]);
      qc.setQueryData(["leaveTypes"], (old: any[] = []) => old.filter((d) => d.uuid !== uuid));
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["leaveTypes"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["leaveTypes"] }),
  });
};