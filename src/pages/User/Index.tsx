import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import UsersTable from "@/components/tables/Users/UsersTable";

export default function Users() {
  return (
    <>
      <PageMeta title="Users" />
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <ComponentCard title="Users Page">
            <UsersTable />
        </ComponentCard>
      </div>
    </>
  );
}
