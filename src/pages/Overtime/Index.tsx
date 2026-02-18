import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import OvertimesTable from "@/components/tables/Overtime/OvertimeTable";

export default function Overtime() {
  return (
    <>
      <PageMeta title="Overtime" />
      <PageBreadcrumb pageTitle="Overtime" />
      <div className="space-y-6">
        <ComponentCard title="Overtime Page">
            <OvertimesTable />
        </ComponentCard>
      </div>
    </>
  );
}
