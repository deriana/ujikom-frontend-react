import { Calendar, CheckCircle2, AlertCircle, Timer } from "lucide-react";
import { PersonalStats } from "@/types/dashboard.types";

interface TopStatGridProps {
  stats: PersonalStats;
}

export default function TopStatGrid({ stats }: TopStatGridProps) {
  const formatMinutesToHours = (totalMinutes: number) => {
    if (!totalMinutes) return "0h 0m";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const statItems = [
    {
      label: "Leave Days",
      value: stats.sisa_cuti,
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      label: "Attendance",
      value: stats.kehadiran_bulan_ini,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: "Late Arrival",
      value: `${stats.total_terlambat}x`,
      icon: AlertCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
      isWarning: true,
    },
    {
      label: "Overtime",
      value: formatMinutesToHours(stats.total_menit_lembur),
      icon: Timer,
      color: "text-red-500",
      bgColor: "bg-indigo-50 dark:bg-red-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {statItems.map((item, idx) => (
        <div key={idx} className="p-5 rounded-[2.5rem] bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden">
          <div className={`w-10 h-10 rounded-2xl ${item.bgColor} flex items-center justify-center mb-4`}>
            <item.icon className={`w-5 h-5 ${item.color}`} />
          </div>
          <p className={`text-3xl font-black ${item.isWarning ? item.color : "text-gray-900 dark:text-white"} ${item.label === 'Overtime' ? 'text-xl' : ''}`}>
            {item.value}
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {item.label}
          </p>
          {item.isWarning && (
            <div className="absolute -right-2 -bottom-2 opacity-5 text-amber-500">
              <AlertCircle size={80} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}