import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAttendanceCorrection,
  getAttendanceCorrectionApprovals,
  createAttendanceCorrection,
  updateAttendanceCorrection,
  deleteAttendanceCorrection,
  attendanceCorrectionApprovals,
  getAttendanceCorrectionByUuid,
} from "@/api/attendanceCorrection.api";
import { AttendanceCorrectionInput } from "@/types/attendance.types";

export const useAttendanceCorrections = () => {
  return useQuery({
    queryKey: ["attendanceCorrections"],
    queryFn: getAttendanceCorrection,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAttendanceCorrectionApprovalsList = () => {
  return useQuery({
    queryKey: ["attendanceCorrections", "approvals"],
    queryFn: getAttendanceCorrectionApprovals,
    staleTime: 1000 * 60 * 5,
  });
}

export const useAttendanceCorrectionByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["attendanceCorrections", uuid],
    queryFn: () => getAttendanceCorrectionByUuid(uuid),
    enabled: !!uuid,
  });
};

// CREATE with optimistic update
export const useCreateAttendanceCorrection = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: AttendanceCorrectionInput) => createAttendanceCorrection(data),
    onMutate: async (newCorrection) => {
      await qc.cancelQueries({ queryKey: ["attendanceCorrections"] });
      const previous = qc.getQueryData(["attendanceCorrections"]);
      qc.setQueryData(["attendanceCorrections"], (old: any[] = []) => [
        ...old,
        { ...newCorrection, id: Date.now() },
      ]);
      return { previous };
    },
    onError: (_err, _newCorrection, context: any) => {
      if (context?.previous) qc.setQueryData(["attendanceCorrections"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["attendanceCorrections"] }),
  });
};

export const useUpdateAttendanceCorrection = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: FormData }) =>
      updateAttendanceCorrection(uuid, data),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["attendanceCorrections"] });
      const previous = qc.getQueryData(["attendanceCorrections"]);

      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["attendanceCorrections"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["attendanceCorrections"] }),
  });
};

// DELETE with optimistic update
export const useDeleteAttendanceCorrection = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteAttendanceCorrection(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["attendanceCorrections"] });
      const previous = qc.getQueryData(["attendanceCorrections"]);
      qc.setQueryData(["attendanceCorrections"], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid),
      );
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["attendanceCorrections"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["attendanceCorrections"] }),
  });
};

export const useAttendanceCorrectionApprovals = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      status,
      note,
    }: {
      uuid: string;
      status: boolean;
      note?: string;
    }) => attendanceCorrectionApprovals(uuid, status, note),

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["attendanceCorrections"] });
    },
  });
};
