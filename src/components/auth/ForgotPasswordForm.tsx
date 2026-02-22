import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { MailIcon, ArrowLeftIcon, CheckCircleIcon } from "lucide-react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

export default function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email);
      setIsSent(true);
      toast.success("Reset link sent successfully!");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Success State: Displayed after email is successfully sent
  if (isSent) {
    return (
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center size-16 bg-green-100 dark:bg-green-500/20 rounded-full">
            <CheckCircleIcon className="size-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Check your email
        </h1>
        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          We have sent a password reset link to <span className="font-medium text-gray-800 dark:text-white">{email}</span>. Please check your inbox and spam folder.
        </p>
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Forgot Password?
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No worries! Enter your email below and we'll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label>Email Address *</Label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  className="pl-10" // Add padding for icon
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <MailIcon className="size-5" />
                </span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="sm"
              disabled={loading}
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600"
              >
                <ArrowLeftIcon className="size-4" />
                Return to Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}