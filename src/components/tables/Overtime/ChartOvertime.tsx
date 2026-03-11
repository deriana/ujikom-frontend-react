import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { Clock, Users, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import type { Overtime } from "@/types";

interface ChartOvertimeProps {
  data: Overtime[];
}

export default function ChartOvertime({ data }: ChartOvertimeProps) {
  const processed = useMemo(() => {
    // 1. KPI Stats
    const totalMinutes = data.reduce((acc, curr) => acc + curr.duration_minutes, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    const approvedCount = data.filter((d) => d.status === 1).length;
    const pendingCount = data.filter((d) => d.status === 0).length;

    // 2. Trend Durasi (Ambil 7 tanggal unik terakhir dari data)
    const uniqueDates = Array.from(new Set(data.map((d) => d.date.split(" ")[0])))
      .sort()
      .slice(-7);

    // Jika data sedikit, buat range 7 hari ke belakang dari tanggal terakhir
    let finalDates = uniqueDates;
    if (uniqueDates.length <= 1 && data.length > 0) {
      const lastDate = new Date(data[0].date);
      finalDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(lastDate);
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split("T")[0];
      });
    }

    const durationTrends = finalDates.map((day) => {
      const totalMin = data
        .filter((d) => d.date.startsWith(day))
        .reduce((acc, curr) => acc + curr.duration_minutes, 0);
      return parseFloat((totalMin / 60).toFixed(1)); // Konversi ke jam (number)
    });

    // 3. Status Distribution
    const statusSeries = [
      data.filter((d) => d.status === 1).length,
      data.filter((d) => d.status === 0).length,
      data.filter((d) => d.status === 2).length,
    ];

    return { totalHours, approvedCount, pendingCount, finalDates, durationTrends, statusSeries };
  }, [data]);

  const areaOptions: any = {
    chart: { toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
    stroke: { curve: "smooth", width: 3 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.5, opacityTo: 0 } },
    xaxis: { 
      categories: processed.finalDates.map((d) => d.split("-").slice(1).join("/")),
      labels: { style: { colors: "#64748b" } } 
    },
    yaxis: { title: { text: "Hours" } },
    colors: ["#6366f1"],
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: (val: number) => `${val} Hours` } }
  };

  const donutOptions: any = {
    labels: ["Approved", "Pending", "Rejected"],
    colors: ["#10b981", "#f59e0b", "#ef4444"],
    stroke: { show: false },
    legend: { position: "bottom" },
    plotOptions: { pie: { donut: { size: "75%" } } },
    dataLabels: { enabled: false }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total OT Hours" value={`${processed.totalHours}h`} icon={Clock} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard title="Approved OT" value={processed.approvedCount} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Waiting Review" value={processed.pendingCount} icon={AlertCircle} color="text-amber-600" bg="bg-amber-50" />
        <StatCard title="Total Employees" value={new Set(data.map(d => d.employee_nik)).size} icon={Users} color="text-blue-600" bg="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart: Overtime Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-indigo-500" />
            <h4 className="font-bold dark:text-white text-sm">Overtime Hours Trend</h4>
          </div>
          <ReactApexChart options={areaOptions} series={[{ name: "OT Hours", data: processed.durationTrends }]} type="area" height={300} />
        </div>

        {/* Donut Chart: Status */}
        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
          <h4 className="text-sm font-bold mb-6 dark:text-white">Status Overview</h4>
          <ReactApexChart options={donutOptions} series={processed.statusSeries} type="donut" height={300} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 flex items-center gap-4 transition-all hover:shadow-md">
      <div className={`p-3 rounded-2xl ${bg} dark:bg-opacity-10`}>
        <Icon className={color} size={24} />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{title}</p>
        <p className="text-2xl font-bold dark:text-white leading-tight">{value}</p>
      </div>
    </div>
  );
}