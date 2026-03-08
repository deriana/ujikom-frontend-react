import { useCallback } from "react";
import { LeaveInput } from "@/types/leave.types";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { useDropzone } from "react-dropzone";
import {
  FileText,
  ClipboardCheck,
  UploadCloud,
  X,
  UserCircle,
  Briefcase,
} from "lucide-react";
import DatePicker from "@/components/form/date-picker";
import Select from "@/components/form/Select";
import { useGetEmployeeForInput } from "@/hooks/useUser";
import { useLeaveTypes } from "@/hooks/useLeaveType";
import { GlobalModalSkeleton } from "@/components/skeleton/ModalSkeleton";

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveData: LeaveInput;
  setLeaveData: (data: LeaveInput) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  isUserAdminOrHR?: boolean;
}

export default function LeaveModal({
  isOpen,
  onClose,
  leaveData,
  setLeaveData,
  onSubmit,
  isLoading = false,
  isUserAdminOrHR = false,
}: LeaveModalProps) {
  const isEdit = !!leaveData.uuid;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setLeaveData({ ...leaveData, attachment: acceptedFiles[0] });
      }
    },
    [leaveData, setLeaveData],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".webp"],
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  const removeFile = () => setLeaveData({ ...leaveData, attachment: null });

  const { data: employees = [], isLoading: loadingEmployees } = (
    useGetEmployeeForInput as any
  )({
    enabled: isOpen,
  });
  const { data: leaveTypes = [], isLoading: loadingLeaveTypes } = (
    useLeaveTypes as any
  )({
    enabled: isOpen,
  });

  const isInitialLoading = loadingEmployees || loadingLeaveTypes;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl transition-colors duration-200">
        {isInitialLoading ? (
          <GlobalModalSkeleton inputsCount={3} hasDateRange={true} />
        ) : (
          <>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-brand-100 dark:bg-brand-900/30 rounded-xl text-brand-600 dark:text-brand-400">
              <ClipboardCheck size={24} />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? "Update Leave Request" : "New Leave Request"}
            </h4>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            Fill in the details below to submit the leave application.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              {/* Dropdown Employee - Hanya untuk Admin/HR */}
              {isUserAdminOrHR && (
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <UserCircle size={14} /> Select Employee{" "}
                    {isEdit && (
                      <span className="text-[10px] lowercase font-normal opacity-70">
                        (cannot be changed)
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <Select
                      options={employees.map((emp: { nik: string; name: string }) => ({
                        value: emp.nik,
                        label: `${emp.nik} - ${emp.name}`,
                      }))}
                      placeholder="Choose an employee..."
                      value={leaveData.employee_nik || ""}
                      onChange={(val) =>
                        setLeaveData({
                          ...leaveData,
                          employee_nik: val,
                        })
                      }
                      disabled={isEdit}
                    />
                  </div>
                </div>
              )}

              {/* Dropdown Leave Type */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Briefcase size={14} /> Leave Type
                  {isEdit && (
                    <span className="text-[10px] lowercase font-normal opacity-70">
                      (cannot be changed)
                    </span>
                  )}
                </label>

                <Select
                  options={leaveTypes.map((type: { uuid: string; name: string }) => ({
                    value: type.uuid,
                    label: type.name,
                  }))}
                  placeholder="Select type of leave..."
                  value={leaveData.leave_type_uuid}
                  onChange={(val) =>
                    setLeaveData({
                      ...leaveData,
                      leave_type_uuid: val,
                    })
                  }
                  disabled={isEdit}
                />
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Start Date
                </label>
                <DatePicker
                  id="leave-start-date"
                  value={leaveData.date_start}
                  onChange={(_, dateStr) =>
                    setLeaveData({ ...leaveData, date_start: dateStr })
                  }
                  placeholder="Select start date"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  End Date
                </label>
                <DatePicker
                  id="leave-end-date"
                  value={leaveData.date_end}
                  onChange={(_, dateStr) =>
                    setLeaveData({ ...leaveData, date_end: dateStr })
                  }
                  placeholder="Select end date"
                />
              </div>

              {/* Half Day Checkbox */}
              <div className="md:col-span-2 flex items-center gap-6 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={leaveData.is_half_day}
                    onChange={(e) =>
                      setLeaveData({
                        ...leaveData,
                        is_half_day: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-500 transition-colors">
                    Apply as Half Day
                  </span>
                </label>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2 px-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <FileText size={14} /> Reason
              </label>
              <textarea
                rows={3}
                value={leaveData.reason}
                onChange={(e) =>
                  setLeaveData({ ...leaveData, reason: e.target.value })
                }
                placeholder="Reason for leave..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
              />
            </div>
            {/* Dropzone */}
            <div className="space-y-2 px-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Supporting Document
              </label>

              {!leaveData.attachment ? (
                <div
                  {...getRootProps()}
                  className={`group border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isDragActive
                      ? "border-brand-500 bg-brand-50/50"
                      : "border-gray-200 dark:border-gray-800 hover:border-brand-400 bg-gray-50/50 dark:bg-gray-800/20"
                  }`}
                >
                  <input {...getInputProps()} />
                  <UploadCloud className="text-brand-500 mb-2" size={32} />
                  <p className="text-sm font-semibold dark:text-white">
                    Click or drag file
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF (Max 10MB)
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-brand-50/50 dark:bg-brand-500/5 border border-brand-200 dark:border-brand-500/20 rounded-2xl">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="text-brand-600 shrink-0" size={20} />
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-medium dark:text-white truncate">
                        {leaveData.attachment instanceof File
                          ? leaveData.attachment.name
                          : (leaveData.attachment as any).filename}
                      </span>
                      {/* Tambahkan link download jika ini file lama dari database */}
                      {!(leaveData.attachment instanceof File) &&
                        (leaveData.attachment as any).download_url && (
                          <a
                            href={(leaveData.attachment as any).download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-brand-600 hover:underline font-bold uppercase tracking-tighter"
                          >
                            View current file
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

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 rounded-xl shadow-lg shadow-brand-200 dark:shadow-none"
            >
              {isLoading ? "Processing..." : isEdit ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
          </>
        )}
      </div>
    </Modal>
  );
}
