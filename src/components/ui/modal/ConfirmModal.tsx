import React, { useState, useEffect } from "react";
import { Modal } from ".";
import Button from "@/components/ui/button/Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note?: string) => void; 
  title?: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger" | "success" | "info" | "warning";
  isLoading?: boolean;
  showNote?: boolean; 
  dataName?: string;  
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading = false,
  showNote = false,
  dataName,
}) => {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!isOpen) setNote("");
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(showNote ? note : undefined);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-100 m-4">
      <div className="rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-7">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h4>
        
        <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {message ? (
            message
          ) : (
            <p>
              Are you sure you want to proceed with <strong>{dataName || "this item"}</strong>?
            </p>
          )}
        </div>

        {showNote && (
          <div className="mb-6 text-left">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Notes / Reason (Optional)
            </label>
            <textarea
              className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none transition"
              rows={3}
              placeholder="Add a reason for this decision..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isLoading}
            />
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row items-center gap-3 mt-6 lg:justify-end">
          <Button 
            onClick={onClose} 
            size="sm" 
            variant="outline" 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            variant={variant}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;