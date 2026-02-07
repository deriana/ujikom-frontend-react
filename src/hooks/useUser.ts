import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUser,
  getUserByUuid,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  forceDeleteUser,
  getTrashedUser,
  terminateEmployment,
  changePassword,
  changeUserStatus,
  uploadProfilePhoto,
  getManager,
} from "@/api/user.api";
import { UserInput } from "@/types/user.types";

/** ===== Queries ===== */
export const useUsers = (trashed = false) => {
  return useQuery({
    queryKey: ["users", { trashed }],
    queryFn: trashed ? getTrashedUser : getUser,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUserByUuid = (uuid?: string) => {
  return useQuery({
    queryKey: ["users", uuid],
    queryFn: () => getUserByUuid(uuid!),
    enabled: !!uuid,
  });
};

export const useGetManager = () => {
  return useQuery({
    queryKey: ["users", "manager"],
    queryFn: getManager,
    staleTime: 1000 * 60 * 5,
  });
}

/** ===== Mutations ===== */
export const useCreateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: UserInput) => createUser(data),
    onMutate: async (newUser) => {
      await qc.cancelQueries({ queryKey: ["users"] });
      const previous = qc.getQueryData(["users"]);
      qc.setQueryData(["users"], (old: any[] = []) => [
        ...old,
        { ...newUser, uuid: Date.now().toString() },
      ]);
      return { previous };
    },
    onError: (_err, _newUser, context: any) => {
      if (context?.previous) qc.setQueryData(["users"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UserInput }) =>
      updateUser(uuid, data),
    onMutate: async ({ uuid, data }) => {
      await qc.cancelQueries({ queryKey: ["users"] });
      const previous = qc.getQueryData(["users"]);
      qc.setQueryData(["users"], (old: any[] = []) =>
        old.map((d) => (d.uuid === uuid ? { ...d, ...data } : d))
      );
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) qc.setQueryData(["users"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteUser(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["users"] });
      const previous = qc.getQueryData(["users"]);
      qc.setQueryData(["users"], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid)
      );
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["users"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useRestoreUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => restoreUser(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["users", { trashed: true }] });
      const previousTrashed = qc.getQueryData(["users", { trashed: true }]);
      qc.setQueryData(["users", { trashed: true }], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid)
      );
      return { previousTrashed };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previousTrashed)
        qc.setQueryData(["users", { trashed: true }], context.previousTrashed);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["users"], exact: false }),
  });
};

export const useForceDeleteUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => forceDeleteUser(uuid),
    onMutate: async (uuid) => {
      await qc.cancelQueries({ queryKey: ["users", { trashed: true }] });
      const previous = qc.getQueryData(["users", { trashed: true }]);
      qc.setQueryData(["users", { trashed: true }], (old: any[] = []) =>
        old.filter((d) => d.uuid !== uuid)
      );
      return { previous };
    },
    onError: (_err, _uuid, context: any) => {
      if (context?.previous) qc.setQueryData(["users", { trashed: true }], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["users", { trashed: true }] }),
  });
};

/** ===== New mutations ===== */

/** Terminate Employment */
export const useTerminateEmployment = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, state, date }: { uuid: string; state: "resigned" | "terminated"; date?: string }) =>
      terminateEmployment(uuid, state, date),
    onSettled: () => qc.invalidateQueries({ queryKey: ["users"], exact: false }),
  });
};

/** Change Password */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ uuid, newPassword }: { uuid: string; newPassword: string }) =>
      changePassword(uuid, newPassword),
  });
};

/** Change Status */
export const useChangeUserStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, isActive }: { uuid: string; isActive: boolean }) =>
      changeUserStatus(uuid, isActive),
    onSettled: () => qc.invalidateQueries({ queryKey: ["users"], exact: false }),
  });
};

/** Upload Profile Photo */
export const useUploadProfilePhoto = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, file }: { uuid: string; file: File }) =>
      uploadProfilePhoto(uuid, file),
    onSettled: () => qc.invalidateQueries({ queryKey: ["users"], exact: false }),
  });
};
