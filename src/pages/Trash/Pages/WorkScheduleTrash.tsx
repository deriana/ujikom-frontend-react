import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import WorkScheduleTableTrash from "@/components/tables/WorkSchedules/WorkScheduleTableTrash";

export default function WorkScheduleTrash() {
  return (
    <>
      <PageMeta title="WorkSchedule Trash" />
      <PageBreadcrumb
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Trash", href: "/trash" },
          { name: "Work Schedule" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="WorkSchedule Trash Page">
          <WorkScheduleTableTrash />
        </ComponentCard>
      </div>
    </>
  );
}
