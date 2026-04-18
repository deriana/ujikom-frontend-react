import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { LucideIcon } from "lucide-react";
import { GlobalModalSkeleton } from "@/components/skeleton/ModalSkeleton";

interface CrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  description?: string;
  icon: LucideIcon;
  iconColorClass?: string;
  isEdit?: boolean;
  isLoading?: boolean;
  isInitialLoading?: boolean;
  children: React.ReactNode;
  maxWidth?: "max-w-lg" | "max-w-xl" | "max-w-2xl" | "max-w-3xl" | "max-w-4xl";
  submitLabel?: string;
  skeletonProps?: {
    inputsCount?: number;
    hasDateRange?: boolean;
  };
}

export default function CrudModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  icon: Icon,
  iconColorClass = "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  isEdit = false,
  isLoading = false,
  isInitialLoading = false,
  children,
  maxWidth = "max-w-2xl",
  submitLabel,
  skeletonProps,
}: CrudModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={`${maxWidth} m-4 p-0`}>
      <div className="w-full flex flex-col max-h-[90vh] rounded-3xl md:rounded-4xl bg-white dark:bg-[#0B0F1A] shadow-2xl border border-gray-100 dark:border-gray-800/50">
        {isInitialLoading ? (
          <div className="p-8">
            <GlobalModalSkeleton {...skeletonProps} />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="shrink-0 relative px-6 pt-6 md:px-8 md:pt-8 pb-2">
              <div className="flex items-center gap-4 mb-1">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconColorClass}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                    {title}
                  </h4>
                  {description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
              className="flex flex-col flex-1 min-h-0"
            >
              {/* Scrollable area */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-8 pt-2 pb-4">
                <div className="space-y-5">
                  {children}
                </div>
              </div>

              {/* Actions */}
              <div className="shrink-0 flex flex-col-reverse md:flex-row justify-end gap-3 px-6 pb-6 md:px-8 md:pb-8 pt-4 border-t border-gray-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 md:py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 md:py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  {isLoading ? "Saving..." : submitLabel || (isEdit ? "Update" : "Create")}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
