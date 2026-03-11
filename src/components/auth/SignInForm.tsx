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
  const [capsLockActive, setCapsLockActive] = useState(false);

  const [showActivationModal, setShowActivationModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState("CapsLock")) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Welcome Back!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please enter your credentials to access your workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label>Email *</Label>
              <Input
                placeholder="name@company.com"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>Password *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeIcon
                      key="eye-open"
                      className="size-5 text-gray-500 dark:text-white/90"
                    />
                  ) : (
                    <EyeClosedIcon
                      key="eye-closed"
                      className="size-5 text-gray-500 dark:text-white/90"
                    />
                  )}
                </span>
              </div>
              {capsLockActive && (
                <p className="mt-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" /> Caps Lock is ON
                </p>
              )}
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
