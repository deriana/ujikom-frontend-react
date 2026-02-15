import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import EarlyLeavesTable from "@/components/tables/EarlyLeaves/EarlyLeavesTable";

export default function EarlyLeaves() {
  return (
    <>
      <PageMeta title="Early Leaves" />
      <PageBreadcrumb pageTitle="Early Leaves" />
      <div className="space-y-6">
        <ComponentCard title="Early Leaves Page">
            <EarlyLeavesTable />
        </ComponentCard>
      </div>
    </>
  );
}
