import { Modal } from "@/components/ui/modal";
import { Zap } from "lucide-react";

interface ConfirmationModalInventoryProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isUsing: boolean;
}

export default function ConfirmationModalInventory({
  isOpen,
  onClose,
  onConfirm,
  isUsing,
}: ConfirmationModalInventoryProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm m-4">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap size={40} className="text-indigo-600 dark:text-indigo-400" fill="currentColor" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Use this item?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Once activated, this item will be marked as used and its benefits will be applied to your account.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={onConfirm}
                disabled={isUsing}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50"
              >
                {isUsing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Yes, Activate Now"
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isUsing}
                className="w-full py-4 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
  );
}
