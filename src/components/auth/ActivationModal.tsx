import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { MailCheck, Info, ShieldAlert } from "lucide-react";

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onResend: () => void;
  isLoading?: boolean;
}

export default function ActivationModal({
  isOpen,
  onClose,
  email,
  onResend,
  isLoading = false,
}: ActivationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
              <ShieldAlert size={22} />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
              Account Activation
            </h4>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-12">
            Your account is almost ready.
          </p>
        </div>

        <div className="space-y-6">
          {/* Main Message Box */}
          <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 text-center">
            <div className="inline-flex p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 mb-4">
              <MailCheck size={32} />
            </div>
            <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Verify your email
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              We've sent an activation link to <br />
              <strong className="text-gray-900 dark:text-white font-semibold">
                {email}
              </strong>
            </p>
          </div>

          {/* Info Box (Sesuai gaya referensi) */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
            <Info size={18} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              We've automatically sent a new link to your inbox. Didn't receive
              it? Please check your <strong>spam folder</strong>. The link is
              valid for 24 hours.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition order-2 sm:order-1"
            >
              Back to Login
            </button>
            <Button
              onClick={onResend}
              disabled={isLoading}
              className="order-1 sm:order-2"
            >
              {isLoading ? "Sending..." : "Resend Activation Link"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
