import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { PerformanceStat } from "@/types";

interface PerformanceChartProps {
  performanceStats?: PerformanceStat;
}

export default function PerformanceChart({ performanceStats }: PerformanceChartProps) {
  if (!performanceStats) return null;

  const performanceSeries = [
    { name: "Score", data: performanceStats.categories?.map((c: any) => c.score) || [] },
  ];

  const performanceChartOptions: ApexOptions = {
    chart: {
      type: "radar",
      toolbar: { show: false },
    },
    xaxis: {
      categories: performanceStats.categories?.map((c: any) => c.name) || [],
    },
    yaxis: {
      show: false,
      max: 5,
    },
    colors: ["#3b82f6"],
    fill: {
      opacity: 0.2,
    },
    markers: {
      size: 4,
    },
  };

  const barChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        distributed: true,
      },
    },
    xaxis: {
      categories: performanceStats.categories?.map((c: any) => c.name) || [],
      max: 5,
    },
    colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
    legend: {
      show: false,
    },
  };

  return (
    <>
      <div className="col-span-12 xl:col-span-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 h-full">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Company Performance Radar</h3>
              <p className="text-sm text-slate-500">Metric distribution for {performanceStats.year}</p>
            </div>
            <div className="text-right">
              <span className="block text-2xl font-bold text-blue-600 dark:text-blue-400">{performanceStats.average}</span>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Avg Score</span>
            </div>
          </div>
          <div className="flex justify-center">
            <ReactApexChart options={performanceChartOptions} series={performanceSeries} type="radar" height={380} width="100%" />
          </div>
        </div>
      </div>

      <div className="col-span-12 xl:col-span-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 h-full">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Performance Breakdown</h3>
            <p className="text-sm text-slate-500">Detailed score per category</p>
          </div>
          <div className="flex justify-center">
            <ReactApexChart
              options={barChartOptions}
              series={performanceSeries}
              type="bar"
              height={380}
              width="100%"
            />
          </div>
        </div>
      </div>
    </>
  );
}