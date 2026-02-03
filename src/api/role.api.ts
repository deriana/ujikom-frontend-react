import api from "./axios";
import { ApiResponse } from "@/types";
import { Modules, Role, RoleInput } from "@/types/role.types";

export const getRoles = async () => {
  const res = await api.get<ApiResponse<Role[]>>("/roles");
  return res.data.data;
};

export const getPermissions = async () => {
  const res = await api.get<ApiResponse<Modules[]>>("/permissions/modules");
  return res.data.data;
};

export const getRoleById = async (id: number) => {
  const res = await api.get<ApiResponse<Role>>(`/roles/${id}`);
  return res.data.data;
};

export const createRole = async (payload: RoleInput) => {
  const res = await api.post<ApiResponse<Role>>("/roles", payload);
  return res.data.data;
};

export const updateRole = async (id: number, payload: RoleInput) => {
  const res = await api.put<ApiResponse<Role>>(`/roles/${id}`, payload);
  return res.data.data;
};

export const deleteRole = async (id: number) => {
  const res = await api.delete<ApiResponse<null>>(`/roles/${id}`);
  return res.data;
};
