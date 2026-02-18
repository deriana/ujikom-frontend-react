import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import LeavesApprovalTable from "@/components/tables/Approval/LeaveApprovalTable";

export default function LeaveApproval() {
  return (
    <>
      <PageMeta title="Leave Approval" />
      <PageBreadcrumb pageTitle="Leave Approval" />
      <div className="space-y-6">
        <ComponentCard title="Leave Approval Page">
            <LeavesApprovalTable />
        </ComponentCard>
      </div>
    </>
  );
}
