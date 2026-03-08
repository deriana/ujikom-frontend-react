import { useLeaveByUuid } from "@/hooks/useLeave";
import { Modal } from "@/components/ui/modal";
import {
  Calendar,
  User,
  Briefcase,
  Info,
  Clock,
  CheckCircle2,
  XCircle,
  Timer,
  FileText,
  Paperclip,
  Loader2,
} from "lucide-react";
import { ApprovalStatus } from "@/types";
import { useState } from "react";
import { downloadAttachment } from "@/api/leave.api";
import toast from "react-hot-toast";
import { formatDateID } from "@/utils/date";

interface LeaveShowModalProps {
  uuid: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const StatusBadge = ({ status }: { status: ApprovalStatus }) => {
  const config = {
    0: {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <Timer size={14} />,
    },
    1: {
      label: "Approved",
      color: "bg-green-100 text-green-700 border-green-200",
      icon: <CheckCircle2 size={14} />,
    },
    2: {
      label: "Rejected",
      color: "bg-red-100 text-red-700 border-red-200",
      icon: <XCircle size={14} />,
    },
  };

  const { label, color, icon } = config[status];
  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${color}`}
    >
      {icon} {label}
    </span>
  );
};

const LeaveShowSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="flex justify-between items-start border-b border-gray-50 dark:border-gray-800 pb-6">
      <div className="space-y-3">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="h-4 w-64 bg-gray-100 dark:bg-gray-800/50 rounded-md" />
      </div>
      <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800" />
      ))}
    </div>
    <div className="space-y-3">
      <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800/50 rounded" />
      <div className="h-24 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800" />
    </div>
    <div className="space-y-4">
      <div className="h-4 w-40 bg-gray-100 dark:bg-gray-800/50 rounded" />
      <div className="h-32 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700" />
    </div>
  </div>
);

export default function LeaveShowModal({
  uuid,
  isOpen,
  onClose,
}: LeaveShowModalProps) {
  const { data: leave, isLoading, isError, error } = useLeaveByUuid(uuid || "");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (filename: string) => {
    try {
      setIsDownloading(true);
      await downloadAttachment(filename);
    } catch (error) {
      console.error("Download failed", error);
      toast.error("Failed to download file.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!uuid) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {isLoading ? "Loading..." : leave?.leave_type.name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <User size={14} /> {leave?.employee.name} • {leave?.employee.nik}
            </p>
          </div>
          {leave && <StatusBadge status={leave.approval_status} />}
        </div>

        {isLoading ? (
          <LeaveShowSkeleton />
        ) : isError ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center">
            {(error as Error).message}
          </div>
        ) : (
          leave && (
            <div className="space-y-6">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Duration
                  </p>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
                    <Calendar size={16} className="text-blue-500" />
                    <span className="text-sm">
                      {formatDateID(leave.date_start)} - {formatDateID(leave.date_end)}
                    </span>
                  </div>
                  {leave.is_half_day && (
                    <span className="text-[10px] text-orange-500 font-bold mt-1 block">
                      HALF DAY
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Leave Balance
                  </p>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {leave.leave_balance?.remaining_days ?? 0}{" "}
                    <span className="text-xs font-normal text-gray-500">
                      days left
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Attachment
                  </p>
                  {leave.attachment && leave.attachment.exists ? (
                    <button
                      type="button"
                      onClick={() => handleDownload(leave.attachment!.filename)}
                      disabled={isDownloading}
                      className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:underline disabled:text-gray-400"
                    >
                      {isDownloading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Paperclip size={14} />
                      )}
                      <span className="truncate max-w-25">
                        Attacment
                      </span>
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400 italic">No file</span>
                  )}
                </div>
              </div>

              {/* Reason Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                  <FileText size={14} /> Reason
                </label>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">
                  "{leave.reason}"
                </div>
              </div>

              {/* Approval Timeline */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                  <Briefcase size={14} /> Approval Progress
                </label>
                <div className="space-y-3">
                  {leave.approvals.map((app, idx) => (
                    <div key={app.uuid} className="flex gap-4 relative">
                      {/* Line connector */}
                      {idx !== leave.approvals.length - 1 && (
                        <div className="absolute left-3.75 top-8 -bottom-3 w-0.5 bg-gray-100 dark:bg-gray-800" />
                      )}

                      <div
                        className={`z-10 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 ${
                          app.status === 1
                            ? "bg-green-500"
                            : app.status === 2
                              ? "bg-red-500"
                              : "bg-gray-300"
                        }`}
                      >
                        {app.status === 1 ? (
                          <CheckCircle2 size={14} className="text-white" />
                        ) : (
                          <Clock size={14} className="text-white" />
                        )}
                      </div>

                      <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-xl shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                              {app.approver.name}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase">
                              {app.approver.role} (Level {app.level})
                            </p>
                          </div>
                          <span className="text-[10px] text-gray-400 italic">
                            {app.approved_at || "Pending"}
                          </span>
                        </div>
                        {app.note && (
                          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 border-t pt-2 border-gray-50 dark:border-gray-700 italic">
                            "{app.note}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Approver Alert */}
              {leave.approval_status === 0 && leave.next_approver && (
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                  <Info size={14} />
                  <span>
                    Currently waiting for:{" "}
                    <strong>{leave.next_approver}</strong>
                  </span>
                </div>
              )}
            </div>
          )
        )}

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:opacity-90 transition shadow-lg"
          >
            Close Details
          </button>
        </div>
      </div>
    </Modal>
  );
}
