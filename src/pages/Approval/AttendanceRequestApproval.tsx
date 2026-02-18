import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import AttendanceRequestsApprovalTable from "@/components/tables/Approval/AttendanceRequestApprovalTable";

export default function AttendanceRequestApproval() {
  return (
    <>
      <PageMeta title="Attendance Request Approval" />
      <PageBreadcrumb pageTitle="Attendance Request Approval" />
      <div className="space-y-6">
        <ComponentCard title="Attendance Request Approval Page">
            <AttendanceRequestsApprovalTable />
        </ComponentCard>
      </div>
    </>
  );
}
