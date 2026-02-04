import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import DivisionTableTrash from "@/components/tables/Divisions/DivisionsTableTrash";

export default function DivisionsTrash() {
  return (
    <>
      <PageMeta title="Divisions Trash" />
      <PageBreadcrumb
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Trash", href: "/trash" },
          { name: "Divisions" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="Divisions Trash Page">
          <DivisionTableTrash />
        </ComponentCard>
      </div>
    </>
  );
}
