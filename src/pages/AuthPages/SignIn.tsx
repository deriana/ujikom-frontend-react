import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import PageMeta from "@/components/common/PageMeta";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Spinner from "@/components/ui/loading/Spinner";

export default function SignIn() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/")
    }
  }, [user, loading]);

  if (loading) return <Spinner />;
  
  return (
    <>
    <PageMeta title="Login" />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
