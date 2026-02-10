import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import AttendanceTable from "@/components/tables/Attendance/AttendanceTable";

export default function AttendancesReport() {
  return (
    <>
      <PageMeta title="Attendances" />
      <PageBreadcrumb pageTitle="Attendances" />

      <div className="space-y-6">
        <ComponentCard title="Attendances Page">
          <AttendanceTable />
        </ComponentCard>
      </div>
    </>
  );
}
