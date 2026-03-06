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
  Loader2,
  UserCheck,
  Briefcase,
  MapPin,
  ArrowRightLeft,
  Coffee,
} from "lucide-react";
import { APPROVAL_STATS } from "@/constants/Approval";
import { formatDateID } from "@/utils/date";
import { useAttendanceRequestByUuid } from "@/hooks/useAttendanceRequest"; 

interface AttendanceRequestShowModalProps {
  uuid: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const StatusBadge = ({ status }: { status: number | string }) => {
  const config: Record<string | number, any> = {
    [APPROVAL_STATS.PENDING]: {
      label: "Pending",
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: <Timer size={14} />,
    },
    [APPROVAL_STATS.APPROVED]: {
      label: "Approved",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 size={14} />,
    },
    [APPROVAL_STATS.REJECTED]: {
      label: "Rejected",
      color: "bg-rose-100 text-rose-700 border-rose-200",
      icon: <XCircle size={14} />,
    },
  };

  const current = config[status] || config[APPROVAL_STATS.PENDING];
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${current.color}`}>
      {current.icon} {current.label}
    </span>
  );
};

export default function AttendanceRequestShowModal({
  uuid,
  isOpen,
  onClose,
}: AttendanceRequestShowModalProps) {
  const { data: detail, isLoading, isError, error } = useAttendanceRequestByUuid(uuid || "");

  if (!uuid) return null;

  const renderChangeDetails = () => {
    if (!detail?.change_details) return null;

    if (detail.change_details.type === 'shift') {
      const shift = detail.change_details;
      return (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1">
            <ArrowRightLeft size={12} /> Shift Change Detail
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">{shift.template_name}</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <Clock size={12} /> {shift.start_time} - {shift.end_time}
            </div>
            {shift.is_cross_day && (
              <span className="text-amber-600 font-medium">Cross Day</span>
            )}
          </div>
        </div>
      );
    }

    if (detail.change_details.type === 'work_schedule') {
      const schedule = detail.change_details;
      return (
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
          <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Briefcase size={12} /> Schedule Change Detail
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">{schedule.schedule_name}</p>
          <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1.5 capitalize">
              <MapPin size={12} /> Mode: {schedule.work_mode} 
              {schedule.requires_location && <span className="text-[10px] bg-purple-200 text-purple-700 px-1 rounded">GPS Req</span>}
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Clock size={12}/> Work: {schedule.times.work}</span>
              <span className="flex items-center gap-1"><Coffee size={12}/> Break: {schedule.times.break}</span>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 border-b border-gray-50 dark:border-gray-800 pb-6">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Request</h4>
            <div className="flex flex-col gap-1 mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <User size={14} className="text-brand-500" /> 
                <span className="font-semibold">{detail?.employee.name}</span>
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-2">
                <Briefcase size={12} /> {detail?.employee.position || 'No Position'} • NIK: {detail?.employee.nik}
              </p>
            </div>
          </div>
          {detail && <StatusBadge status={detail.status} />}
        </div>

        {isLoading ? (
          <div className="py-20 text-center animate-pulse text-gray-400 flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-brand-500" />
            Fetching request details...
          </div>
        ) : isError ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm border border-red-100">
            {(error as Error).message}
          </div>
        ) : detail && (
          <div className="space-y-6">
            {/* Primary Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Requested Date</p>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                  <Calendar size={16} className="text-brand-500" />
                  <span className="text-sm">
                    {formatDateID(detail.start_date)}
                    {detail.end_date && ` - ${formatDateID(detail.end_date)}`}
                  </span>
                </div>
              </div>
              {renderChangeDetails()}
            </div>

            {/* Note/Reason Section */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 tracking-widest">
                <FileText size={12} /> Employee Note
              </label>
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 text-sm leading-relaxed border border-gray-100 dark:border-gray-800 italic">
                {detail.note ? `"${detail.note}"` : "No note provided."}
              </div>
            </div>

            {/* Approval Info */}
            <div className="pt-4 border-t border-gray-50 dark:border-gray-800">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 tracking-widest mb-4">
                <UserCheck size={12} /> Approval status
              </label>
              
              {detail.approval_info.is_processed ? (
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${Number(detail.status) === APPROVAL_STATS.APPROVED ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {Number(detail.status) === APPROVAL_STATS.APPROVED ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {detail.approval_info.approver_name}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase font-medium">Decision Maker</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {detail.approval_info.processed_at}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30">
                  <Timer size={16} className="animate-pulse" />
                  <span className="text-xs font-medium">Waiting for HR/Manager review.</span>
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