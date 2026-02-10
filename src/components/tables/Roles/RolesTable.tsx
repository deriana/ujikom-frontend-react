import { Column } from "@/types";
import { Role } from "@/types/role.types";
import { DataTable } from "@/components/tables/BasicTables/DataTable";
import TableActions from "@/components/tables/BasicTables/TableAction";
import Badge from "@/components/ui/badge/Badge";
import { useDeleteRole, useRoles } from "@/hooks/useRole";
import { useNavigate } from "react-router-dom";
import { RESOURCES } from "@/constants/Resource";
import { handleMutation } from "@/utils/handleMutation";

export default function RolesTable() {
  const { data: roles = [], isLoading, isError, error } = useRoles();
  const { mutateAsync: deleteRole } = useDeleteRole();

  const navigate = useNavigate();


  const handleEdit = (id: number) => {
    navigate(`/roles/${id}/edit`);
  };

  const handleDelete = (id: number) =>
    handleMutation(() => deleteRole(id), {
      loading: "Deleting role...",
      success: "Role deleted successfully",
      error: "Failed to delete role",
    });

  const handleCreate = () => {
    navigate("/roles/create");
  };

  const columns: Column<Role>[] = [
    {
      header: "Role Name",
      render: (row) => (
        <span className="font-medium text-gray-800 capitalize dark:text-white/90">
          {row.name}
        </span>
      ),
    },
    {
      header: "System",
      render: (row) => (
        <Badge size="sm" color={row.system_reserve ? "warning" : "success"}>
          {row.system_reserve ? "System" : "Custom"}
        </Badge>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <TableActions
          id={row.id}
          dataName={row.name}
          onEdit={handleEdit}
          onDelete={handleDelete}
          baseNamePermission={RESOURCES.ROLE}
        />
      ),
    },
  ];

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load roles: {(error as Error).message}
      </div>
    );
  }

  return (
    <DataTable
      tableTitle="Roles Table"
      data={roles}
      columns={columns}
      searchableKeys={["name"]}
      loading={isLoading}
      handleCreate={handleCreate}
      label="Roles"
      baseNamePermission={RESOURCES.ROLE}
    />
  );
}
