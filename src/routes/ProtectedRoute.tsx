import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Spinner from "@/components/ui/loading/Spinner";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  
  const hasToken = !!localStorage.getItem("token");

  if (loading) return <Spinner />;

  return (user || hasToken) ? <Outlet /> : <Navigate to="/login" replace />;
}