import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import AttendanceRequestsTable from "@/components/tables/AttendanceRequests/AttendanceRequestTable";

export default function AttendancRequests() {
  return (
    <>
      <PageMeta title="Attendance Requests" />
      <PageBreadcrumb pageTitle="Attendance Requests" />
      <div className="space-y-6">
        <ComponentCard title="Attendance Requests Page">
            <AttendanceRequestsTable />
        </ComponentCard>
      </div>
    </>
  );
}
