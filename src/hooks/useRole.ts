import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  getRoleById
} from "@/api/role.api";
import { RoleInput } from "@/types/role.types";

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
};

export const useRoleById = (id: number) => {
  return useQuery({
    queryKey: ["roles", id],
    queryFn: () => getRoleById(id),
  });
}

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
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });
};

export const useUpdateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RoleInput }) =>
      updateRole(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });
};

export const useDeleteRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });
};
