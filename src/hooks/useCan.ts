import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { can } from "@/utils/permission";

export const useCan = (permission: string) => {
  const { user, permissions } = useContext(AuthContext);
  return can(permission, permissions, user?.roles);
};
