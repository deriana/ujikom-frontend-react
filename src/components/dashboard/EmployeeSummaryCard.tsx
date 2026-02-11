import { Users, UserCheck, UserMinus, UserPlus, TrendingUp, TrendingDown } from "lucide-react";

export default function EmployeeSummaryCards() {
  const stats = [
    {
      label: "Total Karyawan",
      value: 128,
      trend: "+12%",
      isPositive: true,
      icon: <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      color: "from-blue-500/20 to-transparent",
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      label: "Karyawan Aktif",
      value: 120,
      trend: "+4",
      isPositive: true,
      icon: <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      color: "from-emerald-500/20 to-transparent",
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: "Resign Bulan Ini",
      value: 3,
      trend: "-2%",
      isPositive: false, // Turun untuk resign biasanya positif secara bisnis, tapi kita tandai merah untuk volume
      icon: <UserMinus className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      color: "from-rose-500/20 to-transparent",
      iconBg: "bg-rose-50 dark:bg-rose-500/10",
    },
    {
      label: "Karyawan Baru",
      value: 5,
      trend: "+2",
      isPositive: true,
      icon: <UserPlus className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      color: "from-amber-500/20 to-transparent",
      iconBg: "bg-amber-50 dark:bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
      {stats.map((item) => (
        <div
          key={item.label}
          className="relative overflow-hidden group p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between"
        >
          {/* Efek Gradient Background saat Hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${item.iconBg} transition-transform group-hover:rotate-6 duration-300`}>
                {item.icon}
              </div>
              
              {/* Trend Badge */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                item.isPositive ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-rose-600 bg-rose-50 dark:bg-rose-500/10'
              }`}>
                {item.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {item.trend}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
                {item.value}
              </h3>
            </div>
          </div>

          {/* Decorative Circle */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-full group-hover:scale-150 transition-transform duration-700" />
        </div>
      ))}
    </div>
  );
}