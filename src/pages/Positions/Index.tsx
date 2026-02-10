import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import PositionsTable from "@/components/tables/Positions/PositionsTable";

export default function Positions() {
  return (
    <>
      <PageMeta title="Positions" />
      <PageBreadcrumb pageTitle="Positions" />
      <div className="space-y-6">
        <ComponentCard title="Positions Page">
            <PositionsTable />
        </ComponentCard>
      </div>
    </>
  );
}
