import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import WorkScheduleTable from "@/components/tables/WorkSchedules/WorkScheduleTable";

export default function WorkSchedules() {
  return (
    <>
      <PageMeta title="Work Schedules" />
      <PageBreadcrumb pageTitle="Work Schedules" />
      <div className="space-y-6">
        <ComponentCard title="Work Schedules Page">
          <WorkScheduleTable />
        </ComponentCard>
      </div>
    </>
  );
}
