import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmployeeShift,
  createEmployeeShift,
  updateEmployeeShift,
  deleteEmployeeShift,
} from "@/api/employeeShift.api";
import { EmployeeShiftInput } from "@/types/employeeShift.types";

export const useEmployeeShifts = () => {
  return useQuery({
    queryKey: ["employeeShifts"],
    queryFn: getEmployeeShift,  
    staleTime: 1000 * 60 * 5,
  });
};
// CREATE with optimistic update
export const useCreateEmployeeShift = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: EmployeeShiftInput) => createEmployeeShift(data),
    onMutate: async (newEmployeeShift) => {
      await qc.cancelQueries({ queryKey: ["employeeShifts"] });
      const previous = qc.getQueryData(["employeeShifts"]);
      qc.setQueryData(["employeeShifts"], (old: any[] = []) => [...old, { ...newEmployeeShift, id: Date.now() }]);
      return { previous };
    },
    onError: (_err, _newEmployeeShift, context: any) => {
      if (context?.previous) qc.setQueryData(["employeeShifts"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["employeeShifts"] }),
  });
};

// UPDATE with optimistic update
export const useUpdateEmployeeShift = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: EmployeeShiftInput }) => updateEmployeeShift(uuid, data),
    onMutate: async ({ uuid, data }) => {
      await qc.cancelQueries({ queryKey: ["employeeShifts"] });
      const previous = qc.getQueryData(["employeeShifts"]);
      qc.setQueryData(["employeeShifts"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, ...data } : d))
      );
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["employeeShifts"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["employeeShifts"] }),
  });
};

// DELETE with optimistic update
export const useDeleteEmployeeShift = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteEmployeeShift(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["employeeShifts"] });
      const previous = qc.getQueryData(["employeeShifts"]);
      qc.setQueryData(["employeeShifts"], (old: any[] = []) => old.filter((d) => d.uuid !== uuid));
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["employeeShifts"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["employeeShifts"] }),
  });
};