import {
  useCreateLeaveType,
  useDeleteLeaveType,
  useLeaveTypes,
  useUpdateLeaveType,
} from "@/hooks/useLeaveType";
import { Column, LeaveType, LeaveTypeInput } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useCrudModalForm } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import { Calendar, Mars, Users, Venus, VenusAndMars } from "lucide-react";
import LeaveTypeModal from "@/pages/LeaveType/Modal";

export default function LeaveTypesTable() {
  const { data: leaveTypes = [], isLoading, isError, error } = useLeaveTypes();

  const { mutateAsync: createLeaveType } = useCreateLeaveType();
  const { mutateAsync: updateLeaveType } = useUpdateLeaveType();
  const { mutateAsync: deleteLeaveType } = useDeleteLeaveType();

  const crud = useCrudModalForm<LeaveTypeInput, any>({
    label: "LeaveType",
    emptyForm: {
      name: "",
      is_active: true,
      default_days: 0,
      requires_family_status: false,
      gender: "all",
    },

    validate: (form) => {
      if (!form.name.trim()) return "LeaveType name is required";
      if (form.default_days < 0) return "Default days cannot be negative";
      return null;
    },

    mapToPayload: (form) => ({
      name: form.name.trim(),
      is_active: form.is_active,
      default_days: form.default_days,
      requires_family_status: form.requires_family_status,
      gender: form.gender,
    }),

    createFn: createLeaveType,
    updateFn: (uuid, payload) => updateLeaveType({ uuid, data: payload }),
  });

  const handleEdit = (uuid: string) => {
    const leaveType = leaveTypes.find((h) => h.uuid === uuid);
    if (!leaveType) return;

    crud.openEdit({
      uuid: leaveType.uuid,
      name: leaveType.name,
      is_active: leaveType.is_active,
      default_days: leaveType.default_days,
      requires_family_status: leaveType.requires_family_status,
      gender: leaveType.gender,
    });
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteLeaveType(uuid), {
      loading: "Deleting leaveType...",
      success: "LeaveType deleted successfully",
      error: "Failed to delete leaveType",
    });

  const handleCreate = () => crud.openCreate();

  const columns: Column<LeaveType>[] = [
    {
      header: "Leave Type",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 capitalize dark:text-gray-100">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <Badge variant="light" color={row.is_active ? "success" : "error"}>
          <div className="flex items-center gap-1">
            <span
              className={`h-1.5 w-1.5 rounded-full ${row.is_active ? "bg-green-500" : "bg-red-500"}`}
            />
            {row.is_active ? "Active" : "Inactive"}
          </div>
        </Badge>
      ),
    },
    {
      header: "Allocation",
      render: (row) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Calendar size={14} className="text-gray-400" />
          {row.default_days === null || row.default_days === undefined ? (
            <span className="font-medium text-blue-600 dark:text-blue-400">
              Infinite
            </span>
          ) : (
            <>
              <span className="font-mono font-medium">{row.default_days}</span>
              <span className="text-xs text-gray-500">Days</span>
            </>
          )}
        </div>
      ),
    },
    {
      header: "Applicable Gender",
      render: (row) => {
        const gender = row.gender.toLowerCase();
        if (gender === "male") {
          return (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm">
              <Mars size={16} /> Male Only
            </div>
          );
        }
        if (gender === "female") {
          return (
            <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-medium text-sm">
              <Venus size={16} /> Female Only
            </div>
          );
        }
        return (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium text-sm">
            <VenusAndMars size={16} /> All Genders
          </div>
        );
      },
    },
    {
      header: "Rules",
      render: (row) => (
        <div className="flex flex-col gap-1">
          {row.requires_family_status ? (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-md w-fit border border-amber-100 dark:border-amber-900/50">
              <Users size={12} /> Family Status Required
            </div>
          ) : (
            <span className="text-xs text-gray-400">
              No specific family rules
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <TableActions
          id={row.uuid}
          dataName={row.name}
          onEdit={handleEdit}
          onDelete={handleDelete}
          baseNamePermission={RESOURCES.LEAVE_TYPES}
        />
      ),
    },
  ];

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load leaveTypes: {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      <DataTable
        tableTitle="LeaveType Table"
        data={leaveTypes}
        columns={columns}
        searchableKeys={["name"]}
        loading={isLoading}
        handleCreate={handleCreate}
        label="LeaveTypes"
        baseNamePermission={RESOURCES.LEAVE_TYPES}
      />

      <LeaveTypeModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        data={crud.form}
        setData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
      />
    </>
  );
}
