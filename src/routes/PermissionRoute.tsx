import { Navigate, Outlet } from "react-router-dom";
import { useCan } from "@/hooks/useCan";

interface PermissionRouteProps {
  permission: string;
}

export default function PermissionRoute({ permission }: PermissionRouteProps) {
  const allowed = useCan(permission);

  if (!allowed) return <Navigate to="/403" replace />; 

  return <Outlet />;
}
