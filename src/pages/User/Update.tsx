import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Spinner from "@/components/ui/loading/Spinner";
import Button from "@/components/ui/button/Button";
import PageMeta from "@/components/common/PageMeta";
import UserField from "./Field";
import { useDivisions } from "@/hooks/useDivision";
import { usePositions } from "@/hooks/usePosition";
import { useRoles } from "@/hooks/useRole";
import { useGetManager, useUpdateUser, useUserByUuid } from "@/hooks/useUser";
import { UserInput } from "@/types";
import FormSkeleton from "@/components/skeleton/FormSkeleten";

export default function UsersUpdate() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  // Dropdown data
  const { data: roles } = useRoles();
  const { data: managers } = useGetManager();
  const { data: positions } = usePositions();
  const { data: divisions } = useDivisions();

  // API user
  const { data: userFromApi } = useUserByUuid(uuid || "");
  const { mutateAsync: updateUser } = useUpdateUser();

  // Form state, null = belum siap
  const [form, setForm] = useState<UserInput | null>(null);

  // Set form ketika semua data sudah tersedia
  useEffect(() => {
    if (userFromApi && roles && positions && divisions && managers) {
      setForm({
        name: userFromApi.name || "",
        email: userFromApi.email || "",
        password: "",
        password_confirmation: "",
        is_active: !!userFromApi.employee.employment_state,
        role: userFromApi.roles?.[0] || "",
        team_uuid: userFromApi.employee.team?.uuid || "",
        position_uuid: userFromApi.employee.position?.uuid || "",
        manager_nik: userFromApi.employee.manager?.nik || "",
        employee_status: userFromApi.employee?.status ?? undefined,
        contract_start: userFromApi.employee.contract_start || "",
        contract_end: userFromApi.employee.contract_end || "",
        base_salary: parseFloat(userFromApi.employee.base_salary) ?? undefined,
        phone: userFromApi.employee.phone || "",
        gender: userFromApi.employee.gender || undefined,
        date_of_birth: userFromApi.employee.date_of_birth || "",
        address: userFromApi.employee.address || "",
        join_date: userFromApi.employee.join_date || "",
        resign_date: userFromApi.employee.resign_date || "",
      });
    }
  }, [userFromApi, roles, positions, divisions, managers]);

  // Submit handler
  const handleSubmit = async () => {
    if (!form) return;
    try {
      await updateUser({ uuid: uuid || "", data: form });
      navigate("/users");
    } catch (error) {
      console.error(error);
    }
  };

  const userFieldsSkeleton: any[] = [
    { type: "input" }, // Name
    { type: "select" }, // Gender
    { type: "input" }, // Phone
    { type: "date" }, // Date of Birth
    { type: "input" }, // Email
    { type: "input" }, // Password
    { type: "input" }, // Confirm Password
    { type: "textarea", rows: 3 }, // Address
  ];

  // Spinner jika form belum siap
  // Skeleton jika form belum siap
  if (form === null) {
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
        <div className="space-y-6">
          <ComponentCard title="Edit User">
            <FormSkeleton fields={userFieldsSkeleton} />
            <div className="flex justify-end mt-6 space-x-5">
              <div className="h-10 w-24 bg-gray-300 rounded"></div>
              <div className="h-10 w-32 bg-gray-300 rounded"></div>
            </div>
          </ComponentCard>
        </div>
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
      <div className="space-y-6">
        <ComponentCard title="Edit User">
          <UserField
            value={form}
            onChange={setForm}
            roles={roles!}
            managers={managers!}
            positions={positions!}
            divisions={divisions!}
          />
          <div className="flex justify-end mt-6">
            <Button
              className="mr-5"
              onClick={() => navigate("/users")}
              variant="danger"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Update User</Button>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
