import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { usePermissions } from "@/hooks/useRole";

export default function RolesCreate() {
    const {data: permission} = usePermissions();

    console.log(permission);

  return (
    <>
      <PageMeta title="Frieren - Roles | Create" description="apa yah ?" />
      <PageBreadcrumb pageTitle="Roles" />
      <div className="space-y-6">
        <ComponentCard title="Roles Page">
            <p>Ini Field</p>
        </ComponentCard>
      </div>
    </>
  );
}
