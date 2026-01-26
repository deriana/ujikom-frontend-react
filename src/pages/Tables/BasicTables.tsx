import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import UsersTable from "@/components/tables/BasicTables/UsersTable";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="Frieren - Basic Tables"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="space-y-6">
        <ComponentCard title="Users Page">
          {/* <BasicTableOne /> */}
          <UsersTable />
        </ComponentCard>
      </div>
    </>
  );
}
