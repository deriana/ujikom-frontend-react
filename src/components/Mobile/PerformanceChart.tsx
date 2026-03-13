import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Star } from "lucide-react";

interface PerformanceDetail {
  category: string;
  score: number;
}

interface PerformanceData {
  period: string;
  score: number;
  details: PerformanceDetail[];
}

interface PerformanceChartProps {
  performance?: PerformanceData;
}

export default function PerformanceChart({ performance }: PerformanceChartProps) {
  if (!performance) return null;

  const chartOptions: ApexOptions = {
    chart: {
      type: "radar",
      toolbar: { show: false },
      dropShadow: { enabled: true, blur: 1, left: 1, top: 1 },
    },
    xaxis: {
      categories: performance.details.map((d) => d.category),
      labels: {
        style: {
          colors: Array(performance.details.length).fill("#64748b"),
          fontSize: "10px",
          fontWeight: 600,
        },
      },
    },
    yaxis: { show: false, min: 0, max: 5, tickAmount: 5 },
    fill: { opacity: 0.2 },
    stroke: { show: true, width: 2, colors: ["#3b82f6"], dashArray: 0 },
    markers: { size: 4, colors: ["#fff"], strokeColors: "#3b82f6", strokeWidth: 2 },
    colors: ["#3b82f6"],
    plotOptions: {
      radar: {
        polygons: { 
          strokeColors: "#e2e8f0", 
          connectorColors: "#e2e8f0" 
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h3 className="text-base font-black dark:text-white uppercase tracking-tight">Performance Radar</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Period: {performance.period}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={16} fill="currentColor" />
            <span className="text-xl font-black dark:text-white">{performance.score}</span>
            <span className="text-xs font-bold text-gray-400">/5</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <ReactApexChart 
          options={chartOptions} 
          series={[{ name: "Score", data: performance.details.map((d) => d.score) }]} 
          type="radar" 
          height={320} 
          width="100%" 
        />
      </div>
    </div>
  );
}