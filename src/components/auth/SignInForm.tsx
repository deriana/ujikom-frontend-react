import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import ActivationModal from "./ActivationModal";

export default function SignInForm() {
  const { login, resendActivation } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showActivationModal, setShowActivationModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  // SignInForm.tsx

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      toast.success("Login successful");
      navigate("/");
    } catch (err: any) {
      const errorData = err?.response?.data;

      if (err?.response?.status === 403 && errorData?.needs_activation) {
        const userEmail = errorData.email || email; 
        setPendingEmail(userEmail);
        setShowActivationModal(true);

        try {
          await resendActivation(userEmail);
          toast.success("Account needs activation. A new link has been sent!");
        } catch (resendErr: any) {
          toast.error("Account not active, and failed to auto-send new link.");
        }
      } else {
        toast.error(errorData?.message || "Login failed. Check credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendActivation = async () => {
    try {
      setLoading(true);
      await resendActivation(pendingEmail);
      toast.success("New activation link sent to your email!");
      setShowActivationModal(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resend link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label>Email *</Label>
              <Input
                placeholder="info@gmail.com"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>Password *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="size-5 dark:text-white/90" />
                  ) : (
                    <EyeClosedIcon className="size-5 dark:text-white/90" />
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="text-sm text-gray-700 dark:text-gray-400">
                  Keep me logged in
                </span>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-brand-500 hover:text-brand-600"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="sm"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>

      <ActivationModal
        isOpen={showActivationModal}
        onClose={() => setShowActivationModal(false)}
        email={pendingEmail}
        onResend={handleResendActivation}
        isLoading={loading}
      />
    </div>
  );
}
