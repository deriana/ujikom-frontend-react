import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { MonthlyChart } from "@/types";
// import DatePicker from "../form/date-picker";

interface StatisticsChartProps {
  chartData?: MonthlyChart;
  // Add this prop for communication to Parent
  onDateChange?: (date: string) => void;
}

export default function StatisticsChart({
  chartData,
}: StatisticsChartProps) {
  // No state needed for now

  // ... (options dan series tetap sama seperti kode kamu)
  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#465FFF", "#F43F5E"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    stroke: { curve: "smooth", width: [3, 3], lineCap: "round" },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: "rgba(148, 163, 184, 0.1)",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: { theme: "dark", x: { show: true } },
    xaxis: {
      type: "category",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#94a3b8", fontSize: "12px" } },
    },
    yaxis: { labels: { style: { colors: "#94a3b8", fontSize: "12px" } } },
  };

  const series = [
    { name: "Present", data: chartData?.hadir || Array(12).fill(0) },
    { name: "Absent", data: chartData?.absent || Array(12).fill(0) },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-slate-900 sm:p-6 transition-all">
      <div className="flex flex-col gap-5 mb-8 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            Attendance Statistics
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visualization of employee attendance trends this year
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* <div className="w-full sm:w-60">
            <DatePicker
              id="attendance-date-picker"
              mode="range"
              placeholder="Select date range"
              value={dateRange}
              onChange={handleDateChange}
              className="gap-0!"
            />
          </div> */}
        </div>
      </div>

      <div className="max-w-full overflow-hidden">
        <div className="min-w-150 xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
