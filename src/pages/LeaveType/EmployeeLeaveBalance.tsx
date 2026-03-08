import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import EmployeeLeaveBalancesTable from "@/components/tables/LeaveType/EmployeeLeaveBalancesTable";

export default function EmployeeLeaveBalances() {
  return (
    <>
      <PageMeta title="Employee Leava Balances" />
      <PageBreadcrumb pageTitle="Employee Leava Balances" />
      <div className="space-y-6">
        <ComponentCard title="Employee Leava Balances Page">
            <EmployeeLeaveBalancesTable />
        </ComponentCard>
      </div>
    </>
  );
}
