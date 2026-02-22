import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDivisions } from "@/hooks/useDivision";
import { usePositions } from "@/hooks/usePosition";
import { useRoles } from "@/hooks/useRole";
import { useCreateUser, useGetManager } from "@/hooks/useUser";
import { useCrudPageForm } from "@/hooks/useCrudPageForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import Button from "@/components/ui/button/Button";
import UserField from "./Field";
import FormSkeleton from "@/components/skeleton/FormSkeleten";
import { UserInput } from "@/types";

export default function UsersCreate() {
  const navigate = useNavigate();

  const { data: roles } = useRoles();
  const { data: managers } = useGetManager();
  const { data: positions } = usePositions();
  const { data: divisions } = useDivisions();

  const { mutateAsync: createUser } = useCreateUser();

  const { form, setForm, submit, loading, initCreate } =
    useCrudPageForm<UserInput, UserInput>({
      label: "User",
      emptyForm: {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        is_active: true,
        role: "employee",
        team_uuid: undefined,
        position_uuid: undefined,
        manager_nik: undefined,
        employee_status: 3,
        contract_start: "",
        contract_end: null,
        base_salary: 0,
        phone: "",
        gender: undefined,
        date_of_birth: "",
        address: "",
        join_date: "",
        resign_date: null,
      },

      mapToPayload: (form) => form,

      validate: (form) => {
        if (!form.name.trim()) return "Name is required";
        if (!form.email.trim()) return "Email is required";
        // if (!form.password) return "Password is required";
        // if (form.password !== form.password_confirmation)
        //   return "Passwords do not match";
        if (form.employee_status == null)
          return "Employee status is required";
        return null;
      },

      createFn: createUser,
      updateFn: async () => Promise.resolve(),
      redirectPath: "/users",
    });

  // Pastikan form terisi saat pertama kali buka halaman
  useEffect(() => {
    if (!form) initCreate();
  }, [form, initCreate]);

  const isPageLoading =
    !roles || !positions || !divisions || !managers || !form;

  if (isPageLoading) {
    return (
      <>
        <PageMeta title="Create User" />
        <PageBreadcrumb
          crumbs={[
            { name: "Home", href: "/" },
            { name: "Users", href: "/users" },
            { name: "Create" },
          ]}
        />
        <ComponentCard title="Create Employee">
          <FormSkeleton
            fields={[
              { type: "input" },
              { type: "input" },
              { type: "select" },
              { type: "select" },
              { type: "input" },
            ]}
          />
        </ComponentCard>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Create User" />
      <PageBreadcrumb
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Users", href: "/users" },
          { name: "Create" },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Create Employee">
          <UserField
            value={form}
            onChange={setForm}
            roles={roles}
            positions={positions}
            divisions={divisions}
            managers={managers}
          />

          <div className="flex justify-end mt-6 gap-3">
            <Button variant="danger" onClick={() => navigate("/users")}>
              Cancel
            </Button>

            <Button onClick={submit} disabled={loading}>
              {loading ? "Saving..." : "Create User"}
            </Button>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
