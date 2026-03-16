import PageMeta from "@/components/common/PageMeta";
import AttendanceTodayCard from "@/components/dashboard/AttendanceToday";
import EmployeeSummaryCards from "@/components/dashboard/EmployeeSummaryCard";
import LeaveOverviewCard from "@/components/dashboard/LeaveOverview";
import MonthlyAttendanceChart from "@/components/dashboard/MonthlyAttendanceChart";
import PendingApprovalCard from "@/components/dashboard/PendingApproval";
import AdminDashboardSkeleton from "@/components/skeleton/AdminDashboardSkeleton";
import { useAdminDashboard } from "@/hooks/useDashboard";
import AttendanceMapCard from "@/components/dashboard/AttendanceMapCard";
import { useMemo, useState } from "react";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";
import PerformanceChart from "@/components/dashboard/PerformanceChart";

export default function AdminDashboard() {
  const today = useMemo(() => {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  }, []);
  const [selectedDate, setSelectedDate] = useState(today);

  const { data, isLoading, error } = useAdminDashboard(selectedDate);

  useNotificationPermission();

  if (isLoading) {
    return (
      <>
        <PageMeta title="HRIS Dashboard" />
        <AdminDashboardSkeleton />
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
      <PageMeta title="HRIS Dashboard" />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Row 1 */}
        <div className="col-span-12 xl:col-span-8">
          <EmployeeSummaryCards employeeData={data?.employee_stats} />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <AttendanceTodayCard attendanceData={data?.attendance_today} />
        </div>

        {/* Row 2 */}
        <div className="col-span-12">
          <MonthlyAttendanceChart
            chartData={data?.monthly_chart}
            onDateChange={(newDate) => setSelectedDate(newDate)}
          />
        </div>

        {/* Row 3 */}
        <div className="col-span-12 xl:col-span-6">
          <LeaveOverviewCard leaveSummary={data?.leave_summary} />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <PendingApprovalCard pendingTasks={data?.pending_tasks} />
        </div>

        {/* Performance Radar Charts */}
        <PerformanceChart performanceStats={data?.performance_stats} />

        {/* Row 4 */}
        <div className="col-span-12">
          <AttendanceMapCard locations={data?.map_locations} officeLocation={data?.office_location} />{" "}
        </div>
      </div>
    </>
  );
}
