import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { EyeClosedIcon, EyeIcon, KeyRound, ArrowLeft } from "lucide-react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Spinner from "../ui/loading/Spinner";

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkResetToken, resetPassword } = useAuth();

  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  // 1. Verify token validity on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        toast.error("Reset token is missing.");
        navigate("/login");
        return;
      }

      try {
        await checkResetToken(token);
        setIsVerifying(false);
      } catch (err: any) {
        toast.error("This link is invalid or has expired.");
        navigate("/forgot-password");
      }
    };

    verifyToken();
  }, [token, navigate, checkResetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !passwordConfirmation) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      await resetPassword({
        token: token,
        password: password,
        password_confirmation: passwordConfirmation,
      });

      toast.success("Password updated successfully! Please login.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <Spinner />
        <p className="mt-4 text-sm text-gray-500">Verifying reset link...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8 text-center sm:text-left">
          <div className="inline-flex items-center justify-center p-3 mb-4 bg-brand-100 dark:bg-brand-900/30 rounded-xl text-brand-600 dark:text-brand-400">
            <KeyRound size={28} />
          </div>
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Reset Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your new password below to regain access to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* New Password */}
            <div>
              <Label>New Password *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
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

            {/* Confirm Password */}
            <div>
              <Label>Confirm New Password *</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Repeat new password"
                value={passwordConfirmation}
                onChange={(e: any) => setPasswordConfirmation(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" size="sm" disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-500 dark:text-gray-400 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Sign In
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}