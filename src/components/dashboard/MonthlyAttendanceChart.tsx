import { useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import ChartTab from "../common/ChartTab";
import { CalenderIcon } from "../../icons";

export default function StatisticsChart() {
  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!datePickerRef.current) return;
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M d",
      defaultDate: [sevenDaysAgo, today],
      // ... (rest of your flatpickr config)
    });

    return () => { if (!Array.isArray(fp)) fp.destroy(); };
  }, []);

  const options: ApexOptions = {
    legend: { show: false },
    // Warna yang lebih vibrant untuk modern look
    colors: ["#465FFF", "#34D399"], 
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area", // Pastikan type area agar gradient bekerja
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    stroke: {
      curve: "smooth", // Jauh lebih modern daripada 'straight'
      width: [3, 3],
      lineCap: "round",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: 0,
      hover: { size: 5 },
    },
    grid: {
      borderColor: "rgba(148, 163, 184, 0.1)", // Garis tipis transparan
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: "dark", // Memaksa tooltip gelap agar terlihat pro
      fixed: { enabled: false },
      x: { show: true },
      y: { title: { formatter: (seriesName) => seriesName } },
      marker: { show: true },
    },
    xaxis: {
      type: "category",
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: "12px",
        },
      },
    },
  };

  const series = [
    {
      name: "Hadir",
      data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    },
    {
      name: "Izin/Sakit",
      data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-slate-900 sm:p-6 transition-all">
      <div className="flex flex-col gap-5 mb-8 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            Statistik Kehadiran
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visualisasi tren kehadiran karyawan tahun ini
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <ChartTab />
          <div className="relative group">
            <CalenderIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10" />
            <input
              ref={datePickerRef}
              className="h-10 pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition-all cursor-pointer w-full sm:w-44"
              placeholder="Pilih Tanggal"
            />
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-150 xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}