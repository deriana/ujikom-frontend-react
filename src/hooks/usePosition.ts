import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPosition,
  createPosition,
  updatePosition,
  deletePosition,
  restorePosition,
  forceDeletePosition,
  getTrashedPosition,
  getPositionByUuid,
} from "@/api/position.api";
import { PositionInput } from "@/types/position.types";

export const usePositions = (trashed = false) => {
  return useQuery({
    queryKey: ["positions", { trashed }],
    queryFn: trashed ? getTrashedPosition : getPosition,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePositionByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["positions", uuid],
    queryFn: () => getPositionByUuid(uuid),
    enabled: !!uuid,
  });
}

// CREATE with optimistic update
export const useCreatePosition = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: PositionInput) => createPosition(data),
    onMutate: async (newPosition) => {
      await qc.cancelQueries({ queryKey: ["positions"] });
      const previous = qc.getQueryData(["positions"]);
      qc.setQueryData(["positions"], (old: any[] = []) => [...old, { ...newPosition, id: Date.now() }]);
      return { previous };
    },
    onError: (_err, _newPosition, context: any) => {
      if (context?.previous) qc.setQueryData(["positions"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["positions"] }),
  });
};

// UPDATE with optimistic update
export const useUpdatePosition = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: PositionInput }) => updatePosition(uuid, data),
    onMutate: async ({ uuid, data }) => {
      await qc.cancelQueries({ queryKey: ["positions"] });
      const previous = qc.getQueryData(["positions"]);
      qc.setQueryData(["positions"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, ...data } : d))
      );
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["positions"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["positions"] }),
  });
};

// DELETE with optimistic update
export const useDeletePosition = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deletePosition(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["positions"] });
      const previous = qc.getQueryData(["positions"]);
      qc.setQueryData(["positions"], (old: any[] = []) => old.filter((d) => d.uuid !== uuid));
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["positions"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["positions"] }),
  });
};

// RESTORE with optimistic update
export const useRestorePosition = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => restorePosition(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["positions"], exact: false });
      const trashed = qc.getQueryData(["positions", {trashed: true}]);
      qc.setQueryData(["positions", {trashed: true}], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid)
      );
      return { previousTrashed: trashed };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previousTrashed)
        qc.setQueryData(["positions", {trashed: true}], context.previousTrashed);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["positions"], exact: false }),
  });
};

// FORCE DELETE with optimistic update
export const useForceDeletePosition = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => forceDeletePosition(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["positions", {trashed: true}] });
      const previous = qc.getQueryData(["positions", {trashed: true}]);
      qc.setQueryData(["positions", {trashed: true}], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid)
      );
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["positions", {trashed: true}], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["positions", {trashed: true}] }),
  });
};
