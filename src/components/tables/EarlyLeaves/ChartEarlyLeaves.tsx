import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { Clock, Users, Calendar, AlertCircle } from "lucide-react";
import type { EarlyLeave } from "@/types";

interface ChartEarlyLeaveProps {
  data: EarlyLeave[];
}

export default function ChartEarlyLeave({ data }: ChartEarlyLeaveProps) {
  const processed = useMemo(() => {
    // 1. KPI Stats
    const totalMinutes = data.reduce((acc, curr) => acc + curr.minutes_early, 0);
    const avgMinutes = data.length > 0 ? Math.round(totalMinutes / data.length) : 0;
    const pending = data.filter((d) => d.status === 0).length;

    // --- PERBAIKAN DI SINI ---
    // 2. Ambil tanggal unik dari data yang ada dan urutkan
    // Jika data kosong, default ke 7 hari terakhir
    let uniqueDates = Array.from(new Set(data.map(d => d.date.split(' ')[0])))
      .sort()
      .slice(-7); // Ambil 7 tanggal terbaru yang ada di database

    // Jika data ternyata hanya ada di 1 tanggal (seperti contoh JSON kamu), 
    // kita buatkan rentang 7 hari ke belakang dari tanggal tersebut agar chart tidak cuma 1 bar
    if (uniqueDates.length <= 1 && data.length > 0) {
      const lastDate = new Date(data[0].date);
      uniqueDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(lastDate);
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split("T")[0];
      });
    }

    const dailyMinutes = uniqueDates.map((day) => {
      return data
        .filter((d) => d.date.startsWith(day))
        .reduce((acc, curr) => acc + curr.minutes_early, 0);
    });

    // 3. Distribusi Status (Donut)
    const statusSeries = [
      data.filter((d) => d.status === 1).length, // Approved
      data.filter((d) => d.status === 0).length, // Pending
      data.filter((d) => d.status === 2).length, // Rejected
    ];

    return { totalMinutes, avgMinutes, pending, uniqueDates, dailyMinutes, statusSeries };
  }, [data]);

  const barOptions: any = {
    chart: { toolbar: { show: false }, fontFamily: 'Inter' },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
    xaxis: { 
      categories: processed.uniqueDates.map(d => {
        const parts = d.split('-');
        return `${parts[2]}/${parts[1]}`; // Format DD/MM
      }),
      labels: { style: { colors: '#94a3b8' } }
    },
    colors: ['#f43f5e'],
    dataLabels: { enabled: false },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    tooltip: { y: { formatter: (val: number) => `${val} Minutes` } }
  };

  const donutOptions: any = {
    labels: ["Approved", "Pending", "Rejected"],
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    legend: { position: 'bottom' },
    stroke: { show: false },
    plotOptions: { pie: { donut: { size: '75%', labels: { show: true, total: { show: true, label: 'Total Cases', formatter: () => data.length } } } } },
    dataLabels: { enabled: false }
  };

  return (
    <div className="space-y-6">
      {/* KPI Spans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Minutes" value={`${processed.totalMinutes}m`} icon={Clock} color="text-rose-600" bg="bg-rose-50" />
        <StatCard title="Avg. Time" value={`${processed.avgMinutes}m`} icon={AlertCircle} color="text-orange-600" bg="bg-orange-50" />
        <StatCard title="Total Cases" value={data.length} icon={Users} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="Waiting" value={processed.pending} icon={Calendar} color="text-amber-600" bg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
          <h4 className="text-sm font-bold mb-4 dark:text-white">Minutes Lost by Date</h4>
          <ReactApexChart options={barOptions} series={[{ name: 'Minutes', data: processed.dailyMinutes }]} type="bar" height={300} />
        </div>

        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
          <h4 className="text-sm font-bold mb-4 dark:text-white">Approval Status</h4>
          <ReactApexChart options={donutOptions} series={processed.statusSeries} type="donut" height={300} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 flex items-center gap-3">
      <div className={`p-2 rounded-xl ${bg} dark:bg-opacity-10`}><Icon className={color} size={20} /></div>
      <div>
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{title}</p>
        <p className="text-xl font-bold dark:text-white">{value}</p>
      </div>
    </div>
  );
}