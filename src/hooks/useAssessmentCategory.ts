import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAssessmentCategory,
  createAssessmentCategory,
  updateAssessmentCategory,
  deleteAssessmentCategory,
} from "@/api/assessmentCategory.api";
import { AssessmentCategoryInput } from "@/types/assessment.types";

export const useAssessmentCategories = (options = {}) => {
  return useQuery({
    queryKey: ["assessment", "categories"],
    queryFn: getAssessmentCategory,
    staleTime: 1000 * 60 * 5,
    ...options
  });
};
// CREATE with optimistic update
export const useCreateAssessmentCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: AssessmentCategoryInput) => createAssessmentCategory(data),
    onMutate: async (newCategory) => {
      await qc.cancelQueries({ queryKey: ["assessment", "categories"] });
      const previous = qc.getQueryData(["assessment", "categories"]);
      qc.setQueryData(["assessment", "categories"], (old: any[] = []) => [...old, { ...newCategory, id: Date.now() }]);
      return { previous };
    },
    onError: (_err, _newCategory, context: any) => {
      if (context?.previous) qc.setQueryData(["assessment", "categories"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["assessment", "categories"] }),
  });
};

// UPDATE with optimistic update
export const useUpdateAssessmentCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: AssessmentCategoryInput }) => updateAssessmentCategory(uuid, data),
    onMutate: async ({ uuid, data }) => {
      await qc.cancelQueries({ queryKey: ["assessment", "categories"] });
      const previous = qc.getQueryData(["assessment", "categories"]);
      qc.setQueryData(["assessment", "categories"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, ...data } : d))
      );
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["assessment", "categories"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["assessment", "categories"] }),
  });
};

// DELETE with optimistic update
export const useDeleteAssessmentCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteAssessmentCategory(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["assessment", "categories"] });
      const previous = qc.getQueryData(["assessment", "categories"]);
      qc.setQueryData(["assessment", "categories"], (old: any[] = []) => old.filter((d) => d.uuid !== uuid));
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["assessment", "categories"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["assessment", "categories"] }),
  });
};