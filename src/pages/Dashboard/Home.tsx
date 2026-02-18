import PageMeta from "@/components/common/PageMeta";
import AttendanceTodayCard from "@/components/dashboard/AttendanceToday";
import EmployeeSummaryCards from "@/components/dashboard/EmployeeSummaryCard";
import LeaveOverviewCard from "@/components/dashboard/LeaveOverview";
import MonthlyAttendanceChart from "@/components/dashboard/MonthlyAttendanceChart";
import PendingApprovalCard from "@/components/dashboard/PendingApproval";
import RecentHRActivity from "@/components/dashboard/RecentHrActivity";

export default function Home() {
  return (
    <>
      <PageMeta title="HRIS Dashboard" />

      <div className="grid grid-cols-12 gap-4 md:gap-6">

        {/* Row 1 */}
        <div className="col-span-12 xl:col-span-8">
          <EmployeeSummaryCards />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <AttendanceTodayCard />
        </div>

        {/* Row 2 */}
        <div className="col-span-12">
          <MonthlyAttendanceChart />
        </div>

        {/* Row 3 */}
        <div className="col-span-12 xl:col-span-6">
          <LeaveOverviewCard />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <PendingApprovalCard />
        </div>

        {/* Row 4 */}
        <div className="col-span-12">
          <RecentHRActivity />
        </div>
      </div>
    </>
  );
}
