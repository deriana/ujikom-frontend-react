import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useCreateRole, usePermissions } from "@/hooks/useRole";
import { useState } from "react";
import { RoleInput } from "@/types/role.types";
import RoleField from "./Field";
import Spinner from "@/components/ui/loading/Spinner";
import Button from "@/components/ui/button/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageMeta from "@/components/common/PageMeta";

export default function RolesCreate() {
  const { data: modules } = usePermissions();
  const { mutateAsync } = useCreateRole();
  const [isLoading, setIsLoading] = useState(false);
  const [roleData, setRoleData] = useState<RoleInput>({
    name: "",
    permissions: [],
  });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!roleData.name.trim()) {
      toast.error("Role name is required");
      return;
    }

    if (roleData.permissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    setIsLoading(true);

    try {
      await mutateAsync(roleData); 
      toast.success("Role created successfully!");
      setIsLoading(false);
      navigate("/roles");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create role");
    }
  };

  if (!modules) return <Spinner />;

  return (
    <>
    <PageMeta title="Roles - Create" description="Create new role" />
<PageBreadcrumb
  crumbs={[
    { name: "Home", href: "/" },
    { name: "Roles", href: "/roles" },
    { name: "Create" },
  ]}
/>

      <div className="space-y-6">
        <ComponentCard title="Roles Page">
          <RoleField
            modules={modules}
            initialData={roleData}
            onChange={setRoleData}
          />

          <div className="mt-4 flex justify-end">
            <Button
              variant="danger"
              className="mr-5"
              onClick={() => navigate("/roles")}
            >
              Back
            </Button>

            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Role"}
            </Button>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
