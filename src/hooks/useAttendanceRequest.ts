import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAttendanceRequest,
  createAttendanceRequest,
  updateAttendanceRequest,
  deleteAttendanceRequest,
  attendanceRequestApprovals,
  getAttendanceRequestByUuid,
  attendanceRequestApprovalsList,
} from "@/api/attendanceRequest.api";
import { AttendanceRequestInput } from "@/types/attendanceRequest.types";

export const useAttendanceRequests = () => {
  return useQuery({
    queryKey: ["attendanceRequests"],
    queryFn: getAttendanceRequest,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAttendanceRequestApprovalsList = () => {
  return useQuery({
    queryKey: ["attendanceRequests", "approvals"],
    queryFn: attendanceRequestApprovalsList,
    staleTime: 1000 * 60 * 5,
  });
}

export const useAttendanceRequestByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["attendanceRequests", uuid],
    queryFn: () => getAttendanceRequestByUuid(uuid),
    enabled: !!uuid,
  });
};

// CREATE with optimistic update
export const useCreateAttendanceRequest = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: AttendanceRequestInput) => createAttendanceRequest(data),
    onMutate: async (newAttendanceRequest) => {
      await qc.cancelQueries({ queryKey: ["attendanceRequests"] });
      const previous = qc.getQueryData(["attendanceRequests"]);
      qc.setQueryData(["attendanceRequests"], (old: any[] = []) => [
        ...old,
        { ...newAttendanceRequest, id: Date.now() },
      ]);
      return { previous };
    },
    onError: (_err, _newAttendanceRequest, context: any) => {
      if (context?.previous) qc.setQueryData(["attendanceRequests"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["attendanceRequests"] }),
  });
};

export const useUpdateAttendanceRequest = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: AttendanceRequestInput }) =>
      updateAttendanceRequest(uuid, data),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["attendanceRequests"] });
      const previous = qc.getQueryData(["attendanceRequests"]);

      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["attendanceRequests"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["attendanceRequests"] }),
  });
};

// DELETE with optimistic update
export const useDeleteAttendanceRequest = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteAttendanceRequest(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["attendanceRequests"] });
      const previous = qc.getQueryData(["attendanceRequests"]);
      qc.setQueryData(["attendanceRequests"], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid),
      );
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["attendanceRequests"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["attendanceRequests"] }),
  });
};

export const useAttendanceRequestApprovals = () => {
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
    }) => attendanceRequestApprovals(uuid, status, note),

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["attendanceRequests"] });
    },
  });
};
