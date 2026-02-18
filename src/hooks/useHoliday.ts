import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHoliday,
  createHoliday,
  updateHoliday,
  deleteHoliday,
} from "@/api/holiday.api";
import { HolidayInput } from "@/types/holiday.types";

export const useHolidays = () => {
  return useQuery({
    queryKey: ["holidays"],
    queryFn: getHoliday,
    staleTime: 1000 * 60 * 5,
  });
};
// CREATE with optimistic update
export const useCreateHoliday = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: HolidayInput) => createHoliday(data),
    onMutate: async (newHoliday) => {
      await qc.cancelQueries({ queryKey: ["holidays"] });
      const previous = qc.getQueryData(["holidays"]);
      qc.setQueryData(["holidays"], (old: any[] = []) => [...old, { ...newHoliday, id: Date.now() }]);
      return { previous };
    },
    onError: (_err, _newHoliday, context: any) => {
      if (context?.previous) qc.setQueryData(["holidays"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["holidays"] }),
  });
};

// UPDATE with optimistic update
export const useUpdateHoliday = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: HolidayInput }) => updateHoliday(uuid, data),
    onMutate: async ({ uuid, data }) => {
      await qc.cancelQueries({ queryKey: ["holidays"] });
      const previous = qc.getQueryData(["holidays"]);
      qc.setQueryData(["holidays"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, ...data } : d))
      );
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["holidays"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["holidays"] }),
  });
};

// DELETE with optimistic update
export const useDeleteHoliday = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteHoliday(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["holidays"] });
      const previous = qc.getQueryData(["holidays"]);
      qc.setQueryData(["holidays"], (old: any[] = []) => old.filter((d) => d.uuid !== uuid));
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["holidays"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["holidays"] }),
  });
};