import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getShiftTemplate,
  createShiftTemplate,
  updateShiftTemplate,
  deleteShiftTemplate,
  restoreShiftTemplate,
  forceDeleteShiftTemplate,
  getTrashedShiftTemplate,
  getShiftTemplateByUuid,
} from "@/api/shiftTemplate.api";
import { ShiftTemplateInput } from "@/types/shiftTemplate.types";

export const useShiftTemplates = (trashed = false) => {
  return useQuery({
    queryKey: ["shiftTemplates", { trashed }],
    queryFn: trashed ? getTrashedShiftTemplate : getShiftTemplate,
    staleTime: 1000 * 60 * 5,
  });
};

export const useShiftTemplateByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["shiftTemplates", uuid],
    queryFn: () => getShiftTemplateByUuid(uuid),
    enabled: !!uuid,
  });
}

// CREATE with optimistic update
export const useCreateShiftTemplate = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: ShiftTemplateInput) => createShiftTemplate(data),
    onMutate: async (newShiftTemplate) => {
      await qc.cancelQueries({ queryKey: ["shiftTemplates"] });
      const previous = qc.getQueryData(["shiftTemplates"]);
      qc.setQueryData(["shiftTemplates"], (old: any[] = []) => [...old, { ...newShiftTemplate, id: Date.now() }]);
      return { previous };
    },
    onError: (_err, _newShiftTemplate, context: any) => {
      if (context?.previous) qc.setQueryData(["shiftTemplates"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["shiftTemplates"] }),
  });
};

// UPDATE with optimistic update
export const useUpdateShiftTemplate = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: ShiftTemplateInput }) => updateShiftTemplate(uuid, data),
    onMutate: async ({ uuid, data }) => {
      await qc.cancelQueries({ queryKey: ["shiftTemplates"] });
      const previous = qc.getQueryData(["shiftTemplates"]);
      qc.setQueryData(["shiftTemplates"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, ...data } : d))
      );
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["shiftTemplates"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["shiftTemplates"] }),
  });
};

// DELETE with optimistic update
export const useDeleteShiftTemplate = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteShiftTemplate(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["shiftTemplates"] });
      const previous = qc.getQueryData(["shiftTemplates"]);
      qc.setQueryData(["shiftTemplates"], (old: any[] = []) => old.filter((d) => d.uuid !== uuid));
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["shiftTemplates"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["shiftTemplates"] }),
  });
};

// RESTORE with optimistic update
export const useRestoreShiftTemplate = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => restoreShiftTemplate(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["shiftTemplates"], exact: false });
      const trashed = qc.getQueryData(["shiftTemplates", {trashed: true}]);
      qc.setQueryData(["shiftTemplates", {trashed: true}], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid)
      );
      return { previousTrashed: trashed };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previousTrashed)
        qc.setQueryData(["shiftTemplates", {trashed: true}], context.previousTrashed);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["shiftTemplates"], exact: false }),
  });
};

// FORCE DELETE with optimistic update
export const useForceDeleteShiftTemplate = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => forceDeleteShiftTemplate(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["shiftTemplates", {trashed: true}] });
      const previous = qc.getQueryData(["shiftTemplates", {trashed: true}]);
      qc.setQueryData(["shiftTemplates", {trashed: true}], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid)
      );
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["shiftTemplates", {trashed: true}], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["shiftTemplates", {trashed: true}] }),
  });
};
