import { useCallback, useState } from "react";
import { EarlyLeaveInput, EarlyLeaveAttachment } from "@/types"; 
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { useDropzone } from "react-dropzone";
import {
  FileText,
  ClipboardCheck,
  UploadCloud,
  X,
  UserCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Select from "@/components/form/Select";
import { useGetEmployeeForInput } from "@/hooks/useUser";
import { GlobalModalSkeleton } from "@/components/skeleton/ModalSkeleton";
import { useEmployeeOptions } from "@/hooks/useEmployeeInput";

interface EarlyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  earlyLeaveData: EarlyLeaveInput;
  setEarlyLeaveData: (data: EarlyLeaveInput) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  isUserAdminOrHR?: boolean;
}

export default function EarlyLeaveModal({
  isOpen,
  onClose,
  earlyLeaveData,
  setEarlyLeaveData,
  onSubmit,
  isLoading = false,
  isUserAdminOrHR = false,
}: EarlyLeaveModalProps) {
  const isEdit = !!earlyLeaveData.uuid;
  const [showEmployeeSelect, setShowEmployeeSelect] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setEarlyLeaveData({ ...earlyLeaveData, attachment: acceptedFiles[0] });
      }
    },
    [earlyLeaveData, setEarlyLeaveData],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".webp"],
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  const removeFile = () => setEarlyLeaveData({ ...earlyLeaveData, attachment: null });

  const { employees, isLoading: loadingEmployees } = useEmployeeOptions()

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl transition-colors duration-200">
        {loadingEmployees ? (
          <GlobalModalSkeleton inputsCount={isUserAdminOrHR ? 3 : 2} />
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                  <ClipboardCheck size={24} />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEdit ? "Update Early Leave" : "New Early Leave Request"}
                </h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                Please provide a valid reason for leaving the office before work hours end.
              </p>
            </div>

            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              <div className="custom-scrollbar max-h-[65vh] overflow-y-auto px-1 space-y-6">
                
                {/* Dropdown Employee - Hanya untuk Admin/HR */}
                {isUserAdminOrHR && (
                  <div className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowEmployeeSelect(!showEmployeeSelect)}
                      className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-800/60"
                    >
                      <div className="flex items-center gap-2">
                        <UserCircle size={18} className="text-gray-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {earlyLeaveData.employee_nik 
                            ? `Employee: ${earlyLeaveData.employee_nik}` 
                            : "Select Employee (Admin/HR Only)"}
                        </span>
                      </div>
                      {showEmployeeSelect ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {showEmployeeSelect && (
                      <div className="px-5 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">
                          Choose Target Employee
                          {isEdit && (
                            <span className="ml-1 lowercase font-normal opacity-70 italic">
                              (cannot be changed)
                            </span>
                          )}
                        </label>
                        <Select
                          options={employees.map((emp) => ({
                            value: emp.nik,
                            label: `${emp.nik} - ${emp.name}`,
                          }))}
                          placeholder="Choose an employee..."
                          value={earlyLeaveData.employee_nik || ""}
                          onChange={(val) =>
                            setEarlyLeaveData({
                              ...earlyLeaveData,
                              employee_nik: val,
                            })
                          }
                          disabled={isEdit}
                        />
                      </div>
                    )}
                   </div>
                )}

                {/* Reason Input */}
                <div className="space-y-2 px-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <FileText size={14} /> Reason for Early Leave
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={earlyLeaveData.reason}
                    onChange={(e) =>
                      setEarlyLeaveData({ ...earlyLeaveData, reason: e.target.value })
                    }
                    placeholder="Example: Feeling unwell, urgent family matter, etc..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
                  />
                </div>

                {/* Dropzone Attachment */}
                <div className="space-y-2 px-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Supporting Document (Optional)
                  </label>

                  {!earlyLeaveData.attachment ? (
                    <div
                      {...getRootProps()}
                      className={`group border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isDragActive
                          ? "border-amber-500 bg-amber-50/50"
                          : "border-gray-200 dark:border-gray-800 hover:border-amber-400 bg-gray-50/50 dark:bg-gray-800/20"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <UploadCloud className="text-amber-500 mb-2" size={32} />
                      <p className="text-sm font-semibold dark:text-white">
                        Click or drag file
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF (Max 10MB)
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="text-amber-600 shrink-0" size={20} />
                        <div className="flex flex-col truncate">
                          <span className="text-sm font-medium dark:text-white truncate">
                            {earlyLeaveData.attachment instanceof File
                              ? earlyLeaveData.attachment.name
                              : (earlyLeaveData.attachment as EarlyLeaveAttachment).filename}
                          </span>
                          {/* View existing file link */}
                          {!(earlyLeaveData.attachment instanceof File) &&
                            (earlyLeaveData.attachment as EarlyLeaveAttachment).download_url && (
                              <a
                                href={(earlyLeaveData.attachment as EarlyLeaveAttachment).download_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-amber-600 hover:underline font-bold uppercase tracking-tighter"
                              >
                                View current attachment
                              </a>
                            )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-full transition-colors shrink-0"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-2.5 rounded-xl shadow-lg bg-amber-600 hover:bg-amber-700 text-white border-none"
                >
                  {isLoading ? "Processing..." : isEdit ? "Update Request" : "Submit Request"}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}