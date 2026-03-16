import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePasswordValidation } from "@/hooks/usePasswordValidation"; // Import hook
import toast from "react-hot-toast";
import { EyeClosedIcon, EyeIcon, KeyRound, ArrowLeft, CheckCircle2, Circle } from "lucide-react";
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

  // Integrasi Hook Validasi
  const { hasMinLength, hasUppercase, hasNumber, strength, isValid } = usePasswordValidation(password);
  const isMatching = password.length > 0 && password === passwordConfirmation;

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

    if (!isValid) {
      toast.error("Password does not meet security requirements.");
      return;
    }

    if (!isMatching) {
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
          <div className="space-y-5">
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500"
                >
                  {showPassword ? <EyeIcon size={20} /> : <EyeClosedIcon size={20} />}
                </button>
              </div>

              {/* Strength Bar & Checklist */}
              <div className="mt-4 px-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Strength</span>
                  <span className={`text-[10px] font-black uppercase ${strength < 50 ? 'text-red-500' : strength < 100 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {strength < 50 ? 'Weak' : strength < 100 ? 'Medium' : 'Strong'}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${strength < 50 ? 'bg-red-500' : strength < 100 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${strength}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <RuleItem label="8+ Characters" active={hasMinLength} />
                  <RuleItem label="Uppercase" active={hasUppercase} />
                  <RuleItem label="Includes Number" active={hasNumber} />
                  <RuleItem label="Confirm Match" active={isMatching} />
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="pt-2">
              <Label>Confirm New Password *</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Repeat new password"
                value={passwordConfirmation}
                onChange={(e: any) => setPasswordConfirmation(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full mt-2" size="sm" disabled={loading || !isValid || !isMatching}>
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

// Helper RuleItem agar desain konsisten
const RuleItem = ({ label, active }: { label: string; active: boolean }) => (
  <div className={`flex items-center gap-1.5 transition-colors ${active ? 'text-green-600' : 'text-gray-400'}`}>
    {active ? <CheckCircle2 size={12} strokeWidth={3} /> : <Circle size={12} strokeWidth={3} />}
    <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
  </div>
);