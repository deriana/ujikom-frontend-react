import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import RolesTable from "@/components/tables/Roles/RolesTable";

export default function Roles() {
  return (
    <>
      <PageMeta title="Roles" />
      <PageBreadcrumb pageTitle="Roles" />
      <div className="space-y-6">
        <ComponentCard title="Roles Page">
            <RolesTable />
        </ComponentCard>
      </div>
    </>
  );
}
