import { AttendanceToday } from "@/types";

export default function AttendanceTodayCard({attendanceData} : {attendanceData?: AttendanceToday}) {
  const data = {
    hadir: attendanceData?.hadir ?? 0,
    telat: attendanceData?.terlambat ?? 0,
    izin: attendanceData?.cuti ?? 0,
    alpha: attendanceData?.tanpa_keterangan ?? 0,
  };

  const total = data.hadir + data.telat + data.izin + data.alpha;

  // Helper to count percentage
  const getWidth = (value : any) => `${(value / total) * 100}%`;

  const stats = [
    { label: "Present", value: data.hadir, color: "bg-emerald-500", text: "text-emerald-600" },
    { label: "Late", value: data.telat, color: "bg-amber-500", text: "text-amber-600" },
    { label: "Leave/Sick", value: data.izin, color: "bg-blue-500", text: "text-blue-600" },
    { label: "Absent", value: data.alpha, color: "bg-rose-500", text: "text-rose-600" },
  ];

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">
          Today's Attendance
        </h3>
        <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
          Total: {total} Employees
        </span>
      </div>

      {/* Progress Bar Group */}
      <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 mb-8">
        {stats.map((item, idx) => (
          <div
            key={idx}
            style={{ width: getWidth(item.value) }}
            className={`${item.color} transition-all duration-500 ease-out border-r border-white dark:border-slate-900 last:border-0`}
          />
        ))}
      </div>

      {/* Legend & Details */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((item, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {item.value}
              </span>
              <span className="text-xs text-slate-400">
                ({Math.round((item.value / total) * 100)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}