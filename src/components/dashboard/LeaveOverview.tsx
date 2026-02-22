import { LeaveSummary } from "@/types";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function LeaveOverviewCard({leaveSummary} : {leaveSummary?: LeaveSummary}) {
  const data = [
    {
      label: "Disetujui",
      value: leaveSummary?.disetujui || 0,
      sub: "Bulan ini",
      icon: <CheckCircle className="size-4 text-emerald-500" />,
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: "Ditolak",
      value: leaveSummary?.ditolak || 0,
      sub: "Bulan ini",
      icon: <XCircle className="size-4 text-rose-500" />,
      bg: "bg-rose-50 dark:bg-rose-500/10",
    },
    {
      label: "Pending",
      value: leaveSummary?.pending || 0,
      sub: "Rata-rata",
      icon: <Clock className="size-4 text-amber-500" />,
      bg: "bg-amber-50 dark:bg-amber-500/10",
    },
    {
      label: "Sisa Cuti",
      value: leaveSummary?.sisa_cuti || 0,
      sub: "Rata-rata",
      icon: <Clock className="size-4 text-blue-500" />,
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
  ];

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">
          Ringkasan Cuti
        </h3>
        <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:opacity-80">
          Selengkapnya
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {data.map((item, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-3 rounded-xl border border-slate-50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/20 hover:scale-[1.02] transition-transform duration-200"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.bg}`}>
                {item.icon}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                  {item.label}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {item.sub}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}