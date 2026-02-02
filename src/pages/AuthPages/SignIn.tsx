import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Login"
        description="Login Page"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
