import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import LeavesTable from "@/components/tables/Leaves/LeavesTable";

export default function Leave() {
  return (
    <>
      <PageMeta title="Leave" />
      <PageBreadcrumb pageTitle="Leave" />
      <div className="space-y-6">
        <ComponentCard title="Leave Page">
            <LeavesTable />
        </ComponentCard>
      </div>
    </>
  );
}
