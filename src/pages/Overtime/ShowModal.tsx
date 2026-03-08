import { Modal } from "@/components/ui/modal";
import {
  Calendar,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Timer,
  FileText,
  UserCheck,
  History,
  Hash,
  Users,
} from "lucide-react";
import { APPROVAL_STATS } from "@/constants/Approval";
import { formatDateID } from "@/utils/date";
import { useOvertimeByUuid } from "@/hooks/useOvertime";

interface OvertimeShowModalProps {
  uuid: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const StatusBadge = ({ status, label }: { status: number; label: string }) => {
  const config: Record<number, any> = {
    [APPROVAL_STATS.PENDING]: {
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: <Timer size={14} />,
    },
    [APPROVAL_STATS.APPROVED]: {
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 size={14} />,
    },
    [APPROVAL_STATS.REJECTED]: {
      color: "bg-rose-100 text-rose-700 border-rose-200",
      icon: <XCircle size={14} />,
    },
  };

  const current = config[status] || config[APPROVAL_STATS.PENDING];
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${current.color}`}>
      {current.icon} {label}
    </span>
  );
};

const OvertimeShowSkeleton = () => (
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

export default function OvertimeShowModal({
  uuid,
  isOpen,
  onClose,
}: OvertimeShowModalProps) {
  const { data: detail, isLoading, isError, error } = useOvertimeByUuid(uuid || "");

  if (!uuid) return null;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 border-b border-gray-50 dark:border-gray-800 pb-6">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">Overtime Detail</h4>
            <div className="flex flex-col gap-1 mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <User size={14} className="text-amber-500" /> 
                <span className="font-semibold">{detail?.employee.name}</span>
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-2">
                <Hash size={12} /> {detail?.employee.nik} • <Users size={12} /> {detail?.employee.division} ({detail?.employee.team})
              </p>
            </div>
          </div>
          {detail && <StatusBadge status={detail.status} label={detail.status_label} />}
        </div>

        {isLoading ? (
          <OvertimeShowSkeleton />
        ) : isError ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm border border-red-100">
            {(error as Error).message}
          </div>
        ) : detail && (
          <div className="space-y-6">
            {/* Attendance & Duration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Work Date</p>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                  <Calendar size={16} className="text-amber-500" />
                  <span className="text-sm">{formatDateID(detail.attendance.date)}</span>
                </div>
                <div className="mt-2 flex gap-3 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={10}/> In: {detail.attendance.clock_in}</span>
                  <span className="flex items-center gap-1"><Clock size={10}/> Out: {detail.attendance.clock_out}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2">Total Overtime</p>
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold">
                  <History size={16} />
                  <span className="text-lg">{formatDuration(detail.duration_minutes)}</span>
                </div>
                <p className="text-[10px] text-amber-600/70 mt-1 font-medium italic">*Duration after checkout</p>
              </div>
            </div>

            {/* Overtime Reason */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 tracking-widest">
                <FileText size={12} /> Reason for Overtime
              </label>
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 text-sm leading-relaxed border border-gray-100 dark:border-gray-800">
                {detail.reason}
              </div>
            </div>

            {/* Approval Info */}
            <div className="pt-4 border-t border-gray-50 dark:border-gray-800">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 tracking-widest mb-4">
                <UserCheck size={12} /> Approval status
              </label>
              
              {detail.status !== APPROVAL_STATS.PENDING ? (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${detail.status === APPROVAL_STATS.APPROVED ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          {detail.status === APPROVAL_STATS.APPROVED ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {detail.approved_by?.name || 'System Auto-Process'}
                          </p>
                          <p className="text-[10px] text-gray-500 uppercase font-medium">Decision Maker</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {detail.approved_at}
                      </span>
                    </div>
                  </div>

                  {detail.note && (
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700">
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Approver's Note</p>
                       <p className="text-xs text-gray-600 dark:text-gray-400 italic">"{detail.note}"</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800/30">
                  <Timer size={16} className="animate-pulse" />
                  <span className="text-xs font-medium">Waiting for Supervisor/HR approval.</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold hover:opacity-90 transition-all shadow-xl active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}