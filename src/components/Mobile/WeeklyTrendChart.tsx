import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { WeeklyTrend } from "@/types/dashboard.types";

interface WeeklyTrendChartProps {
  weeklyTrend: WeeklyTrend[];
}

export default function WeeklyTrendChart({ weeklyTrend }: WeeklyTrendChartProps) {
  const barChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      sparkline: { enabled: false },
      animations: { enabled: true, speed: 800 },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "60%",
        distributed: true,
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => (val > 0 ? `${Math.floor(val / 60)}h` : ""),
      offsetY: -20,
      style: { fontSize: "10px", fontWeight: "700", colors: ["#9ca3af"] },
    },
    xaxis: {
      categories: weeklyTrend.map((d) => d.day),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#9ca3af", fontSize: "11px", fontWeight: 600 },
      },
    },
    yaxis: { show: false },
    grid: { show: false },
    colors: weeklyTrend.map((d) => {
      if (d.status === "absent") return "#FCA5A5";
      if (d.status === "off") return "#E5E7EB";
      return d.status === "late" ? "#F59E0B" : "#3B82F6";
    }),
    tooltip: { enabled: false },
  };

  return (
    <div className="p-6 rounded-[2.5rem] bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase">
          Weekly Trend
        </h3>
        <div className="flex gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[9px] font-bold text-gray-400 uppercase">On-Time</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[9px] font-bold text-gray-400 uppercase">Late</span>
          </div>
        </div>
      </div>
      <div className="h-52 w-full">
        <Chart
          options={barChartOptions}
          series={[{ name: "Work Minutes", data: weeklyTrend.map((d) => d.work_minutes) }]}
          type="bar"
          height="100%"
        />
      </div>
    </div>
  );
}