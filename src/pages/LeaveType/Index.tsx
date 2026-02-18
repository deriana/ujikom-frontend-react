import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import LeaveTypesTable from "@/components/tables/LeaveType/LeaveTypeTable";

export default function LeaveTypes() {
  return (
    <>
      <PageMeta title="Leave Types" />
      <PageBreadcrumb pageTitle="Leave Types" />
      <div className="space-y-6">
        <ComponentCard title="Leave Types Page">
            <LeaveTypesTable />
        </ComponentCard>
      </div>
    </>
  );
}
