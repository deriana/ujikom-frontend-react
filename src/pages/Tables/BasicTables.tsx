import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import UsersTable from "@/components/tables/UsersTable";

export default function BasicTables() {
  return (
    <>
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="space-y-6">
        <ComponentCard title="Users Page">
          <UsersTable />
        </ComponentCard>
      </div>
    </>
  );
}
