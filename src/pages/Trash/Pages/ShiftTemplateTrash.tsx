import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import ShiftTemplateTableTrash from "@/components/tables/ShiftTemplates/ShiftTemplateTableTrash";

export default function ShiftTemplateTrash() {
  return (
    <>
      <PageMeta title="ShiftTemplate Trash" />
      <PageBreadcrumb
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Trash", href: "/trash" },
          { name: "ShiftTemplate" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="ShiftTemplate Trash Page">
          <ShiftTemplateTableTrash />
        </ComponentCard>
      </div>
    </>
  );
}
