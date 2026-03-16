import { Modal } from "@/components/ui/modal";
import Badge from "@/components/ui/badge/Badge";
import UserProfile from "@/components/UserProfile"; // Sesuaikan path-nya
import {
  Clock,
  User,
  Calendar,
  Info,
  Hash,
  MapPin,
  Image as ImageIcon,
  ExternalLink,
  FileCheck2,
  Paperclip,
  Timer,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { useDetailAttendance } from "@/hooks/useAttendance";
import { APPROVAL_STATS } from "@/constants/Approval";
import { downloadAttachment } from "@/api/attendanceCorrection.api";
import { useState } from "react";
import toast from "react-hot-toast";

interface AttendanceShowModalProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const CorrectionStatusBadge = ({ status }: { status: number }) => {
  const config: Record<number, any> = {
    [APPROVAL_STATS.PENDING]: {
      label: "Correction Pending",
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: <Timer size={14} />,
    },
    [APPROVAL_STATS.APPROVED]: {
      label: "Correction Approved",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 size={14} />,
    },
    [APPROVAL_STATS.REJECTED]: {
      label: "Correction Rejected",
      color: "bg-rose-100 text-rose-700 border-rose-200",
      icon: <XCircle size={14} />,
    },
  };
  const current = config[status] || config[0];
  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${current.color}`}
    >
      {current.icon} {current.label}
    </span>
  );
};

const AttendanceModalSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-gray-100 dark:border-gray-800 pb-8">
      <div className="flex items-center gap-5 w-full md:w-auto">
        <div className="w-18 h-18 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800/50 rounded-md" />
        </div>
      </div>
      <div className="hidden md:block space-y-2">
        <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800/50 rounded ml-auto" />
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded ml-auto" />
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 space-y-6">
        <div className="h-32 w-full bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800" />
          <div className="h-24 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800" />
        </div>
        <div className="space-y-3">
          <div className="h-12 w-full bg-gray-50 dark:bg-gray-800/20 rounded-xl" />
          <div className="h-12 w-full bg-gray-50 dark:bg-gray-800/20 rounded-xl" />
        </div>
      </div>
      <div className="lg:col-span-5 space-y-6">
        <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800/50 rounded" />
        <div className="space-y-4">
          <div className="aspect-video w-full bg-gray-100 dark:bg-gray-800 rounded-2xl" />
          <div className="aspect-video w-full bg-gray-100 dark:bg-gray-800 rounded-2xl" />
        </div>
      </div>
    </div>
    <div className="mt-10">
      <div className="h-14 w-full bg-gray-900 dark:bg-white/10 rounded-2xl" />
    </div>
  </div>
);

export default function AttendanceShowModal({
  id,
  isOpen,
  onClose,
}: AttendanceShowModalProps) {
  const {
    data: attendance,
    isLoading,
    isError,
    error,
  } = useDetailAttendance(id as number);
  
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

  const openInMaps = (lat: string, lng: string) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  if (!id) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl w-full m-4">
      <div className="relative w-full rounded-3xl bg-white p-6 md:p-10 dark:bg-gray-900 shadow-2xl overflow-y-auto max-h-[90vh]">
        {isLoading ? (
          <AttendanceModalSkeleton />
        ) : (
          <>
            {/* Header with Profile Photo */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-gray-100 dark:border-gray-800 pb-8">
              <div className="flex items-center gap-5 w-full md:w-auto">
                {attendance && (
                  <UserProfile
                    src={attendance.employee.profile_photo ?? undefined}
                    alt={attendance.employee.name ?? "-"}
                    size={72}
                    className="ring-4 ring-gray-50 dark:ring-gray-800 shadow-md"
                  />
                )}
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                      {attendance?.employee.name || "-"}
                    </h4>
                    {attendance && (
                      <Badge
                        size="md"
                        variant="light"
                        color={
                          attendance.status?.toLowerCase() === "present"
                            ? "success"
                            : "error"
                        }
                      >
                        {attendance.status?.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                    <Calendar size={16} /> {attendance?.date || "Date unknown"}{" "}
                    • <Info size={16} /> ID: #{id}
                  </p>
                </div>
              </div>

              <div className="text-right hidden md:block text-gray-400">
                <p className="text-xs font-bold uppercase tracking-widest">
                  Attendance Status
                </p>
                <p className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                  Verified
                </p>
              </div>
            </div>

            {/* Content */}
            {isError ? (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-center">
                {(error as Error)?.message}
              </div>
            ) : (
              attendance && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Details & Stats */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Employee Card */}
                    <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">
                        <User size={14} /> Profile Information
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            NIK
                          </p>
                          <p className="text-gray-900 dark:text-white font-bold">
                            {attendance.employee.nik}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Email
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium truncate">
                            {attendance.employee.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Correction Info Section */}
                    {attendance.correction && (
                      <div className="p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30 bg-amber-50/20 dark:bg-amber-900/10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                            <FileCheck2 size={14} /> Correction Request
                          </div>
                          <CorrectionStatusBadge
                            status={attendance.correction.status}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-1">
                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                              Requested Clock In
                            </p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {attendance.correction.requested_times.clock_in ||
                                "--:--"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                              Requested Clock Out
                            </p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {attendance.correction.requested_times
                                .clock_out || "--:--"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[10px] text-gray-500 uppercase font-bold">
                            Reason
                          </p>
                          <p className="text-xs text-gray-700 dark:text-gray-300 italic bg-white/50 dark:bg-gray-800/50 p-3 rounded-xl border border-amber-100/50 dark:border-amber-900/20">
                            "{attendance.correction.reason}"
                          </p>
                        </div>

                        {attendance.correction.status !==
                          APPROVAL_STATS.PENDING &&
                          attendance.correction.approval.note && (
                            <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl border-l-4 border-amber-500">
                              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                                Approver Note
                              </p>
                              <p className="text-xs text-gray-700 dark:text-gray-300 italic">
                                "{attendance.correction.approval.note}"
                              </p>
                            </div>
                          )}

                        {attendance.correction.attachment?.exists && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDownload(
                                attendance.correction!.attachment!.filename,
                              )
                            }
                            disabled={isDownloading}
                            className="mt-4 flex items-center gap-1 text-sm text-indigo-600 font-medium hover:underline disabled:text-gray-400"
                          >
                            {isDownloading ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Paperclip size={14} />
                            )}
                            <span className="truncate max-w-25">
                              Attachment
                            </span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Time Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm transition-hover hover:border-indigo-200">
                        <div className="flex items-center gap-2 text-gray-500 mb-2 text-xs font-bold uppercase">
                          <Clock size={14} className="text-emerald-500" />{" "}
                          Working Hours
                        </div>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                          {attendance.work_minutes ?? 0}{" "}
                          <span className="text-sm font-normal text-gray-500">
                            mins
                          </span>
                        </p>
                        {(attendance.overtime_minutes ?? 0) > 0 && (
                          <span className="text-[11px] bg-orange-100 dark:bg-orange-900/30 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                            +{attendance.overtime_minutes} Overtime
                          </span>
                        )}
                      </div>

                      <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex items-center gap-2 text-gray-500 mb-2 text-xs font-bold uppercase">
                          <Hash size={14} className="text-red-500" /> Late /
                          Early
                        </div>
                        <div className="flex flex-col">
                          <p
                            className={`text-2xl font-black ${(attendance.late_minutes ?? 0) > 0 ? "text-red-600" : "text-gray-900 dark:text-white"}`}
                          >
                            {attendance.late_minutes ?? 0}{" "}
                            <span className="text-sm font-normal text-gray-500">
                              min
                            </span>
                          </p>
                          {(attendance.early_leave_minutes ?? 0) > 0 && (
                            <span className="text-[11px] text-amber-600 font-bold">
                              Early Leave: {attendance.early_leave_minutes}m
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Maps Location Info */}
                    <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                        <MapPin size={14} /> Tracking Maps
                      </div>
                      <div className="space-y-3">
                        <button
                          onClick={() =>
                            openInMaps(
                              String(attendance.location_in.latitude),
                              String(attendance.location_in.longitude),
                            )
                          }
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group"
                        >
                          <span className="text-sm font-semibold dark:text-gray-300">
                            Clock In Location
                          </span>
                          <div className="flex items-center gap-2 text-blue-600">
                            <span className="text-[10px] font-mono">
                              View on Maps
                            </span>
                            <ExternalLink size={14} />
                          </div>
                        </button>

                        <button
                          onClick={() =>
                            openInMaps(
                              String(attendance.location_out.latitude),
                              String(attendance.location_out.longitude),
                            )
                          }
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition group"
                        >
                          <span className="text-sm font-semibold dark:text-gray-300">
                            Clock Out Location
                          </span>
                          <div className="flex items-center gap-2 text-emerald-600">
                            <span className="text-[10px] font-mono">
                              View on Maps
                            </span>
                            <ExternalLink size={14} />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Photos */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                      <ImageIcon size={14} /> Evidence Photos
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Clock In Photo */}
                      <div className="group relative">
                        <p className="text-[10px] font-bold uppercase text-gray-400 mb-2 ml-1">
                          Clock In Photo
                        </p>
                        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-transparent group-hover:border-indigo-500 transition-all shadow-md">
                          {attendance.clock_in_photo ? (
                            <img
                              src={attendance.clock_in_photo}
                              alt="Clock In"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                              No Image Available
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Clock Out Photo */}
                      <div className="group relative">
                        <p className="text-[10px] font-bold uppercase text-gray-400 mb-2 ml-1">
                          Clock Out Photo
                        </p>
                        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-transparent group-hover:border-emerald-500 transition-all shadow-md">
                          {attendance.clock_out_photo ? (
                            <img
                              src={attendance.clock_out_photo}
                              alt="Clock Out"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                              No Image Available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Footer Actions */}
            <div className="mt-10">
              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg active:scale-[0.98]"
              >
                Done & Close
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
