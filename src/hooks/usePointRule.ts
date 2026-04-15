import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPointRule,
  createPointRule,
  updatePointRule,
  deletePointRule,
  toggleStatusPointRule,
} from "@/api/pointRule.api";
import { PointRuleInput } from "@/types/point.types";

export const usePointRules = (options = {}) => {
  return useQuery({
    queryKey: ["point", "rules"],
    queryFn: getPointRule,
    staleTime: 1000 * 60 * 5,
    ...options
  });
};
// CREATE with optimistic update
export const useCreatePointRule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: PointRuleInput) => createPointRule(data),
    onMutate: async (newCategory) => {
      await qc.cancelQueries({ queryKey: ["point", "rules"] });
      const previous = qc.getQueryData(["point", "rules"]);
      qc.setQueryData(["point", "rules"], (old: any[] = []) => [...old, { ...newCategory, id: Date.now() }]);
      return { previous };
    },
    onError: (_err, _newCategory, context: any) => {
      if (context?.previous) qc.setQueryData(["point", "rules"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["point", "rules"] }),
  });
};

// TOGGLE STATUS with optimistic update
export const useToggleStatusPointRule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => toggleStatusPointRule(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["point", "rules"] });
      const previous = qc.getQueryData(["point", "rules"]);
      qc.setQueryData(["point", "rules"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, is_active: !d.is_active } : d))
      );
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["point", "rules"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["point", "rules"] }),
  });
};
// UPDATE with optimistic update
export const useUpdatePointRule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: PointRuleInput }) => updatePointRule(uuid, data),
    onMutate: async ({ uuid, data }) => {
      await qc.cancelQueries({ queryKey: ["point", "rules"] });
      const previous = qc.getQueryData(["point", "rules"]);
      qc.setQueryData(["point", "rules"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, ...data } : d))
      );
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["point", "rules"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["point", "rules"] }),
  });
};

// DELETE with optimistic update
export const useDeletePointRule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deletePointRule(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["point", "rules"] });
      const previous = qc.getQueryData(["point", "rules"]);
      qc.setQueryData(["point", "rules"], (old: any[] = []) => old.filter((d) => d.uuid !== uuid));
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["point", "rules"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["point", "rules"] }),
  });
};