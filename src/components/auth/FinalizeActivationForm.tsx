import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { EyeClosedIcon, EyeIcon, ShieldCheck } from "lucide-react";

export default function FinalizeActivationForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { finalizeActivation } = useAuth();

  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  // Route Protection: If token is not in URL
  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing activation token.");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !passwordConfirmation) {
      toast.error("All fields are required");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      await finalizeActivation({
        token: token,
        password: password,
        password_confirmation: passwordConfirmation,
      });
      
      toast.success("Account activated successfully!");
      navigate("/login");
    } catch (err: any) {
      const errorData = err?.response?.data;
      toast.error(errorData?.message || "Activation failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8 text-center sm:text-left">
          <div className="inline-flex items-center justify-center p-3 mb-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 sm:mx-0">
             <ShieldCheck size={28} />
          </div>
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Activate Your Account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Set your secure password to access the HRIS system.
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
                  placeholder="Create a strong password"
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
              <Label>Confirm Password *</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Repeat your password"
                value={passwordConfirmation}
                onChange={(e: any) => setPasswordConfirmation(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" size="sm" disabled={loading}>
              {loading ? "Activating Account..." : "Confirm & Activate"}
            </Button>

            <div className="text-center">
               <button 
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
               >
                 Back to Sign In
               </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}