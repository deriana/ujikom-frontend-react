import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import PointTable from "@/components/tables/Point/PointTable";

export default function PointLog() {
  return (
    <>
      <PageMeta title="Point" />
      <PageBreadcrumb pageTitle="Point" />
      <div className="space-y-6">
        <ComponentCard title="Point Page">
            <PointTable />
        </ComponentCard>
      </div>
    </>
  );
}
