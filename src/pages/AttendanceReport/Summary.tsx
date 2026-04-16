import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import AttendanceSummaryTable from "@/components/tables/Attendance/AttendanceSummaryTable";

export default function AttendanceSummary() {
  return (
    <>
      <PageMeta title="Attendance Summary" />
      <PageBreadcrumb pageTitle="Attendance Summary" />

      <div className="space-y-6">
        <ComponentCard
          title="Attendance Summary Recap"
          desc="Comprehensive overview of employee attendance performance, work hours, and punctuality."
        >
          <AttendanceSummaryTable />
        </ComponentCard>
      </div>
    </>
  );
}
