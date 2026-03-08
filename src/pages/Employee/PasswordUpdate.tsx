import Input from "@/components/form/input/InputField";
import { Eye, EyeOff, Send } from "lucide-react";
import { useState } from "react";
import { PasswordUpdateInput } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

interface PasswordUpdateProps {
  formData: PasswordUpdateInput;
  onChange: (data: PasswordUpdateInput) => void;
}

export const PasswordUpdate = ({ formData, onChange }: PasswordUpdateProps) => {
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [isSending, setIsSending] = useState(false);

  const { user, forgotPassword } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const togglePass = (field: keyof typeof showPass) => {
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleForgotLink = async () => {
    if (!user?.email) {
      toast.error("User email not found.");
      return;
    }

    try {
      setIsSending(true);
      await forgotPassword(user.email);
      toast.success(`Password reset link has been sent to ${user.email}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send reset link.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
          Current Password
        </label>
        <div className="relative">
          <Input 
            name="current_password" 
            value={formData.current_password} 
            onChange={handleChange} 
            type={showPass.current ? "text" : "password"} 
            placeholder="••••••••" 
          />
          <button 
            type="button" 
            onClick={() => togglePass("current")} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPass.current ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleForgotLink}
            disabled={isSending}
            className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSending ? (
              "Sending..."
            ) : (
              <>
                <Send size={12} />
                Forgot password? Send reset link to my email
              </>
            )}
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-100 dark:bg-gray-800 mx-2" />

      {/* --- New Password Section --- */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
          New Password
        </label>
        <div className="relative">
          <Input 
            name="new_password" 
            value={formData.new_password} 
            onChange={handleChange} 
            type={showPass.new ? "text" : "password"} 
            placeholder="Min. 8 characters" 
          />
          <button 
            type="button" 
            onClick={() => togglePass("new")} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* --- Confirm Password Section --- */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
          Confirm New Password
        </label>
        <div className="relative">
          <Input 
            name="new_password_confirmation" 
            value={formData.new_password_confirmation} 
            onChange={handleChange} 
            type={showPass.confirm ? "text" : "password"} 
            placeholder="Repeat new password" 
          />
          <button 
            type="button" 
            onClick={() => togglePass("confirm")} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};