import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmployeeWorkSchedule,
  createEmployeeWorkSchedule,
  updateEmployeeWorkSchedule,
  deleteEmployeeWorkSchedule,
  getEmployeeWorkScheduleByUuid,
} from "@/api/employeeWorkSchedule.api";
import { EmployeeWorkScheduleInput } from "@/types/employeeWorkSchedule.types";

export const useEmployeeWorkSchedules = () => {
  return useQuery({
    queryKey: ["employeeWorkSchedules"],
    queryFn: getEmployeeWorkSchedule,
    staleTime: 1000 * 60 * 5,
  });
};

export const useEmployeeWorkScheduleByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["employeeWorkSchedules", uuid],
    queryFn: () => getEmployeeWorkScheduleByUuid(uuid),
    enabled: !!uuid,
  });
}

export const useCreateEmployeeWorkSchedule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: EmployeeWorkScheduleInput) => createEmployeeWorkSchedule(data),
    onMutate: async (newEmployeeWorkSchedule) => {
      await qc.cancelQueries({ queryKey: ["employeeWorkSchedules"] });
      const previous = qc.getQueryData(["employeeWorkSchedules"]);
      qc.setQueryData(["employeeWorkSchedules"], (old: any[] = []) => [...old, { ...newEmployeeWorkSchedule, id: Date.now() }]);
      return { previous };
    },
    onError: (_err, _newEmployeeWorkSchedule, context: any) => {
      if (context?.previous) qc.setQueryData(["employeeWorkSchedules"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["employeeWorkSchedules"] }),
  });
};

export const useUpdateEmployeeWorkSchedule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: EmployeeWorkScheduleInput }) => updateEmployeeWorkSchedule(uuid, data),
    onMutate: async ({ uuid, data }) => {
      await qc.cancelQueries({ queryKey: ["employeeWorkSchedules"] });
      const previous = qc.getQueryData(["employeeWorkSchedules"]);
      qc.setQueryData(["employeeWorkSchedules"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, ...data } : d))
      );
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["employeeWorkSchedules"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["employeeWorkSchedules"] }),
  });
};

export const useDeleteEmployeeWorkSchedule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteEmployeeWorkSchedule(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["employeeWorkSchedules"] });
      const previous = qc.getQueryData(["employeeWorkSchedules"]);
      qc.setQueryData(["employeeWorkSchedules"], (old: any[] = []) => old.filter((d) => d.uuid !== uuid));
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["employeeWorkSchedules"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["employeeWorkSchedules"] }),
  });
};