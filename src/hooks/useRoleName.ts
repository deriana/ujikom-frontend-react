import { useContext, useMemo } from "react";
import { AuthContext } from "@/context/AuthContext";
import { ROLES } from "@/constants/Roles";
import { UserRoleType } from "@/types";

export const useRoleName = () => {
  const { user } = useContext(AuthContext);
  const role = useMemo(() => user?.roles?.[0]?.name ?? "", [user]);

  const isRole = (roleName: string) => role === roleName;
  
  const isAdminOrHR = useMemo(() => 
    [ROLES.ADMIN, ROLES.HR].includes(role as UserRoleType), 
  [role]);

  const isAdmin = useMemo(() => role === ROLES.ADMIN, [role]);

  return { role, isRole, isAdminOrHR, isAdmin };
};