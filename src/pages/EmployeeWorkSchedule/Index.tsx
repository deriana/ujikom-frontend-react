import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import EmployeeWorkScheduleTable from "@/components/tables/EmployeeWorkSchedule/EmployeeWorkScheduleTable";

export default function EmployeeWorkSchedule() {
  return (
    <>
      <PageMeta title="EmployeeWorkSchedule" />
      <PageBreadcrumb pageTitle="EmployeeWorkSchedule" />
      <div className="space-y-6">
        <ComponentCard title="EmployeeWorkSchedule Page">
            <EmployeeWorkScheduleTable />
        </ComponentCard>
      </div>
    </>
  );
}
