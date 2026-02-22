import { APPROVAL_LABEL, APPROVAL_STATS } from "@/constants/Approval";
import { LeaveLog as ILeaveLog} from "@/types";
import { Coffee, XCircle, Clock, AlertCircle, HelpCircle } from "lucide-react";

export const ActivityLog = ({ leaveLogs }: { leaveLogs: ILeaveLog[] }) => {
  // Helper untuk menentukan visual berdasarkan status (integer)
  const getStatusConfig = (status: number | string) => {
    const s = Number(status);
    switch (s) {
      case APPROVAL_STATS.APPROVED:
        return {
          color: "text-emerald-500",
          bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
          badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
          icon: Coffee,
        };
      case APPROVAL_STATS.REJECTED:
        return {
          color: "text-rose-500",
          bgColor: "bg-rose-50 dark:bg-rose-500/10",
          badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
          icon: XCircle,
        };
      default: // Pending
        return {
          color: "text-amber-500",
          bgColor: "bg-amber-50 dark:bg-amber-500/10",
          badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
          icon: HelpCircle,
        };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Riwayat Cuti</h3>
          <p className="text-sm text-slate-500">Log pengajuan cuti terbaru Anda</p>
        </div>
        <button className="text-sm font-medium text-blue-600 hover:underline">Lihat Semua</button>
      </div>

      <div className="space-y-6">
        {leaveLogs && leaveLogs.length > 0 ? (
          leaveLogs.map((item, idx) => {
            const config = getStatusConfig(item.status);
            const StatusIcon = config.icon;

            return (
              <div key={idx} className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bgColor} ${config.color}`}>
                  <StatusIcon size={20} />
                </div>
                
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {item.type}
                      </span>
                      <p className="text-xs text-slate-500 line-clamp-1 italic">
                        "{item.reason}"
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${config.badge}`}>
                      {APPROVAL_LABEL[Number(item.status)] || "Pending"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <Clock size={12} className="text-slate-400" />
                    <span className="font-medium">{item.date_range}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
            <AlertCircle size={32} className="mb-2 opacity-20" />
            <p className="text-sm italic">Belum ada riwayat cuti</p>
          </div>
        )}
      </div>
    </div>
  );
};