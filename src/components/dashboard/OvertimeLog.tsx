import { APPROVAL_LABEL, APPROVAL_STATS } from "@/constants/Approval";
import { OvertimeLog as IOvertimeLog } from "@/types";
import { Timer, Clock, AlertCircle } from "lucide-react";

export const OvertimeLog = ({ overtimeLogs }: { overtimeLogs: IOvertimeLog[] }) => {
  
  // Fungsi helper untuk menentukan warna status berdasarkan integer value
  const getStatusColor = (status: number | string) => {
    const statusInt = Number(status);
    switch (statusInt) {
      case APPROVAL_STATS.APPROVED:
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case APPROVAL_STATS.REJECTED:
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
      default:
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 transition-all">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 p-1.5 rounded-lg dark:bg-indigo-900/30">
            <Timer size={18} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Log Lembur</h3>
        </div>
      </div>

      <div className="space-y-5">
        {overtimeLogs && overtimeLogs.length > 0 ? (
          overtimeLogs.map((item, index) => (
            <div 
              key={`${item.date}-${index}`} 
              className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0 dark:border-slate-800/50"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                  {item.reason}
                </span>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="text-slate-400" />
                    <span>{item.date}</span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    {item.duration}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide uppercase ${getStatusColor(item.status)}`}>
                  {APPROVAL_LABEL[Number(item.status)] || "Unknown"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
            <AlertCircle className="text-slate-300 mb-2" size={24} />
            <p className="text-xs text-slate-400 italic">Belum ada aktivitas lembur tercatat.</p>
          </div>
        )}
      </div>
    </div>
  );
};