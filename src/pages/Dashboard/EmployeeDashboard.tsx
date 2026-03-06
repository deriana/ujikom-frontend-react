import PageMeta from "@/components/common/PageMeta";
import { ActivityLog } from "@/components/dashboard/ActivityLog";
import AttendanceYearlyChart from "@/components/dashboard/AttendanceChart";
import { OvertimeLog } from "@/components/dashboard/OvertimeLog";
import { SalaryHistory } from "@/components/dashboard/SalaryHistory";
import { StatCard } from "@/components/dashboard/StatCard";
import { UserInfo } from "@/components/dashboard/UserInfo";
import { WorkHourTarget } from "@/components/dashboard/WorkHourTarget";
import EmployeeDashboardSkeleton from "@/components/skeleton/EmployeeDashboardSkeleton";
import { useEmployeeDashboard } from "@/hooks/useDashboard";
import { Calendar, Clock, Coffee, Timer, LayoutDashboard } from "lucide-react";

export default function EmployeeDashboard() {
  const currentMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  const formatMinutes = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const { data, isLoading, error } = useEmployeeDashboard();
  const stats = data?.personal_stats;
  console.log(data?.logs?.leave);

  if (isLoading) {
    return (
      <>
        <PageMeta title="Loading Dashboard..." />
        <EmployeeDashboardSkeleton />
      </>
    );
  }
  if (error) {
    return (
      <>
        <PageMeta title="HRIS Dashboard" />
        <div className="p-4 text-red-500">Failed to load dashboard data.</div>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Employee Dashboard" />

      {/* Header section biar gak sepi */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Employee Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Welcome back, {data?.profile?.name ?? "Employee"}. Check
            your attendance summary for today.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white p-1.5 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="bg-blue-600 p-1.5 rounded-md text-white">
            <LayoutDashboard size={18} />
          </div>
          <span className="px-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            {currentMonth}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content (Left) */}
        <div className="col-span-12 space-y-6 xl:col-span-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            <StatCard
              title="Leave Balance"
              value={`${stats?.sisa_cuti ?? 0} Days`}
              subtitle={`Ends 31 Dec ${new Date().getFullYear()}`}
              icon={Coffee}
              color="bg-emerald-500"
            />

            {/* 2. Attendance */}
            <StatCard
              title="Attendance"
              value={`${stats?.kehadiran_bulan_ini ?? 0} Days`}
              subtitle={`Total present in ${currentMonth}`}
              icon={Calendar}
              color="bg-blue-500"
            />

            {/* 3. Total Terlambat */}
            <StatCard
              title="Total Late"
              value={`${stats?.total_terlambat ?? 0}x`}
              subtitle="Late frequency this month"
              icon={Clock}
              color="bg-rose-500"
            />

            {/* 4. Total Lembur */}
            <StatCard
              title="Total Overtime"
              value={formatMinutes(stats?.total_menit_lembur ?? 0)}
              subtitle="Total duration approved"
              icon={Timer}
              color="bg-indigo-500"
            />
          </div>

          {/* Chart */}
          <AttendanceYearlyChart data={data?.yearly_attendance_chart} />

          {/* Activity Log - Sekarang ada di bawah Chart */}
          <ActivityLog leaveLogs={data?.logs?.leave ?? []} />
          <OvertimeLog overtimeLogs={data?.logs?.overtime ?? []} />
        </div>

        {/* Sidebar (Right) */}
        <div className="col-span-12 space-y-6 xl:col-span-4">
          <UserInfo
            profileData={data?.profile}
            pendingData={data?.pending_requests}
          />
          <SalaryHistory salaryLogs={data?.logs?.salary ?? []} />

          {/* Target Jam Kerja Card */}
          <WorkHourTarget
            totalKerja={data?.personal_stats?.total_menit_kerja}
            targetMenit={10800}
          />
        </div>
      </div>
    </>
  );
}
