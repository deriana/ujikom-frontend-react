import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { Clock, Users, UserCheck, AlertTriangle, TrendingUp } from "lucide-react";
import { Attendance } from "@/types/attendance.types";

interface ChartAttendanceProps {
  data: Attendance[];
}

export default function ChartAttendance({ data }: ChartAttendanceProps) {
  const processed = useMemo(() => {
    const total = data.length;
    const present = data.filter((d) => d.status?.toLowerCase() === "present").length;
    const late = data.filter((d) => (d.late_minutes ?? 0) > 0).length;
    const totalWorkMin = data.reduce((acc, curr) => acc + (curr.work_minutes ?? 0), 0);
    const avgWorkHours = total > 0 ? (totalWorkMin / 60 / total).toFixed(1) : 0;

    // Ambil tanggal unik (7 hari terakhir dari data yang ada)
    const uniqueDates = Array.from(new Set(data.map((d) => d.date)))
      .sort()
      .slice(-7);

    // Tren Menit Keterlambatan per Hari
    const lateTrend = uniqueDates.map((date) => {
      return data
        .filter((d) => d.date === date)
        .reduce((acc, curr) => acc + (curr.late_minutes ?? 0), 0);
    });

    // Tren Kehadiran (Jumlah orang hadir per hari)
    const attendanceTrend = uniqueDates.map((date) => {
      return data.filter(
        (d) => d.date === date && d.status?.toLowerCase() === "present"
      ).length;
    });

    // Distribusi Status Kehadiran
    const statusGroups = data.reduce((acc: any, curr) => {
      const s = curr.status || "Unknown";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      present,
      late,
      avgWorkHours,
      uniqueDates,
      attendanceTrend,
      lateTrend,
      statusLabels: Object.keys(statusGroups),
      statusSeries: Object.values(statusGroups) as number[],
    };
  }, [data]);

  const mixedChartOptions: any = {
    chart: { 
      toolbar: { show: false }, 
      fontFamily: "Inter, sans-serif",
      stacked: false
    },
    stroke: { width: [0, 3], curve: 'smooth' },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
    colors: ["#6366f1", "#f59e0b"], // Indigo for Attendance, Amber for Late Mins
    xaxis: {
      categories: processed.uniqueDates.map((d) => d.split("-").slice(1).join("/")),
      labels: { style: { colors: "#64748b", fontWeight: 500 } },
    },
    yaxis: [
      {
        title: { text: "Present Count", style: { color: "#6366f1" } },
        labels: { style: { colors: "#6366f1" } },
      },
      {
        opposite: true,
        title: { text: "Late Minutes", style: { color: "#f59e0b" } },
        labels: { style: { colors: "#f59e0b" } },
      },
    ],
    legend: { position: "top", horizontalAlign: "left" },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
    tooltip: { shared: true, intersect: false },
  };

  const donutOptions: any = {
    labels: processed.statusLabels.map(l => l.toUpperCase()),
    colors: ["#10b981", "#f43f5e", "#f59e0b", "#6366f1"],
    legend: { position: "bottom" },
    stroke: { width: 2, colors: ["transparent"] },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => processed.total.toString(),
              style: { fontSize: "14px", fontWeight: 900 }
            }
          }
        }
      }
    },
    dataLabels: { enabled: false },
  };

  const series = [
    {
      name: "Present Count",
      type: "column",
      data: processed.attendanceTrend,
    },
    {
      name: "Late Minutes",
      type: "line",
      data: processed.lateTrend,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Recorded" value={processed.total} icon={Users} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="Present" value={processed.present} icon={UserCheck} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Late Cases" value={processed.late} icon={AlertTriangle} color="text-orange-600" bg="bg-orange-50" />
        <StatCard title="Avg Work Time" value={`${processed.avgWorkHours}h`} icon={Clock} color="text-indigo-600" bg="bg-indigo-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mixed Chart: Attendance & Late Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h4 className="font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-indigo-500"/> Attendance & Punctuality Trend</h4>
          <ReactApexChart options={mixedChartOptions} series={series} type="line" height={320} />
        </div>

        {/* Donut Chart: Attendance Status */}
        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h4 className="font-bold text-gray-800 dark:text-white mb-6">Attendance Status</h4>
          <ReactApexChart options={donutOptions} series={processed.statusSeries} type="donut" height={300} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${bg} dark:bg-opacity-10`}>
        <Icon className={color} size={24} />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">{title}</p>
        <p className="text-2xl font-bold dark:text-white leading-tight">{value}</p>
      </div>
    </div>
  );
}