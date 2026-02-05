import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import AllowanceTable from "@/components/tables/Allowances/AllowancesTable";

export default function Allowances() {
  return (
    <>
      <PageMeta title="Allowances" />
      <PageBreadcrumb pageTitle="Allowances" />
      <div className="space-y-6">
        <ComponentCard title="Allowances Page">
            <AllowanceTable />
        </ComponentCard>
      </div>
    </>
  );
}
