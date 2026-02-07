import { User, UserInput } from "@/types/user.types";
import api from "./axios";
import { ApiResponse } from "@/types";

/** ===== Basic CRUD ===== */
export const getUser = async () => {
  const res = await api.get<ApiResponse<User[]>>("/users");
  return res.data.data;
};

export const getUserByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<User>>(`/users/${uuid}`);
  return res.data.data;
}

export const createUser = async (payload: UserInput) => {
  const res = await api.post<ApiResponse<User>>("/users", payload);
  return res.data.data;
};

export const updateUser = async (uuid: string, payload: UserInput) => {
  const res = await api.put<ApiResponse<User>>(`/users/${uuid}`, payload);
  return res.data.data;
};

export const deleteUser = async (uuid: string) => {
  const res = await api.delete<ApiResponse<User>>(`/users/${uuid}`);
  return res.data.data;
};

/** ===== Trash & Restore ===== */
export const restoreUser = async (uuid: string) => {
  const res = await api.post<ApiResponse<User>>(`/users/restore/${uuid}`);
  return res.data.data;
};

export const forceDeleteUser = async (uuid: string) => {
  const res = await api.delete<ApiResponse<User>>(`/users/force-delete/${uuid}`);
  return res.data.data;
};

export const getTrashedUser = async () => {
  const res = await api.get<ApiResponse<User[]>>("/users/trashed");
  return res.data.data;
};

/** ===== New routes ===== */

/** Terminate Employment */
export const terminateEmployment = async (
  uuid: string,
  state: "resigned" | "terminated",
  date?: string 
) => {
  const res = await api.put<ApiResponse<User>>(
    `/users/terminate-employment/${uuid}`,
    { state, date }
  );
  return res.data.data;
};

/** Admin change password */
export const changePassword = async (uuid: string, newPassword: string) => {
  const res = await api.put<ApiResponse<User>>(
    `/users/change-password/${uuid}`,
    { new_password: newPassword }
  );
  return res.data.data;
};

/** Change user active status */
export const changeUserStatus = async (uuid: string, isActive: boolean) => {
  const res = await api.put<ApiResponse<User>>(
    `/users/status/${uuid}`,
    { is_active: isActive }
  );
  return res.data.data;
};

/** Upload profile photo */
export const uploadProfilePhoto = async (uuid: string, file: File) => {
  const formData = new FormData();
  formData.append("profile_photo", file);

  const res = await api.post<ApiResponse<User>>(
    `/users/upload-profile-photo/${uuid}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.data;
};
