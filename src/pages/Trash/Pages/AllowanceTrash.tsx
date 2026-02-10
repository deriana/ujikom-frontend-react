import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import AllowanceTableTrash from "@/components/tables/Allowances/AllowancesTableTrash";

export default function AllowancesTrash() {
  return (
    <>
      <PageMeta title="Allowances Trash" />
      <PageBreadcrumb
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Trash", href: "/trash" },
          { name: "Allowances" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="Allowances Trash Page">
          <AllowanceTableTrash />
        </ComponentCard>
      </div>
    </>
  );
}
