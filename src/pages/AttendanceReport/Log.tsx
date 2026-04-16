import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import AttendanceLogTable from "@/components/tables/Attendance/AttendanceLogTable";

export default function AttendanceLogs() {
  return (
    <>
      <PageMeta title="Attendance Logs" />
      <PageBreadcrumb pageTitle="Attendance Logs" />

      <div className="space-y-6">
        <ComponentCard
          title="Attendance Activity Logs"
          desc="Monitor real-time attendance activities, including location tracking and device metadata."
        >
          <AttendanceLogTable />
        </ComponentCard>
      </div>
    </>
  );
}
