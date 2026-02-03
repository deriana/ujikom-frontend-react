import { Column } from "@/types";
import { Role } from "@/types/role.types";
import { DataTable } from "@/components/tables/BasicTables/DataTable";
import TableActions from "@/components/tables/BasicTables/TableAction";
import Badge from "@/components/ui/badge/Badge";
import toast from "react-hot-toast";
import { useDeleteRole, useRoles } from "@/hooks/useRole";
import { useNavigate } from "react-router-dom";

export default function RolesTable() {
  const { data: roles = [], isLoading, isError, error } = useRoles();
  const { mutate: deleteRole } = useDeleteRole();

  console.log(roles);

  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/roles/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id);
        toast.success("Role Deleted Successfully!");
    } catch (err: any) {
      console.error(err);
        toast.error("Failed Delete Role: " + (err?.message || "Unknown error"));
    }
  };

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
      data={roles}
      columns={columns}
      searchableKeys={["name"]}
      loading={isLoading}
      handleCreate={handleCreate}
    />
  );
}
