import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import PageMeta from "@/components/common/PageMeta";
import UserField from "./Field";
import { useDivisions } from "@/hooks/useDivision";
import { usePositions } from "@/hooks/usePosition";
import { useRoles } from "@/hooks/useRole";
import { useGetManager, useUpdateUser, useUserByUuid } from "@/hooks/useUser";
import { UserInput } from "@/types";
import FormSkeleton from "@/components/skeleton/FormSkeleten";
import { useCrudPageForm } from "@/hooks/useCrudPageForm";

function mapUserToForm(u: any): UserInput {
  return {
    name: u.name ?? "",
    email: u.email ?? "",
    password: "",
    password_confirmation: "",
    is_active: !!u.employee?.employment_state,
    role: u.roles?.[0] ?? "",
    team_uuid: u.employee?.team?.uuid ?? "",
    position_uuid: u.employee?.position?.uuid ?? "",
    manager_nik: u.employee?.manager?.nik ?? "",
    employee_status: u.employee?.status ?? undefined,
    contract_start: u.employee?.contract_start ?? "",
    contract_end: u.employee?.contract_end ?? "",
    base_salary: u.employee?.base_salary
      ? parseFloat(u.employee.base_salary)
      : undefined,
    phone: u.employee?.phone ?? "",
    gender: u.employee?.gender ?? undefined,
    date_of_birth: u.employee?.date_of_birth ?? "",
    address: u.employee?.address ?? "",
    join_date: u.employee?.join_date ?? "",
    resign_date: u.employee?.resign_date ?? "",
  };
}


export default function UsersUpdate() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  const { data: roles } = useRoles();
  const { data: managers } = useGetManager();
  const { data: positions } = usePositions();
  const { data: divisions } = useDivisions();
  const { data: userFromApi, isLoading: isFetchingUser } = useUserByUuid(uuid || "");
  const { mutateAsync: updateUser } = useUpdateUser();

  const { form, setForm, hydrate, submit, loading } =
    useCrudPageForm<UserInput, UserInput, string>({
      label: "User",
      emptyForm: {} as UserInput, // tidak dipakai di edit
      mapToPayload: (f) => f,
      updateFn: (id, payload) => updateUser({ uuid: id, data: payload }),
      createFn: async () => { throw new Error("Not allowed"); },
      getId: () => uuid || "",
      redirectPath: "/users",
    });

  // 🔥 Hydrate HANYA dari user API
  useEffect(() => {
    if (userFromApi) {
      hydrate(mapUserToForm(userFromApi));
    }
  }, [userFromApi, hydrate]);

  // 🔥 Loading guard SEKARANG BENAR
  if (
    isFetchingUser ||
    !roles ||
    !positions ||
    !divisions ||
    !managers ||
    !form
  ) {
    return (
      <>
        <PageMeta title="Update User" />
        <PageBreadcrumb
          crumbs={[
            { name: "Home", href: "/" },
            { name: "Users", href: "/users" },
            { name: "Edit" },
          ]}
        />
        <ComponentCard title="Edit User">
          <FormSkeleton fields={[{ type: "input" }, { type: "select" }]} />
        </ComponentCard>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Update User" />
      <PageBreadcrumb
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Users", href: "/users" },
          { name: "Edit" },
        ]}
      />
      <ComponentCard title="Edit User">
        <UserField
          value={form}
          onChange={setForm}
          roles={roles}
          managers={managers}
          positions={positions}
          divisions={divisions}
        />

        <div className="flex justify-end mt-6">
          <Button
            className="mr-5"
            onClick={() => navigate("/users")}
            variant="danger"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={loading}>
            {loading ? "Updating..." : "Update User"}
          </Button>
        </div>
      </ComponentCard>
    </>
  );
}
