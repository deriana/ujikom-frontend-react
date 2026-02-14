import { User } from "@/types/auth.types";

/**
 * Ambil role utama user
 */
export const getRoleName = (user: User | null): string => {
  return user?.roles?.[0]?.name ?? "";
};

/**
 * Cek role utama
 */
export const hasRole = (user: User | null, roleName: string): boolean => {
  return getRoleName(user) === roleName;
};
