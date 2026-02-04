import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RoleField from "./Field";
import Spinner from "@/components/ui/loading/Spinner";
import Button from "@/components/ui/button/Button";
import toast from "react-hot-toast";
import { usePermissions, useRoleById, useUpdateRole } from "@/hooks/useRole";
import { RoleInput } from "@/types/role.types";
import PageMeta from "@/components/common/PageMeta";

export default function RolesUpdate() {
  const { id } = useParams<{ id: string }>();
  const roleId = Number(id);

  const { data: modules } = usePermissions();
  const { data: roleDataFromApi, isLoading: isFetchingRole } =
    useRoleById(roleId);
  const { mutateAsync: updateRole } = useUpdateRole();

  const [isLoading, setIsLoading] = useState(false);
  const [roleData, setRoleData] = useState<RoleInput>({
    name: "",
    permissions: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (roleDataFromApi) {
      setRoleData({
        name: roleDataFromApi.name,
        permissions: roleDataFromApi.permissions.map((p: any) => Number(p.id)),
      });
    }
  }, [roleDataFromApi]);

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
      await updateRole({ id: roleId, data: roleData });
      toast.success("Role updated successfully!");
      navigate("/roles");
    } catch (err: any) {
      toast.error(err?.message.message || "Failed to update role");
    } finally {
      setIsLoading(false);
    }
  };

  if (!modules || isFetchingRole || !roleDataFromApi) return <Spinner />;

  return (
    <>
      <PageMeta title="Update" />
      <PageBreadcrumb
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Roles", href: "/roles" },
          { name: "Edit" },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Edit Role">
          <RoleField
            value={roleData}
            onChange={setRoleData}
            modules={modules}
            disabled={roleDataFromApi.system_reserve}
          />

          <div className="flex justify-end mt-6">
            <Button
              className="mr-5"
              onClick={() => navigate("/roles")}
              disabled={isLoading}
              variant="danger"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Role"}
            </Button>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
