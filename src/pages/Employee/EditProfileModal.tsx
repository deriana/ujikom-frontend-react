import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { User, Briefcase, Fingerprint, Lock, Info } from "lucide-react";
import { BiometricCapture } from "./BiometricCapture";
import { PasswordUpdate } from "./PasswordUpdate";
import { useUpdateBiometricData, useUpdatePassword } from "@/hooks/useUser";
import { toast } from "react-hot-toast";
import { handleMutation } from "@/utils/handleMutation";
import { PasswordUpdateInput } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "personal" | "employment" | "biometric" | "password" | null;
  data: any;
  onSubmit: (formData: any) => void;
  isLoading?: boolean;
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  type,
  data,
  onSubmit,
  isLoading = false,
}: EditModalProps) => {
  const [formData, setFormData] = useState<any>({});
  const { mutateAsync: updatePassword } = useUpdatePassword();
  const { mutateAsync: updateBiometricData } = useUpdateBiometricData();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleBiometricSubmit = async (allDescriptors: number[][]) => {
    setLoading(true);
    try {
      await handleMutation(
        () => updateBiometricData({ descriptors: allDescriptors }),
        {
          loading: "Registering face data...",
          success: "Biometric updated!",
          error: "Failed to update biometric",
        },
      );
      onClose();
    } catch (error) {
      console.error("Biometric update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "password") {
      const passwordData = formData as PasswordUpdateInput;
      if (
        passwordData.new_password !== passwordData.new_password_confirmation
      ) {
        return toast.error("Passwords do not match!");
      }

      setLoading(true);
      try {
        await handleMutation(() => updatePassword(formData), {
          loading: "Updating password...",
          success: "Password updated!",
          error: "Failed to update password",
        });
        onClose();
        toast.success("Password updated! Please log in again.");
        queryClient.clear();
        window.location.href = "/login";
      } catch (error) {
        setLoading(false);
      }
    }
  };

  const getHeaderInfo = () => {
    switch (type) {
      case "personal":
        return {
          title: "Update Personal Details",
          desc: "Update your contact information and address.",
          icon: <User size={22} />,
          color:
            "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
        };
      case "password":
        return {
          title: "Change Password",
          desc: "Ensure your account is using a strong password.",
          icon: <Lock size={22} />,
          color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
        };
      case "biometric":
        return {
          title: "Biometric Data",
          desc: data?.employee?.has_face_descriptor
            ? "Update your face scan."
            : "Register your face for attendance.",
          icon: <Fingerprint size={22} />,
          color:
            "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
        };
      case "employment":
        return {
          title: "Employment Info",
          desc: "View your current professional placement.",
          icon: <Briefcase size={22} />,
          color:
            "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
        };
      default:
        return { title: "", desc: "", icon: null, color: "" };
    }
  };

  const header = getHeaderInfo();

  const renderContent = () => {
    switch (type) {
      case "personal":
        return (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">
                Phone Number
              </label>
              <Input
                type="text"
                value={data?.employee?.phone}
                placeholder="0812..."
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">
                Current Address
              </label>
              <Input
                type="text"
                value={data?.employee?.address}
                placeholder="Street name..."
              />
            </div>
          </div>
        );

      case "password":
        return (
          <PasswordUpdate
            formData={formData}
            onChange={(newData) => setFormData(newData)}
          />
        );

      case "biometric":
        return (
          <BiometricCapture
            onCapture={(image) => onSubmit({ image })}
            isLoading={isLoading}
          />
        );

      case "employment":
        return (
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/30">
            <Info
              size={18}
              className="text-amber-600 dark:text-amber-500 mt-0.5 shrink-0"
            />
            <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed font-medium">
              Data pekerjaan hanya dapat diubah oleh divisi HR atau
              Administrator. Silakan hubungi tim terkait jika terdapat kesalahan
              data.
            </p>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className={`p-2 rounded-lg ${header.color}`}>
              {header.icon}
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
              {header.title}
            </h4>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-12">
            {header.desc}
          </p>
        </div>

        {/* KONDISI 1: BIOMETRIC (Tanpa Form Induk & Tanpa Footer Modal) */}
        {type === "biometric" ? (
          <div className="min-h-25">
            <BiometricCapture
              onCapture={handleBiometricSubmit}
              isLoading={loading}
            />
            <div className="mt-4 flex justify-center">
              <button
                onClick={onClose}
                className="text-xs text-gray-400 hover:text-gray-600 transition"
              >
                Cancel and Close
              </button>
            </div>
          </div>
        ) : (
          /* KONDISI 2: PASSWORD / PERSONAL (Menggunakan Form Induk & Footer Modal) */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="min-h-25">{renderContent()}</div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              {type !== "employment" && (
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
