import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import ShiftTemplatesTable from "@/components/tables/ShiftTemplates/ShiftTemplatesTable";

export default function ShiftTemplate() {
  return (
    <>
      <PageMeta title="ShiftTemplate" />
      <PageBreadcrumb pageTitle="ShiftTemplate" />
      <div className="space-y-6">
        <ComponentCard title="ShiftTemplate Page">
            <ShiftTemplatesTable />
        </ComponentCard>
      </div>
    </>
  );
}
