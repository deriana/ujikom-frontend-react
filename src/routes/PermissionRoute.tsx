import { Navigate, Outlet } from "react-router-dom";
import { useCan } from "@/hooks/useCan";
import { useRoleName } from "@/hooks/useRoleName"; // Import hook role kamu
import { ROLES } from "@/constants/Roles";

interface PermissionRouteProps {
  permission: string;
}

export default function PermissionRoute({ permission }: PermissionRouteProps) {
  const allowed = useCan(permission);
  const { isRole } = useRoleName();

  // 1. TAMBAHKAN INI: Jika dia Admin atau Owner, langsung lolos (Bypass)
  if (isRole(ROLES.ADMIN) || isRole(ROLES.OWNER)) {
    return <Outlet />;
  }

  // 2. Jika bukan Admin, baru cek permission string-nya via useCan
  if (!allowed) {
    return <Navigate to="/403" replace />; 
  }

  return <Outlet />;
}