import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import PayrollsTable from "@/components/tables/Payroll/PayrollTable";

export default function Payroll() {
  return (
    <>
      <PageMeta title="Payroll" />
      <PageBreadcrumb pageTitle="Payroll" />
      <div className="space-y-6">
        <ComponentCard title="Payroll Page">
            <PayrollsTable />
        </ComponentCard>
      </div>
    </>
  );
}
