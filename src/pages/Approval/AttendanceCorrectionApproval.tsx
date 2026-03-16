import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import AttendanceCorrectionApprovalTable from "@/components/tables/Attendance/AttendanceCorrectionApprovalTable";

export default function AttendanceCorrectionApproval() {
  return (
    <>
      <PageMeta title="Attendance Corrections Approval" />
      <PageBreadcrumb pageTitle="Attendance Corrections Approval" />
      <div className="space-y-6">
        <ComponentCard title="Attendance Corrections Approval Page">
            <AttendanceCorrectionApprovalTable />
        </ComponentCard>
      </div>
    </>
  );
}
