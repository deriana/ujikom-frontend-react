import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import PositionsTableTrash from "@/components/tables/Positions/PositionsTableTrash";

export default function PositionsTrash() {
  return (
    <>
      <PageMeta title="Positions Trash" />
      <PageBreadcrumb
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Trash", href: "/trash" },
          { name: "Positions" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="Positions Trash Page">
          <PositionsTableTrash />
        </ComponentCard>
      </div>
    </>
  );
}
