import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth"; 
import { useRoleName } from "@/hooks/useRoleName";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ROLES } from "@/constants/Roles";

export default function RouteServiceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { isRole } = useRoleName();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (loading) return;

    if (user) {
      if (isRole(ROLES.ADMIN) || isRole(ROLES.OWNER)) {
        navigate("/dashboard/admin", { replace: true });
      } else if (isMobile) {
        navigate("/home", { replace: true });
      } else {
        navigate("/dashboard/employee", { replace: true });
      }
    }
  }, [user, loading, isRole, isMobile, navigate]);

  if (loading) {
    return null;
  }

  return <>{!user ? children : null}</>;
}
