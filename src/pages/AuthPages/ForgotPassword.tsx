import AuthLayout from "./AuthPageLayout";
import PageMeta from "@/components/common/PageMeta";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Spinner from "@/components/ui/loading/Spinner";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading]);

  if (loading) return <Spinner />;

  return (
    <>
      <PageMeta title="Forgot Password" />
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </>
  );
}