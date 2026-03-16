import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDivision,
  createDivision,
  updateDivision,
  deleteDivision,
  restoreDivision,
  forceDeleteDivision,
  getTrashedDivision,
  getDivisionByUuid,
  getDivisionWithTeamAndEmployees,
} from "@/api/division.api";
import { DivisionInput } from "@/types/division.types";

export const useDivisions = (trashed = false) => {
  return useQuery({
    queryKey: ["divisions", { trashed }],
    queryFn: trashed ? getTrashedDivision : getDivision,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDivisionByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["divisions", uuid],
    queryFn: () => getDivisionByUuid(uuid),
    staleTime: 1000 * 60 * 5,
    enabled: !!uuid
  });
}

export const useDivisionWithTeamAndEmployees = () => {
  return useQuery({
    queryKey: ["divisions", "with-team-and-employees"],
    queryFn: getDivisionWithTeamAndEmployees,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60,    // 1 hour
  });
}


// CREATE with optimistic update
export const useCreateDivision = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: DivisionInput) => createDivision(data),
    onMutate: async (newDivision) => {
      await qc.cancelQueries({ queryKey: ["divisions"] });
      const previous = qc.getQueryData(["divisions"]);
      qc.setQueryData(["divisions"], (old: any[] = []) => [...old, { ...newDivision, id: Date.now() }]);
      return { previous };
    },
    onError: (_err, _newDivision, context: any) => {
      if (context?.previous) qc.setQueryData(["divisions"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["divisions"] }),
  });
};

// UPDATE with optimistic update
export const useUpdateDivision = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: DivisionInput }) => updateDivision(uuid, data),
    onMutate: async ({ uuid, data }) => {
      await qc.cancelQueries({ queryKey: ["divisions"] });
      const previous = qc.getQueryData(["divisions"]);
      qc.setQueryData(["divisions"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, ...data } : d))
      );
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["divisions"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["divisions"] }),
  });
};

// DELETE with optimistic update
export const useDeleteDivision = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteDivision(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["divisions"] });
      const previous = qc.getQueryData(["divisions"]);
      qc.setQueryData(["divisions"], (old: any[] = []) => old.filter((d) => d.uuid !== uuid));
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["divisions"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["divisions"] }),
  });
};

// RESTORE with optimistic update
export const useRestoreDivision = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => restoreDivision(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["divisions"], exact: false });
      const trashed = qc.getQueryData(["divisions", {trashed: true}]);
      qc.setQueryData(["divisions", {trashed: true}], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid)
      );
      return { previousTrashed: trashed };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previousTrashed)
        qc.setQueryData(["divisions", {trashed: true}], context.previousTrashed);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["divisions"], exact: false }),
  });
};

// FORCE DELETE with optimistic update
export const useForceDeleteDivision = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => forceDeleteDivision(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["divisions", {trashed: true}] });
      const previous = qc.getQueryData(["divisions", {trashed: true}]);
      qc.setQueryData(["divisions", {trashed: true}], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid)
      );
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["divisions", {trashed: true}], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["divisions", {trashed: true}] }),
  });
};
