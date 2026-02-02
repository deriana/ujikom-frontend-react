import Badge from "@/components/ui/badge/Badge";
import { Column, User } from "@/types";
import { DataTable } from "./BasicTables/DataTable";
import TableActions from "./BasicTables/TableAction";
import { useEffect, useMemo, useState } from "react";
import FilterDropdown from "@/components/FilterDropdown";
import { usersDummy } from "./BasicTables/DummyUsers";
import toast from "react-hot-toast";

export default function UsersTable() {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");

  const roleOptions = useMemo(() => {
    const roles = Array.from(
      new Set(usersData.map((u) => u.role).filter(Boolean)),
    );

    return [
      { label: "All Roles", value: "all" },
      ...roles.map((r) => ({ label: r!, value: r! })),
    ];
  }, [usersData]);

  const projectOptions = useMemo(() => {
    const projects = Array.from(
      new Set(usersData.map((u) => u.projectName).filter(Boolean)),
    );

    return [
      { label: "All Projects", value: "all" },
      ...projects.map((p) => ({ label: p!, value: p! })),
    ];
  }, [usersData]);

  const filteredUsers = useMemo(() => {
    const roleVal = roleFilter.toLowerCase();
    const projectVal = projectFilter.toLowerCase();

    return usersData.filter((user) => {
      const userRole = user.role?.toLowerCase() || "";
      const userProject = user.projectName?.toLowerCase() || "";

      const matchRole = roleVal === "all" || userRole.includes(roleVal);
      const matchProject =
        projectVal === "all" || userProject.includes(projectVal);

      return matchRole && matchProject;
    });
  }, [usersData, roleFilter, projectFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUsersData(usersDummy);
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleShow = (id: number) => {
    alert(`Show user with ID: ${id}`);
  };

  const handleEdit = (id: number) => {
    toast.success(`User ${id} berhasil diperbarui`);
  };

  const handleDelete = async (id: number) => {
    try {
      setUsersData((prev) => prev.filter((user) => user.id !== id));

      toast.success("User berhasil dihapus");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus user");
    }
  };

  const handleCreate = () => {
    toast.success("User berhasil dibuat");
  };

  const columns: Column<User>[] = [
    {
      header: "User",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.image} className="w-10 h-10 rounded-full" />
          <div>
            <div>
              {" "}
              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {row.name}
              </span>
            </div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      render: (row) => (
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-gray-500">
          {row.role}
        </span>
      ),
    },
    {
      header: "Project",
      render: (row) => (
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-gray-500">
          {row.projectName}
        </span>
      ),
    },
    {
      header: "Budget",
      render: (row) => (
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-gray-500">
          {row.budget}
        </span>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <Badge
          size="sm"
          color={
            row.status === "Active"
              ? "success"
              : row.status === "Pending"
                ? "warning"
                : "error"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <TableActions
          id={row.id}
          dataName={row.name}
          onShow={handleShow}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={filteredUsers}
      columns={columns}
      searchableKeys={["name", "email", "projectName", "role"]}
      loading={loading}
      handleCreate={handleCreate}
      statusConfig={{
        key: "status",
        options: [
          { label: "Active", value: "Active" },
          { label: "Pending", value: "Pending" },
          { label: "Cancel", value: "Cancel" },
        ],
      }}
      newFilterComponent={
        <>
          <FilterDropdown
            value={roleFilter}
            options={roleOptions}
            onChange={(val) => setRoleFilter(val)}
          />
          <FilterDropdown
            value={projectFilter}
            options={projectOptions}
            onChange={(val) => setProjectFilter(val)}
          />
        </>
      }
    />
  );
}
