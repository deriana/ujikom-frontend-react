import { Column } from "@/types";
import { User } from "@/types/user.types";
import { DataTable } from "@/components/tables/BasicTables/DataTable";
import TableActions from "@/components/tables/BasicTables/TableAction";
import { useDeleteUser, useUsers } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import { RESOURCES } from "@/constants/Resource";
import { handleMutation } from "@/utils/handleMutation";
import { useMemo, useState } from "react";
import FilterDropdown from "@/components/FilterDropdown";

export default function UsersTable() {
  const { data: users = [], isLoading, isError, error } = useUsers();
  const { mutateAsync: deleteUser } = useDeleteUser();
  const [roleFilter, setRoleFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  console.log(users);

  const roleOptions = useMemo(() => {
    const roles = Array.from(new Set(users.flatMap((u) => u.roles || [])));
    return [
      { label: "All Roles", value: "all" },
      ...roles.map((r) => ({
        label: r.charAt(0).toUpperCase() + r.slice(1),
        value: r,
      })),
    ];
  }, [users]);

  const teamOptions = useMemo(() => {
    const teams = Array.from(
      new Set(users.map((u) => u.employee?.team?.name).filter(Boolean)),
    );
    return [
      { label: "All Teams", value: "all" },
      ...teams.map((t) => ({ label: t!, value: t! })),
    ];
  }, [users]);

  const divisionOptions = useMemo(() => {
    const divisions = Array.from(
      new Set(users.map((u) => u.employee?.team?.division).filter(Boolean)),
    );
    return [
      { label: "All Divisions", value: "all" },
      ...divisions.map((d) => ({ label: d!, value: d! })),
    ];
  }, [users]);

  const positionOptions = useMemo(() => {
    const positions = Array.from(
      new Set(users.map((u) => u.employee?.position?.name).filter(Boolean)),
    );
    return [
      { label: "All Positions", value: "all" },
      ...positions.map((p) => ({ label: p!, value: p! })),
    ];
  }, [users]);

  const navigate = useNavigate();

  const handleEdit = (uuid: string) => {
    navigate(`/users/${uuid}/edit`);
  };

  const handleShow = (uuid: string) => {
    navigate(`/users/${uuid}/show`);
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteUser(uuid), {
      loading: "Deleting user...",
      success: "User deleted successfully",
      error: "Failed to delete user",
    });

  const handleCreate = () => {
    navigate("/users/create");
  };

  const columns: Column<User>[] = [
    {
      header: "Employee Name",
      render: (row) => (
        <span className="font-medium text-gray-800 capitalize dark:text-white/90">
          {row.name}
        </span>
      ),
    },
    {
      header: "Email",
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          {row.email}
        </span>
      ),
    },
    {
      header: "Role",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.roles?.map((role: string) => (
            <span
              key={role}
              className="px-2 py-1 text-xs capitalize rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
            >
              {role}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "NIK",
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          {row.employee?.nik || "-"}
        </span>
      ),
    },
    {
      header: "Position",
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          {row.employee?.position?.name || "-"}
        </span>
      ),
    },
    {
      header: "Team",
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          {row.employee?.team?.name || "-"}
        </span>
      ),
    },
    {
      header: "Division",
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          {row.employee?.team?.division || "-"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <TableActions
          id={row.uuid}
          dataName={row.name}
          onShow={handleShow}
          onEdit={handleEdit}
          onDelete={handleDelete}
          baseNamePermission={RESOURCES.USER}
        />
      ),
    },
  ];

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load users: {(error as Error).message}
      </div>
    );
  }

  return (
    <DataTable
      tableTitle="Users Table"
      data={users}
      columns={columns}
      searchableKeys={[
        "name",
        "email",
        "employee.nik",
        "employee.position.name",
        "employee.team.name",
        "employee.team.division",
      ]}
      loading={isLoading}
      handleCreate={handleCreate}
      label="Users"
      baseNamePermission={RESOURCES.USER}
      newFilterComponent={
        <>
          <FilterDropdown
            value={roleFilter}
            options={roleOptions}
            onChange={setRoleFilter}
          />
          <FilterDropdown
            value={teamFilter}
            options={teamOptions}
            onChange={setTeamFilter}
          />
          <FilterDropdown
            value={divisionFilter}
            options={divisionOptions}
            onChange={setDivisionFilter}
          />
          <FilterDropdown
            value={positionFilter}
            options={positionOptions}
            onChange={setPositionFilter}
          />
        </>
      }
      extraFilters={{
        roles: roleFilter,
        "employee.team.name": teamFilter,
        "employee.team.division": divisionFilter,
        "employee.position.name": positionFilter,
      }}
    />
  );
}
