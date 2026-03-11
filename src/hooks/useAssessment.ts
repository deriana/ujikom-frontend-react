import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAssessment,
  getAssessmentByUuid,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} from "@/api/assessment.api";
import { AssessmentInput } from "@/types/assessment.types";

export const useAssessments = () => {
  return useQuery({
    queryKey: ["assessments"],
    queryFn: getAssessment,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAssessmentByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["assessments", uuid],
    queryFn: () => getAssessmentByUuid(uuid),
    staleTime: 1000 * 60 * 5,
    enabled: !!uuid
  });
}

// CREATE with optimistic update
export const useCreateAssessment = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: AssessmentInput) => createAssessment(data),
    onMutate: async (newAssessment) => {
      await qc.cancelQueries({ queryKey: ["assessments"] });
      const previous = qc.getQueryData(["assessments"]);
      qc.setQueryData(["assessments"], (old: any[] = []) => [...old, { ...newAssessment, uuid: `temp-${Date.now()}` }]);
      return { previous };
    },
    onError: (_err, _newAssessment, context: any) => {
      if (context?.previous) qc.setQueryData(["assessments"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["assessments"] }),
  });
};

// UPDATE with optimistic update
export const useUpdateAssessment = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: AssessmentInput }) => updateAssessment(uuid, data),
    onMutate: async ({ uuid, data }) => {
      await qc.cancelQueries({ queryKey: ["assessments"] });
      const previous = qc.getQueryData(["assessments"]);
      qc.setQueryData(["assessments"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, ...data } : d))
      );
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["assessments"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["assessments"] }),
  });
};

// DELETE with optimistic update
export const useDeleteAssessment = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteAssessment(uuid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assessments"] });
    }
  });
};
