import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import PageMeta from "@/components/common/PageMeta";

export default function SignIn() {
  return (
    <>
    <PageMeta title="Login" />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
