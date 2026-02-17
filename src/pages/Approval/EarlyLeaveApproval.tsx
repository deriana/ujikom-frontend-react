import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import EarlyLeavesApprovalTable from "@/components/tables/Approval/EarlyLeaveApprovalTable";

export default function EarlyLeaveApproval() {
  return (
    <>
      <PageMeta title="Early Approval" />
      <PageBreadcrumb pageTitle="Early Leave Approval" />
      <div className="space-y-6">
        <ComponentCard title="Early Leave Approval Page">
            <EarlyLeavesApprovalTable />
        </ComponentCard>
      </div>
    </>
  );
}
