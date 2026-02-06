import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RoleField from "./Field";
import Spinner from "@/components/ui/loading/Spinner";
import Button from "@/components/ui/button/Button";
import { usePermissions, useRoleById, useUpdateRole } from "@/hooks/useRole";
import { RoleInput } from "@/types/role.types";
import PageMeta from "@/components/common/PageMeta";
import { useCrudPageForm } from "@/hooks/useCrudPageForm"; 

export default function RolesUpdate() {
  const { id } = useParams<{ id: string }>();
  const roleId = Number(id);

  const { data: modules } = usePermissions();
  const { data: roleFromApi, isLoading: isFetchingRole } = useRoleById(roleId);
  const { mutateAsync: updateRole } = useUpdateRole();
  const navigate = useNavigate();

  const { form, setForm, submit, loading } =
    useCrudPageForm<RoleInput, RoleInput, number>({
      label: "Role",
      emptyForm: {
        name: "",
        permissions: [],
      },

      mapToPayload: (f) => f,

      validate: (f) => {
        if (!f.name.trim()) return "Role name is required";
        if (f.permissions.length === 0)
          return "Please select at least one permission";
        return null;
      },

      createFn: async () => {
        throw new Error("Create not allowed on update page");
      },

      updateFn: (id, payload) => updateRole({ id, data: payload }),

      getId: () => roleId, 
      redirectPath: "/roles",
    });

  useEffect(() => {
    if (roleFromApi) {
      setForm({
        name: roleFromApi.name,
        permissions: roleFromApi.permissions.map((p: any) => Number(p.id)),
      });
    }
  }, [roleFromApi, setForm]);

  if (!modules || isFetchingRole || !roleFromApi) return <Spinner />;

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
            value={form}
            onChange={setForm}
            modules={modules}
            disabled={roleFromApi.system_reserve}
          />

          <div className="flex justify-end mt-6">
            <Button
              className="mr-5"
              onClick={() => navigate("/roles")}
              disabled={loading}
              variant="danger"
            >
              Cancel
            </Button>
            <Button onClick={submit} disabled={loading}>
              {loading ? "Updating..." : "Update Role"}
            </Button>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
