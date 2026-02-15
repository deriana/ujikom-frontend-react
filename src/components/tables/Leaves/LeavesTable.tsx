import {
  useCreateLeave,
  useDeleteLeave,
  useLeaveApprovals,
  useLeaves,
  useUpdateLeave,
} from "@/hooks/useLeave";
import { Column, Leave, LeaveInput } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useCrudModalForm, useShowModal } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import LeaveModal from "@/pages/Leave/Modal";
import { useGetEmployeeForInput } from "@/hooks/useUser";
import { useLeaveTypes } from "@/hooks/useLeaveType";
import { useRoleName } from "@/hooks/useRoleName";
import { ROLES } from "@/constants/Roles";
import LeaveShowModal from "@/pages/Leave/ShowModal";
import { useContext, useMemo, useState } from "react";
import {
  APPROVAL_INPUT,
  APPROVAL_LABEL,
  APPROVAL_STATS,
} from "@/constants/Approval";
import FilterDropdown from "@/components/FilterDropdown";
import { Check, X } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { formatDateID } from "@/utils/date";

export default function LeavesTable() {
  const { data: leaves = [], isLoading, isError, error } = useLeaves();
  const { mutateAsync: createLeave } = useCreateLeave();
  const { mutateAsync: updateLeave } = useUpdateLeave();
  const { mutateAsync: deleteLeave } = useDeleteLeave();
  const { mutateAsync: approveLeave } = useLeaveApprovals();
  const { data: employee = [] } = useGetEmployeeForInput();
  const { data: leaveTypes = [] } = useLeaveTypes();
  const { isRole } = useRoleName();
  const { user } = useContext(AuthContext);
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter Options untuk Dropdown
  const employeeOptions = useMemo(() => {
    const employees = Array.from(
      new Set(leaves.map((l) => l.employee_name)),
    ).filter(Boolean);

    return [
      { label: "All Employees", value: "all" },
      ...employees.map((name) => ({ label: name, value: name })),
    ];
  }, [leaves]);

  const leaveTypeOptions = useMemo(() => {
    const types = Array.from(new Set(leaves.map((l) => l.leave_type))).filter(
      Boolean,
    );

    return [
      { label: "All Leave Types", value: "all" },
      ...types.map((type) => ({ label: type, value: type })),
    ];
  }, [leaves]);

  const statusOptions = useMemo(() => {
    return [
      { label: "All Status", value: "all" },
      ...Object.entries(APPROVAL_LABEL).map(([value, label]) => ({
        label,
        value: value.toString(),
      })),
    ];
  }, []);

  const show = useShowModal<string>();
  const crud = useCrudModalForm<LeaveInput, FormData>({
    label: "Leave Request",
    emptyForm: {
      leave_type_uuid: "",
      date_start: "",
      date_end: "",
      reason: "",
      is_half_day: false,
      attachment: null,
      employee_nik: undefined,
    },

    validate: (form) => {
      if (!form.leave_type_uuid) return "Leave type is required";
      if (!form.date_start) return "Start date is required";
      if (!form.date_end) return "End date is required";
      if (new Date(form.date_start) > new Date(form.date_end))
        return "Start date cannot be after end date";
      if (!form.reason || form.reason.trim().length < 3)
        return "Reason must be at least 3 characters";
      return null;
    },

    mapToPayload: (form) => {
      const formData = new FormData();
      formData.append("leave_type_uuid", form.leave_type_uuid);
      formData.append("date_start", form.date_start);
      formData.append("date_end", form.date_end);
      formData.append("reason", form.reason.trim());
      formData.append("is_half_day", form.is_half_day ? "1" : "0");

      if (form.employee_nik) {
        formData.append("employee_nik", form.employee_nik);
      }

      if (form.attachment instanceof File) {
        formData.append("attachment", form.attachment);
      }

      return formData;
    },

    createFn: (payload) => createLeave(payload as any),
    updateFn: (uuid, payload) => updateLeave({ uuid, data: payload as any }),
  });

  const handleCreate = () => crud.openCreate();

  const handleEdit = (uuid: string) => {
    const leave = leaves.find((p) => p.uuid === uuid);
    if (!leave) return;

    if (
      !isRole(ROLES.ADMIN) &&
      !isRole(ROLES.HR) &&
      leave.approval_status !== 0
    ) {
      alert("You cannot edit a processed leave request.");
      return;
    }

    const editPayload = {
      uuid: leave.uuid,
      leave_type_uuid: leave.leave_type_uuid,
      date_start: leave.date_start,
      date_end: leave.date_end,
      reason: leave.reason,
      attachment: leave.attachment
        ? {
            exists: true,
            filename: leave.attachment.filename,
            download_url: leave.attachment.download_url,
          }
        : null,
      is_half_day: leave.is_half_day,
      employee_nik: leave.employee_nik.toString(),
    };

    crud.openEdit(editPayload);
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteLeave(uuid), {
      loading: "Deleting leave...",
      success: "Leave deleted successfully",
      error: "Failed to delete leave",
    });

  const handleApprovalAction = (
    uuid: string,
    status: boolean,
    note?: string,
  ) => {
    const isApprove = status === APPROVAL_INPUT.APPROVED;

    handleMutation(
      () =>
        approveLeave({
          uuid,
          status,
          note,
        }),
      {
        loading: isApprove ? "Approving leave..." : "Rejecting leave...",
        success: `Leave ${isApprove ? "approved" : "rejected"} successfully`,
        error: `Failed to ${isApprove ? "approve" : "reject"} leave`,
      },
    );
  };

  const columns: Column<Leave>[] = [
    {
      header: "Employee & Type",
      render: (row) => (
        <div className="flex flex-col space-y-0.5">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {row.employee_name}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            {(isRole(ROLES.ADMIN) || isRole(ROLES.HR)) && (
              <span className="text-xs text-gray-500">
                NIK: {row.employee_nik}
              </span>
            )}
            <span>•</span>
            <span>Detail: {row.leave_type}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Duration",
      render: (row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            {formatDateID(row.date_start)}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 ml-3">
            Until {formatDateID(row.date_end)}
          </div>
        </div>
      ),
    },
    {
      header: "Reason",
      render: (row) => (
        <span
          className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-45 block italic"
          title={row.reason}
        >
          "{row.reason}"
        </span>
      ),
    },
    {
      header: "Type",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              row.is_half_day ? "bg-amber-500" : "bg-blue-500"
            }`}
          />
          <span
            className={row.is_half_day ? "text-amber-700" : "text-blue-700"}
          >
            {row.is_half_day ? "Half Day" : "Full Day"}
          </span>
        </div>
      ),
    },

    {
      header: "Status",
      render: (row) => {
        const statusConfig = {
          [APPROVAL_STATS.PENDING]: {
            label: "Pending",
            color: "warning",
            dot: "bg-amber-500",
          },
          [APPROVAL_STATS.APPROVED]: {
            label: "Approved",
            color: "success",
            dot: "bg-emerald-500",
          },
          [APPROVAL_STATS.REJECTED]: {
            label: "Rejected",
            color: "error",
            dot: "bg-rose-500",
          },
        };
        const status =
          statusConfig[row.approval_status as keyof typeof statusConfig] ||
          statusConfig[0];
        return (
          <Badge size="sm" color={status.color as any} variant="light">
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status.dot}`} />
            {status.label}
          </Badge>
        );
      },
    },
    {
      header: "Approval",
      render: (row) => {
        return (
          <TableActions
            id={row.current_approval_uuid || ""}
            dataName={`Leave - ${row.employee_name}`}
            baseNamePermission={RESOURCES.LEAVE}
            actions={
              row.can?.approve
                ? [
                    {
                      label: "Approve",
                      variant: "success",
                      icon: <Check size={16} />,
                      showNote: true,
                      onClick: (uuid, note) =>
                        handleApprovalAction(
                          uuid,
                          APPROVAL_INPUT.APPROVED,
                          note,
                        ),
                    },
                    {
                      label: "Reject",
                      variant: "danger",
                      icon: <X size={16} />,
                      showNote: true,
                      onClick: (uuid, note) =>
                        handleApprovalAction(
                          uuid,
                          APPROVAL_INPUT.REJECTED,
                          note,
                        ),
                    },
                  ]
                : []
            }
          />
        );
      },
    },
    {
      header: "Action",
      render: (row) => (
        <TableActions
          id={row.uuid}
          dataName={row.employee_name}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShow={() => show.open(row.uuid)}
          baseNamePermission={RESOURCES.LEAVE}
          can={row.can}
        />
      ),
    },
  ];
  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
        <strong>Error:</strong> {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      <DataTable
        tableTitle="Leave Requests"
        data={leaves}
        columns={columns}
        searchableKeys={["reason", "employee_name", "leave_type"]}
        loading={isLoading}
        handleCreate={handleCreate}
        label="Leave Request"
        baseNamePermission={RESOURCES.LEAVE}
        newFilterComponent={
          <>
            <FilterDropdown
              value={employeeFilter}
              options={employeeOptions}
              onChange={setEmployeeFilter}
            />
            <FilterDropdown
              value={leaveTypeFilter}
              options={leaveTypeOptions}
              onChange={setLeaveTypeFilter}
            />
            <FilterDropdown
              value={statusFilter}
              options={statusOptions}
              onChange={setStatusFilter}
            />
          </>
        }
        extraFilters={{
          employee_name: employeeFilter,
          leave_type: leaveTypeFilter,
          approval_status: statusFilter,
        }}
      />
      <LeaveModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        leaveData={crud.form}
        setLeaveData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
        employees={employee}
        leaveTypes={leaveTypes}
        isUserAdminOrHR={isRole(ROLES.ADMIN) || isRole(ROLES.HR)}
      />

      <LeaveShowModal
        uuid={show.showId}
        isOpen={show.isOpen}
        onClose={show.close}
      />
    </>
  );
}
