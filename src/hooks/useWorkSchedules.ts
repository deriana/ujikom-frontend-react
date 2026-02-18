import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWorkSchedule,
  createWorkSchedule,
  updateWorkSchedule,
  deleteWorkSchedule,
  restoreWorkSchedule,
  forceDeleteWorkSchedule,
  getTrashedWorkSchedule,
  getWorkScheduleByUuid,
} from "@/api/workSchedule.api";
import { WorkScheduleInput } from "@/types/workSchedule.types";

export const useWorkSchedules = (trashed = false) => {
  return useQuery({
    queryKey: ["workSchedules", { trashed }],
    queryFn: trashed ? getTrashedWorkSchedule : getWorkSchedule,
    staleTime: 1000 * 60 * 5,
  });
};

export const useWorkScheduleByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["workSchedules", uuid],
    queryFn: () => getWorkScheduleByUuid(uuid),
    enabled: !!uuid,
  });
}

// CREATE with optimistic update
export const useCreateWorkSchedule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkScheduleInput) => createWorkSchedule(data),
    onMutate: async (newWorkSchedule) => {
      await qc.cancelQueries({ queryKey: ["workSchedules"] });
      const previous = qc.getQueryData(["workSchedules"]);
      qc.setQueryData(["workSchedules"], (old: any[] = []) => [...old, { ...newWorkSchedule, id: Date.now() }]);
      return { previous };
    },
    onError: (_err, _newWorkSchedule, context: any) => {
      if (context?.previous) qc.setQueryData(["workSchedules"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["workSchedules"] }),
  });
};

// UPDATE with optimistic update
export const useUpdateWorkSchedule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: WorkScheduleInput }) => updateWorkSchedule(uuid, data),
    onMutate: async ({ uuid, data }) => {
      await qc.cancelQueries({ queryKey: ["workSchedules"] });
      const previous = qc.getQueryData(["workSchedules"]);
      qc.setQueryData(["workSchedules"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, ...data } : d))
      );
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["workSchedules"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["workSchedules"] }),
  });
};

// DELETE with optimistic update
export const useDeleteWorkSchedule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteWorkSchedule(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["workSchedules"] });
      const previous = qc.getQueryData(["workSchedules"]);
      qc.setQueryData(["workSchedules"], (old: any[] = []) => old.filter((d) => d.uuid !== uuid));
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["workSchedules"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["workSchedules"] }),
  });
};

// RESTORE with optimistic update
export const useRestoreWorkSchedule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => restoreWorkSchedule(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["workSchedules"], exact: false });
      const trashed = qc.getQueryData(["workSchedules", {trashed: true}]);
      qc.setQueryData(["workSchedules", {trashed: true}], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid)
      );
      return { previousTrashed: trashed };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previousTrashed)
        qc.setQueryData(["workSchedules", {trashed: true}], context.previousTrashed);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["workSchedules"], exact: false }),
  });
};

// FORCE DELETE with optimistic update
export const useForceDeleteWorkSchedule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => forceDeleteWorkSchedule(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["workSchedules", {trashed: true}] });
      const previous = qc.getQueryData(["workSchedules", {trashed: true}]);
      qc.setQueryData(["workSchedules", {trashed: true}], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid)
      );
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["workSchedules", {trashed: true}], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["workSchedules", {trashed: true}] }),
  });
};
