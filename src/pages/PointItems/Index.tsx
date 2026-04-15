import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import PointItemTable from "@/components/tables/Point/PointItemTable";

export default function PointItems() {
  return (
    <>
      <PageMeta title="Point Items" />
      <PageBreadcrumb pageTitle="Point Items" />
      <div className="space-y-6">
        <ComponentCard title="Point Items Page">
            <PointItemTable />
        </ComponentCard>
      </div>
    </>
  );
}
