import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import EmployeeShiftsTable from "@/components/tables/EmployeeShift/EmployeeShiftTable";

export default function EmployeeShifts() {
  return (
    <>
      <PageMeta title="EmployeeShifts" />
      <PageBreadcrumb pageTitle="EmployeeShifts" />
      <div className="space-y-6">
        <ComponentCard title="EmployeeShifts Page">
            <EmployeeShiftsTable />
        </ComponentCard>
      </div>
    </>
  );
}
