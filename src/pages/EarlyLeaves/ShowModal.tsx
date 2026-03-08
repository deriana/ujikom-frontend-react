import { useEarlyLeaveByUuid } from "@/hooks/useEarlyLeave"; 
import { Modal } from "@/components/ui/modal";
import {
  Calendar,
  User,
  Info,
  Clock,
  CheckCircle2,
  XCircle,
  Timer,
  FileText,
  Paperclip,
  Loader2,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import api from "@/api/axios";
import toast from "react-hot-toast";
import { APPROVAL_STATS } from "@/constants/Approval";
import { formatDateID } from "@/utils/date";

export const downloadEarlyLeaveAttachment = async (filename: string) => {
  const response = await api.get(`/early_leaves/download-attachment/${filename}`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

interface EarlyLeaveShowModalProps {
  uuid: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const StatusBadge = ({ status }: { status: number | string }) => {
  const config: Record<string | number, any> = {
    0: {
      label: "Pending",
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: <Timer size={14} />,
    },
    1: {
      label: "Approved",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 size={14} />,
    },
    2: {
      label: "Rejected",
      color: "bg-rose-100 text-rose-700 border-rose-200",
      icon: <XCircle size={14} />,
    },
  };

  const current = config[status] || config[0];
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${current.color}`}>
      {current.icon} {current.label}
    </span>
  );
};

const EarlyLeaveShowSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="flex justify-between items-start border-b border-gray-50 dark:border-gray-800 pb-6">
      <div className="space-y-3">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="h-4 w-64 bg-gray-100 dark:bg-gray-800/50 rounded-md" />
      </div>
      <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-24 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800" />
      <div className="h-24 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800" />
    </div>
    <div className="space-y-3">
      <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800/50 rounded" />
      <div className="h-24 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800" />
    </div>
    <div className="pt-4 border-t border-gray-50 dark:border-gray-800 space-y-4">
      <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800/50 rounded" />
      <div className="h-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700" />
    </div>
  </div>
);

export default function EarlyLeaveShowModal({
  uuid,
  isOpen,
  onClose,
}: EarlyLeaveShowModalProps) {
  const { data: detail, isLoading, isError, error } = useEarlyLeaveByUuid(uuid || "");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (filename: string) => {
    try {
      setIsDownloading(true);
      await downloadEarlyLeaveAttachment(filename);
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
        <div className="flex justify-between items-start mb-6 border-b border-gray-50 dark:border-gray-800 pb-6">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              Early Leave Detail
            </h4>
            <div className="flex flex-col gap-1 mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <User size={14} className="text-brand-500" /> 
                <span className="font-semibold">{detail?.employee.name}</span>
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-2">
                <Info size={12} /> NIK: {detail?.employee.nik}
              </p>
            </div>
          </div>
          {detail && <StatusBadge status={detail.status} />}
        </div>

        {isLoading ? (
          <EarlyLeaveShowSkeleton />
        ) : isError ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm border border-red-100">
            {(error as Error).message}
          </div>
        ) : (
          detail && (
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">
                    Departure Info
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                      <Calendar size={16} className="text-amber-500" />
                      <span className="text-sm">{formatDateID(detail.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold">
                      <Clock size={16} />
                      <span className="text-sm">{detail.minutes_early} Minutes Early</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Supporting Document
                  </p>
                  {detail.attachment && detail.attachment.exists ? (
                    <button
                      type="button"
                      onClick={() => handleDownload(detail.attachment!.filename)}
                      disabled={isDownloading}
                      className="flex items-center gap-2 text-sm text-brand-600 font-bold hover:underline disabled:text-gray-400 transition-all"
                    >
                      {isDownloading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Paperclip size={14} />
                      )}
                      <span className="truncate">Attachment</span>
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400 italic">No attachment provided</span>
                  )}
                </div>
              </div>

              {/* Reason Section */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 tracking-widest">
                  <FileText size={12} /> Reason
                </label>
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 text-sm leading-relaxed border border-gray-100 dark:border-gray-800 italic">
                  "{detail.reason}"
                </div>
              </div>

              {/* Approval Info Section */}
              <div className="pt-4 border-t border-gray-50 dark:border-gray-800">
                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 tracking-widest mb-4">
                  <UserCheck size={12} /> Approval Information
                </label>
                
                {detail.approval && detail.approval.approved_by_name ? (
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${Number(detail.status) === APPROVAL_STATS.APPROVED ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          {Number(detail.status) === APPROVAL_STATS.APPROVED ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {detail.approval.approved_by_name}
                          </p>
                          <p className="text-[10px] text-gray-500 uppercase font-medium">
                            Decision Maker
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {detail.approval.approved_at}
                      </span>
                    </div>
                    
                    {detail.approval.note && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-l-4 border-brand-500">
                        <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                          <span className="font-bold not-italic text-gray-400 mr-1">Note:</span> 
                          "{detail.approval.note}"
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30">
                    <Timer size={16} className="animate-pulse" />
                    <span className="text-xs font-medium">This request is currently waiting for approval.</span>
                  </div>
                )}
              </div>
            </div>
          )
        )}

        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold hover:opacity-90 transition-all shadow-xl active:scale-[0.98]"
          >
            Close Detail
          </button>
        </div>
      </div>
    </Modal>
  );
}