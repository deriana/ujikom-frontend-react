import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import type { Leave } from "@/types";

interface ChartLeaveProps {
  leaves: Leave[];
}

export default function ChartLeave({ leaves }: ChartLeaveProps) {
  // 1. Kalkulasi Data untuk KPI & Charts
  const processed = useMemo(() => {
    // KPI Stats
    const stats = {
      total: leaves.length,
      approved: leaves.filter((l) => l.approval_status === 1).length,
      pending: leaves.filter((l) => l.approval_status === 0).length,
      rejected: leaves.filter((l) => l.approval_status === 2).length,
    };

    // Monthly Trends (6 Bulan Terakhir)
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toLocaleString("default", { month: "short" });
    }).reverse();

    const trendData = months.map((m) => {
      return leaves.filter((l) => {
        const d = new Date(l.date_start);
        return d.toLocaleString("default", { month: "short" }) === m;
      }).length;
    });

    // Type Distribution
    const typeMap = leaves.reduce((acc: any, curr) => {
      acc[curr.leave_type] = (acc[curr.leave_type] || 0) + 1;
      return acc;
    }, {});

    return { 
      stats, 
      months, 
      trendData, 
      typeLabels: Object.keys(typeMap), 
      typeValues: Object.values(typeMap) as number[] 
    };
  }, [leaves]);

  // 2. Konfigurasi ApexCharts
  const areaOptions: any = {
    chart: { toolbar: { show: false }, fontFamily: 'Inter' },
    stroke: { curve: 'smooth', width: 3 },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0 } },
    xaxis: { categories: processed.months },
    colors: ['#4f46e5'],
    dataLabels: { enabled: false },
  };

  const donutConfig = useMemo(() => {
    return {
      series: processed.typeValues,
      options: {
        labels: processed.typeLabels,
        chart: {
          type: "donut" as const,
          id: "leave-dist-chart",
          animations: { enabled: true, dynamicAnimation: { speed: 350 } },
        },
        plotOptions: { pie: { donut: { size: "70%" } } },
        legend: { position: "bottom" as const },
        colors: ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
        noData: { text: "No Data Available" },
      },
    };
  }, [processed]);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Request" value={processed.stats.total} icon={FileText} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="Approved" value={processed.stats.approved} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Pending" value={processed.stats.pending} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
        <StatCard title="Rejected" value={processed.stats.rejected} icon={XCircle} color="text-rose-600" bg="bg-rose-50" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Monthly Leave Trends</h4>
          <ReactApexChart options={areaOptions} series={[{ name: 'Requests', data: processed.trendData }]} type="area" height={300} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Overall Leave Distribution
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-bold uppercase tracking-tight">
              Total Accumulation
            </span>
          </div>
          <ReactApexChart
            options={donutConfig.options}
            series={donutConfig.series}
            type="donut"
            height={300}
          />
        </div>
      </div>
    </div>
  );
}

// Sub-component StatCard sederhana
function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${bg} dark:bg-opacity-10`}>
          <Icon className={color} size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{title}</p>
          <p className="text-xl font-bold dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}