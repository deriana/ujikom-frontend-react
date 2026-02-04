import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  getRoleById,
} from "@/api/role.api";
import { Role, RoleInput } from "@/types/role.types";

export const useRoles = () => {
  return useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: getRoles,
    staleTime: 1000 * 60 * 5, 
  });
};

export const useRoleById = (id: number) => {
  return useQuery<Role>({
    queryKey: ["roles", id],
    queryFn: () => getRoleById(id),
    enabled: !!id,
  });
};

export const usePermissions = () =>
  useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
    staleTime: 1000 * 60 * 30,
  });

export const useCreateRole = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: RoleInput) => createRole(data),

    onSuccess: (newRole) => {
      qc.setQueryData<Role[]>(["roles"], (old = []) => [...old, newRole]);
    },
  });
};

export const useUpdateRole = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RoleInput }) =>
      updateRole(id, data),

    onSuccess: (updatedRole, variables) => {
      qc.setQueryData<Role>(["roles", variables.id], updatedRole);

      qc.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useDeleteRole = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRole(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["roles"] });

      const previousRoles = qc.getQueryData<Role[]>(["roles"]);

      qc.setQueryData<Role[]>(["roles"], (old = []) =>
        old.filter((role) => role.id !== id)
      );

      return { previousRoles };
    },

    onError: (_err, _id, context) => {
      if (context?.previousRoles) {
        qc.setQueryData(["roles"], context.previousRoles);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
