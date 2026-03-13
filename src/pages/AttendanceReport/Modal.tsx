import { useCallback } from "react";
import { AttendanceCorrectionInput, AttendanceCorrectionAttachment } from "@/types"; 
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { useDropzone } from "react-dropzone";
import {
  FileText,
  ClipboardCheck,
  UploadCloud,
  X,
  FileText as FileTextIcon,
} from "lucide-react";
import { GlobalModalSkeleton } from "@/components/skeleton/ModalSkeleton";
import TimePicker from "@/components/form/time-picker";

interface AttendanceCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceData: AttendanceCorrectionInput;
  setAttendanceData: (data: AttendanceCorrectionInput) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  originalDate?: string; 
}

export default function AttendanceCorrectionModal({
  isOpen,
  onClose,
  attendanceData,
  setAttendanceData,
  onSubmit,
  isLoading = false,
  originalDate,
}: AttendanceCorrectionModalProps) {
  const isEdit = !!attendanceData.uuid;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setAttendanceData({ ...attendanceData, attachment: acceptedFiles[0] });
      }
    },
    [attendanceData, setAttendanceData],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".webp"],
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  const removeFile = () => setAttendanceData({ ...attendanceData, attachment: null });

  // Parse time from "YYYY-MM-DD HH:mm:ss" or "HH:mm:ss" to "HH:mm"
  const formatTimeOnly = (timeString: string | null | undefined) => {
    if (!timeString) return "";
    return timeString.includes(" ") ? timeString.split(" ")[1].substring(0, 5) : timeString.substring(0, 5);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl transition-colors duration-200">
        {!attendanceData.attendance_id && !isEdit ? (
          <GlobalModalSkeleton inputsCount={3} />
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                  <ClipboardCheck size={24} />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEdit ? "Update Correction" : "Attendance Correction"}
                </h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                Requesting correction for attendance on <span className="font-bold text-gray-700 dark:text-gray-200">{originalDate || "selected date"}</span>.
              </p>
            </div>

            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              <div className="custom-scrollbar max-h-[65vh] px-1 space-y-6">
                
                {/* Time Correction Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TimePicker
                    label="Clock In Requested"
                    value={formatTimeOnly(attendanceData.clock_in_requested)}
                    onChange={(val: string) =>
                      setAttendanceData({ ...attendanceData, clock_in_requested: val })
                    }
                  />

                  <TimePicker
                    label="Clock Out Requested"
                    value={formatTimeOnly(attendanceData.clock_out_requested)}
                    onChange={(val: string) =>
                      setAttendanceData({ ...attendanceData, clock_out_requested: val })
                    }
                  />
                </div>

                {/* Reason Input */}
                <div className="space-y-2 px-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <FileText size={14} /> Reason for Correction
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={attendanceData.reason}
                    onChange={(e) =>
                      setAttendanceData({ ...attendanceData, reason: e.target.value })
                    }
                    placeholder="Describe why you need this correction (e.g., forgot to clock in, system error)..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  />
                </div>

                {/* Dropzone Attachment */}
                <div className="space-y-2 px-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Attachment / Proof (Optional)
                  </label>

                  {!attendanceData.attachment ? (
                    <div
                      {...getRootProps()}
                      className={`group border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isDragActive
                          ? "border-blue-500 bg-blue-50/50"
                          : "border-gray-200 dark:border-gray-800 hover:border-blue-400 bg-gray-50/50 dark:bg-gray-800/20"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <UploadCloud className="text-blue-500 mb-2" size={32} />
                      <p className="text-sm font-semibold dark:text-white">Click or drag proof of attendance</p>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF (Max 10MB)</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 rounded-2xl">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="text-blue-600 shrink-0" size={20} />
                        <div className="flex flex-col truncate">
                          <span className="text-sm font-medium dark:text-white truncate">
                            {attendanceData.attachment instanceof File
                              ? attendanceData.attachment.name
                              : (attendanceData.attachment as AttendanceCorrectionAttachment).filename}
                          </span>
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
                  className="px-8 py-2.5 rounded-xl shadow-lg bg-blue-600 hover:bg-blue-700 text-white border-none"
                >
                  {isLoading ? "Submitting..." : isEdit ? "Update Correction" : "Submit Correction"}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}