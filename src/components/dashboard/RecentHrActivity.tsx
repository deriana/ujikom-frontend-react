import { Calendar, Clock, CheckCircle2, UserPlus } from "lucide-react";

export default function RecentHRActivity() {
  const activities = [
    {
      text: "Andi mengajukan cuti tahunan",
      time: "2 menit yang lalu",
      icon: <Calendar className="w-3.5 h-3.5 text-amber-500" />,
      dotColor: "bg-amber-500",
    },
    {
      text: "Siti melakukan check-in pukul 08:12",
      time: "1 jam yang lalu",
      icon: <Clock className="w-3.5 h-3.5 text-blue-500" />,
      dotColor: "bg-blue-500",
    },
    {
      text: "Budi disetujui lembur oleh Manager",
      time: "3 jam yang lalu",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
      dotColor: "bg-emerald-500",
    },
    {
      text: "Karyawan baru: Rina Putri ditambahkan",
      time: "Kemarin",
      icon: <UserPlus className="w-3.5 h-3.5 text-purple-500" />,
      dotColor: "bg-purple-500",
    },
  ];

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
          Aktivitas HR Terbaru
        </h3>
        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline">
          Lihat Log
        </span>
      </div>

      <div className="relative space-y-6">
        {/* Garis Vertikal Timeline */}
        <div className="absolute left-2.75 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />

        {activities.map((item, i) => (
          <div key={i} className="relative pl-8 group">
            {/* Titik Indikator */}
            <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 ${item.dotColor} flex items-center justify-center z-10 shadow-sm`}>
              <div className="scale-75 brightness-200 contrast-200">
                {/* Kita pakai dot kecil saja jika ingin minimalis, atau icon kecil */}
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.text}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  {item.icon}
                  {item.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-100 dark:border-slate-700/50">
        Muat Aktivitas Lainnya
      </button>
    </div>
  );
}