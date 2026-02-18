import { Clock, UserCog, ChevronRight, CalendarDays } from "lucide-react";

export default function PendingApprovalCard() {
  const approvals = [
    {
      label: "Pengajuan Cuti",
      count: 5,
      icon: <CalendarDays className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      label: "Lembur (Overtime)",
      count: 3,
      icon: <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Data Karyawan",
      count: 2,
      icon: <UserCog className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-amber-500 rounded-full" /> {/* Accent bar */}
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
            Butuh Approval
          </h3>
        </div>
        <span className="flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
      </div>

      <div className="space-y-4">
        {approvals.map((item, index) => (
          <button
            key={index}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${item.bg}`}>
                {item.icon}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {item.label}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {item.count} permintaan menunggu
                </p>
              </div>
            </div>
            
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-transform group-hover:translate-x-1" />
          </button>
        ))}
      </div>

      <button className="w-full mt-6 py-2.5 text-sm font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
        Buka Dashboard Approval
      </button>
    </div>
  );
}