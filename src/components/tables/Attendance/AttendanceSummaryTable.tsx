import { DataTable } from "@/components/tables/BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useAttendanceSummary } from "@/hooks/useAttendance";
import { AttendanceSummary, Column } from "@/types";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "@/components/form/date-picker";
import { Clock, Calendar, AlertCircle, UserCheck, LogOut, TrendingUp } from "lucide-react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function AttendanceSummaryTable() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString("en-CA");
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toLocaleDateString("en-CA");

  const [startDate, setStartDate] = useState<string>(firstDay);
  const [endDate, setEndDate] = useState<string>(lastDay);

  const {
    data: summary = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAttendanceSummary({ 
    start_date: startDate, 
    end_date: endDate 
  });

  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [startDate, endDate, refetch]);

  useEffect(() => {
    if (isMobile) {
      navigate(-1);
    }
  }, [isMobile, navigate]);

  // --- LOGIC UNTUK CHART ---
  const chartData = useMemo(() => {
    const totalOnTime = summary.reduce((acc, curr) => acc + curr.attendance_stats.on_time, 0);
    const totalLate = summary.reduce((acc, curr) => acc + curr.attendance_stats.late.count, 0);
    const totalEarly = summary.reduce((acc, curr) => acc + curr.attendance_stats.early_leave.count, 0);

    return {
      series: [totalOnTime, totalLate, totalEarly],
      options: {
        chart: { type: 'donut' },
        labels: ['On Time', 'Late', 'Early Leave'],
        colors: ['#10b981', '#f59e0b', '#ef4444'],
        legend: { position: 'bottom', labels: { colors: '#64748b' } },
        dataLabels: { enabled: false },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: { show: true, label: 'Total Logs', color: '#64748b' }
              }
            }
          }
        }
      } as ApexOptions
    };
  }, [summary]);

  const columns: Column<AttendanceSummary>[] = [
    {
      header: "Employee",
      render: (row) => (
        <div className="flex flex-col min-w-50">
          <span className="font-bold text-gray-800 dark:text-white/90 capitalize">
            {row.employee.name || "-"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {row.employee.nik} • <span className="text-indigo-500">{row.employee.team}</span>
          </span>
        </div>
      ),
    },
    {
      header: "Attendance Stats",
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Present</p>
            <p className="font-bold text-emerald-600">{row.attendance_stats.total_present}d</p>
          </div>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Absent</p>
            <p className="font-bold text-rose-500">{row.attendance_stats.absent}d</p>
          </div>
        </div>
      ),
    },
    {
      header: "Punctuality & Discipline",
      render: (row) => (
        <div className="space-y-1.5 min-w-45">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <UserCheck size={12} /> On Time
            </span>
            <span className="font-bold text-white">{row.attendance_stats.on_time}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-amber-500 font-medium">
              <AlertCircle size={12} /> Late
            </span>
            <span className="font-bold text-white">{row.attendance_stats.late.formatted} ({row.attendance_stats.late.count}x)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-rose-400 font-medium">
              <LogOut size={12} /> Early Leave
            </span>
            <span className="font-bold text-white">{row.attendance_stats.early_leave.formatted} ({row.attendance_stats.early_leave.count}x)</span>
          </div>
        </div>
      ),
    },
    {
      header: "Work & Overtime",
      render: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
            <Clock size={14} className="text-indigo-500" />
            <span className="font-bold text-sm">{row.work_stats.work_time.formatted}</span>
          </div>
          <div className="mt-1">
            <Badge variant="light" color={row.work_stats.overtime.total_minutes > 0 ? "success" : "light"}>
              OT: {row.work_stats.overtime.formatted}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      header: "Leaves Detail",
      render: (row) => {
        const details = row.attendance_stats.leave.details;
        const hasLeave = Object.keys(details).length > 0;
        
        return (
          <div className="flex flex-col gap-1 max-w-37.5">
             {hasLeave ? (
                Object.entries(details).map(([key, value]) => {
                  const days = typeof value === 'object' && value !== null ? (value as any).days : value;
                  return (
                  <div key={key} className="flex justify-between items-center bg-orange-50 dark:bg-orange-900/10 px-2 py-0.5 rounded border border-orange-100 dark:border-orange-800">
                    <span className="text-[10px] text-orange-700 dark:text-orange-400 font-medium truncate mr-2">{key}</span>
                    <span className="text-[10px] font-bold text-orange-800 dark:text-orange-300">{days}d</span>
                  </div>
                )})
             ) : (
               <span className="text-gray-400 text-xs italic">No leave record</span>
             )}
          </div>
        );
      },
    },
  ];

  if (isError) {
    return (
      <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm italic">
        <span className="font-bold">Error:</span> {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-indigo-600" /> Attendance Summary Recap
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Monitoring performance and punctuality for period: 
              <span className="font-semibold text-indigo-600 ml-1">
                {new Date(startDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric', day: 'numeric' })} - 
                {new Date(endDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric', day: 'numeric' })}
              </span>
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-2 rounded-2xl border border-gray-200 dark:border-gray-700">
            <Calendar size={18} className="text-gray-400 ml-2" />
            <DatePicker
              id="summary-start-date"
              mode="single"
              value={startDate}
              onChange={(dates) => dates[0] && setStartDate(dates[0].toLocaleDateString("en-CA"))}
            />
            <span className="text-gray-400">to</span>
            <DatePicker
              id="summary-end-date"
              mode="single"
              value={endDate}
              onChange={(dates) => dates[0] && setEndDate(dates[0].toLocaleDateString("en-CA"))}
            />
          </div>
        </div>

        {/* ANALYTICS MINI DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-4 border border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500/50 transition-colors duration-300">
             <Chart options={chartData.options} series={chartData.series} type="donut" width="100%" height={200} />
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Present', val: summary.reduce((a, b) => a + b.attendance_stats.total_present, 0), unit: 'Days', color: 'text-emerald-600', icon: UserCheck, bg: 'bg-emerald-50 dark:bg-emerald-500/10', hover: 'hover:shadow-emerald-500/10' },
              { label: 'Late Cases', val: summary.reduce((a, b) => a + b.attendance_stats.late.count, 0), unit: 'Times', color: 'text-amber-500', icon: AlertCircle, bg: 'bg-amber-50 dark:bg-amber-500/10', hover: 'hover:shadow-amber-500/10' },
              { label: 'Early Leaves', val: summary.reduce((a, b) => a + b.attendance_stats.early_leave.count, 0), unit: 'Times', color: 'text-rose-500', icon: LogOut, bg: 'bg-rose-50 dark:bg-rose-500/10', hover: 'hover:shadow-rose-500/10' },
              { label: 'Overtime', val: (summary.reduce((a, b) => a + b.work_stats.overtime.total_minutes, 0) / 60).toFixed(1), unit: 'Hours', color: 'text-indigo-600', icon: Clock, bg: 'bg-indigo-50 dark:bg-indigo-500/10', hover: 'hover:shadow-indigo-500/10' },
            ].map((stat, i) => (
              <div 
                key={i} 
                className={`relative group overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${stat.hover}`}
              >
                {/* Decorative Background Icon */}
                <stat.icon 
                  size={80} 
                  className={`absolute -right-4 -bottom-4 opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${stat.color}`} 
                />
                
                <div className="relative z-10">
                  <div className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-6`}>
                    <stat.icon size={20} className={`${stat.color}`} />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        {stat.val}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{stat.unit}</span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider leading-tight">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-hidden">
        <DataTable
          tableTitle=""
          data={summary}
          columns={columns}
          searchableKeys={["employee.name", "employee.nik", "employee.team"]}
          loading={isLoading}
          label="Employees"
        />
      </div>
    </div>
  );
}