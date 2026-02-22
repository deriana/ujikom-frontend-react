import AuthLayout from "./AuthPageLayout";
import PageMeta from "@/components/common/PageMeta";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Spinner from "@/components/ui/loading/Spinner";
import FinalizeActivationForm from "@/components/auth/FinalizeActivationForm";

export default function FinalizeActivation() {
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
      <PageMeta title="Account Activation" />
      <AuthLayout>
        <FinalizeActivationForm />
      </AuthLayout>
    </>
  );
}