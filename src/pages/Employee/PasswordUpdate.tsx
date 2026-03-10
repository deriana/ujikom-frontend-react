import { useState, useEffect } from "react";
import { Eye, EyeOff, Send, CheckCircle2, Circle } from "lucide-react";
import { PasswordUpdateInput } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";
import Input from "@/components/form/input/InputField";
import toast from "react-hot-toast";

interface PasswordUpdateProps {
  formData: PasswordUpdateInput;
  onChange: (data: PasswordUpdateInput) => void;
}

const initialPasswordState: PasswordUpdateInput = {
  current_password: "",
  new_password: "",
  new_password_confirmation: ""
};

export const PasswordUpdate = ({ formData, onChange }: PasswordUpdateProps) => {
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [isSending, setIsSending] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const { user, forgotPassword } = useAuth();

  useEffect(() => {
    if (!formData || !formData.current_password) {
      onChange(initialPasswordState);
    }
  }, []);

  const newPasswordValue = formData?.new_password ?? "";
  const confirmPasswordValue = formData?.new_password_confirmation ?? "";
  const currentPasswordValue = formData?.current_password ?? "";

  const { hasMinLength, hasUppercase, hasNumber, strength } = usePasswordValidation(newPasswordValue);

  const isMatching = 
    newPasswordValue.length > 0 && 
    newPasswordValue === confirmPasswordValue;

  const checkCapsLock = (e: React.KeyboardEvent) => {
    setIsCapsLockOn(e.getModifierState("CapsLock"));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const togglePass = (field: keyof typeof showPass) => {
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleForgotLink = async () => {
    if (!user?.email) return toast.error("User email not found.");
    try {
      setIsSending(true);
      await forgotPassword(user.email);
      toast.success(`Reset link sent to ${user.email}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send link.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* --- Current Password --- */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Current Password</label>
        <div className="relative group">
          <Input 
            name="current_password" 
            value={currentPasswordValue} 
            onChange={handleChange} 
            type={showPass.current ? "text" : "password"} 
            placeholder="••••••••" 
          />
          <button type="button" onClick={() => togglePass("current")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500">
            {showPass.current ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="mt-2 flex justify-end">
          <button type="button" onClick={handleForgotLink} disabled={isSending} className="text-[10px] font-bold text-brand-500 hover:underline flex items-center gap-1 disabled:opacity-50 uppercase tracking-tighter">
            {isSending ? "Sending..." : <><Send size={10} /> Forgot password? Send reset link</>}
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-100 dark:bg-gray-800" />

      {/* --- New Password Section --- */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">New Password</label>
        <div className="relative">
          <Input 
            name="new_password" 
            value={newPasswordValue} 
            onChange={handleChange} 
            onKeyUp={checkCapsLock}
            type={showPass.new ? "text" : "password"} 
            placeholder="Create strong password" 
            className={isCapsLockOn ? "ring-2 ring-orange-400" : ""}
          />
          <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-3">
             {isCapsLockOn && (
               <span className="text-[9px] font-black text-orange-500 bg-orange-100 px-1.5 py-0.5 rounded animate-pulse">CAPS ON</span>
             )}
             <button type="button" onClick={() => togglePass("new")} className="text-gray-400 hover:text-brand-500">
               {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
             </button>
          </div>
        </div>

        {/* --- Strength Bar --- */}
        <div className="mt-3 px-1">
          <div className="flex justify-between items-center mb-1">
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
        </div>

        {/* --- Checklist Rules --- */}
        <div className="grid grid-cols-2 gap-2 mt-3 px-1">
           <RuleItem label="8+ Characters" active={hasMinLength} />
           <RuleItem label="Uppercase" active={hasUppercase} />
           <RuleItem label="Includes Number" active={hasNumber} />
           <RuleItem label="Confirm Match" active={isMatching} />
        </div>
      </div>

      {/* --- Confirm Password --- */}
      <div className="pt-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Confirm New Password</label>
        <div className="relative">
          <Input 
            name="new_password_confirmation" 
            value={confirmPasswordValue} 
            onChange={handleChange} 
            type={showPass.confirm ? "text" : "password"} 
            placeholder="Repeat new password" 
          />
          <button type="button" onClick={() => togglePass("confirm")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500">
            {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

const RuleItem = ({ label, active }: { label: string, active: boolean }) => (
  <div className={`flex items-center gap-1.5 transition-colors ${active ? 'text-green-600' : 'text-gray-400'}`}>
    {active ? <CheckCircle2 size={12} strokeWidth={3} /> : <Circle size={12} strokeWidth={3} />}
    <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
  </div>
);