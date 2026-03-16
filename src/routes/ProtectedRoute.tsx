import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Spinner from "@/components/ui/loading/Spinner";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
