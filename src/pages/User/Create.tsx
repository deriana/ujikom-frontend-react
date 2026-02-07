import { useDivisions } from "@/hooks/useDivision";
import { usePositions } from "@/hooks/usePosition";
import { useRoles } from "@/hooks/useRole";
import { useCreateUser, useGetManager } from "@/hooks/useUser";
import { useCrudPageForm } from "@/hooks/useCrudPageForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import Spinner from "@/components/ui/loading/Spinner";
import Button from "@/components/ui/button/Button";
import UserField from "./Field";
// import { UserInput } from "@/types/user.types";
import { UserInput } from "@/types";

export default function UsersCreate() {
  const { data: roles } = useRoles();
  const { data: managers } = useGetManager();
  const { data: positions } = usePositions();
  const { data: divisions } = useDivisions();

  const { mutateAsync: createUser } = useCreateUser();

  const { form, setForm, submit, loading } = useCrudPageForm<
    UserInput,
    UserInput
  >({
    label: "User",
    emptyForm: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      is_active: true,
      role: "employee", // default role
      team_uuid: undefined,
      position_uuid: undefined,
      manager_nik: undefined,
      employee_status: 3, // Probation
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
      if (form.password && form.password !== form.password_confirmation)
        return "Passwords do not match";
      if (form.employee_status === null || form.employee_status === undefined)
        return "Employee status is required";
      return null;
    },

    createFn: createUser,
    updateFn: async () => Promise.resolve(),
    redirectPath: "/users",
  });

  if (!roles || !positions || !divisions || !managers) return <Spinner />;

  return (
    <>
      <PageMeta title="Create User" />
      <PageBreadcrumb
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Users", href: "/users" },
          { name: "Create", href: "/users/create" },
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
            <Button variant="danger" onClick={() => history.back()}>
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
