import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import DivisionTable from "@/components/tables/Divisions/DivisionsTable";

export default function Divisions() {
  return (
    <>
      <PageMeta title="Divisions" />
      <PageBreadcrumb pageTitle="Divisions" />
      <div className="space-y-6">
        <ComponentCard title="Divisions Page">
            <DivisionTable />
        </ComponentCard>
      </div>
    </>
  );
}
