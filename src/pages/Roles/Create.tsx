import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import Button from "@/components/ui/button/Button";
import RoleField from "./Field";
import FormSkeleton from "@/components/skeleton/FormSkeleten";
import { usePermissions, useCreateRole } from "@/hooks/useRole";
import { useCrudPageForm } from "@/hooks/useCrudPageForm";
import { RoleInput } from "@/types/role.types";

export default function RolesCreate() {
  const navigate = useNavigate();
  const { data: modules } = usePermissions();
  const { mutateAsync: createRole } = useCreateRole();

  const { form, setForm, submit, loading, initCreate } =
    useCrudPageForm<RoleInput, RoleInput>({
      label: "Role",
      emptyForm: {
        name: "",
        permissions: [],
      },

      mapToPayload: (form) => form,

      validate: (form) => {
        if (!form.name.trim()) return "Role name is required";
        if (form.permissions.length === 0)
          return "Select at least one permission";
        return null;
      },

      createFn: createRole,
      updateFn: async () => Promise.resolve(),
      redirectPath: "/roles",
    });

  // ✅ Set form awal sekali saat halaman dibuka
  useEffect(() => {
    if (!form) initCreate();
  }, [form, initCreate]);

  const isPageLoading = !modules || !form;

  if (isPageLoading) {
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
        <ComponentCard title="Create Role">
          <FormSkeleton
            fields={[
              { type: "input" },
              { type: "select" },
              { type: "select" },
            ]}
          />
        </ComponentCard>
      </>
    );
  }

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
          <RoleField value={form} onChange={setForm} modules={modules} />

          <div className="flex justify-end mt-6 gap-3">
            <Button variant="danger" onClick={() => navigate("/roles")}>
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
