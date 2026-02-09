import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import UsersTrashTable from "@/components/tables/Users/UsersTableTrash";

export default function UsersTrash() {
  return (
    <>
      <PageMeta title="Users Trash" />
      <PageBreadcrumb
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Trash", href: "/trash" },
          { name: "Users" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="Users Trash Page">
          <UsersTrashTable />
        </ComponentCard>
      </div>
    </>
  );
}
