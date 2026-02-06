import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import Spinner from "@/components/ui/loading/Spinner";
import Button from "@/components/ui/button/Button";
import RoleField from "./Field";
import { usePermissions, useCreateRole } from "@/hooks/useRole";
import { useCrudPageForm } from "@/hooks/useCrudPageForm";
import { RoleInput } from "@/types/role.types";

export default function RolesCreate() {
  const { data: modules } = usePermissions();
  const { mutateAsync: createRole } = useCreateRole();

  const { form, setForm, submit, loading } = useCrudPageForm<RoleInput, RoleInput>({
    label: "Role",
    emptyForm: {
      name: "",
      permissions: [],
    },

    mapToPayload: (form) => form,

    validate: (form) => {
      if (!form.name.trim()) return "Role name is required";
      if (form.permissions.length === 0) return "Select at least one permission";
      return null;
    },

    createFn: createRole,
    updateFn: async () => Promise.resolve(),
    redirectPath: "/roles",
  });

  if (!modules) return <Spinner />;

  return (
    <>
      <PageMeta title="Create Role" />
      <PageBreadcrumb
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Roles", href: "/roles" },
          { name: "Create" },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Create Role">
          <RoleField
            value={form}
            onChange={setForm}
            modules={modules}
          />

          <div className="flex justify-end mt-6 gap-3">
            <Button variant="danger" onClick={() => history.back()}>
              Cancel
            </Button>

            <Button onClick={submit} disabled={loading}>
              {loading ? "Saving..." : "Create Role"}
            </Button>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
