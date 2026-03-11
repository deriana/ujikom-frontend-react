import {
  useCreateLeave,
  useDeleteLeave,
  // useLeaveApprovals,
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
import { useRoleName } from "@/hooks/useRoleName";
import { ROLES } from "@/constants/Roles";
import LeaveShowModal from "@/pages/Leave/ShowModal";
import { useEffect, useMemo, useState } from "react";
import {
  // APPROVAL_INPUT,
  APPROVAL_LABEL,
  APPROVAL_STATS,
} from "@/constants/Approval";
import FilterDropdown from "@/components/FilterDropdown";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { formatDateID } from "@/utils/date";

interface LeavesTableProps {
  onDataLoaded?: (data: any[]) => void;
}

export default function LeavesTable({ onDataLoaded }: LeavesTableProps) {
  const { data: leaves = [], isLoading, isError, error } = useLeaves();
  const { mutateAsync: createLeave } = useCreateLeave();
  const { mutateAsync: updateLeave } = useUpdateLeave();
  const { mutateAsync: deleteLeave } = useDeleteLeave();
  const { isRole } = useRoleName();
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  // const [startDateFilter, setStartDateFilter] = useState<string>("");
  // const [endDateFilter, setEndDateFilter] = useState<string>("");

  // Gunakan JSON.stringify atau salinan array agar useEffect mendeteksi perubahan referensi
  useEffect(() => {
    onDataLoaded?.([...leaves]); // Mengirim salinan array baru
  }, [leaves, onDataLoaded]);

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

    // validate: (form) => {
    //   if (!form.leave_type_uuid) return "Leave type is required";
    //   if (!form.date_start) return "Start date is required";
    //   if (!form.date_end) return "End date is required";
    //   if (new Date(form.date_start) > new Date(form.date_end))
    //     return "Start date cannot be after end date";
    //   if (!form.reason || form.reason.trim().length < 3)
    //     return "Reason must be at least 3 characters";
    //   return null;
    // },

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
        <div className="flex flex-col gap-1">
          <div className="text-sm">
            <div className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {formatDateID(row.date_start)}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 ml-3">
              Until {formatDateID(row.date_end)}
            </div>
          </div>
          <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider ml-3">
            {row.duration_label} Total
          </span>
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
      header: "Progress",
      render: (row) => (
        <div className="flex flex-col gap-1.5 min-w-30">
          <div className="flex -space-x-2 overflow-hidden">
            {row.approval_levels?.map((lvl, i) => (
              <div
                key={i}
                title={`${lvl.nama_approver} (Level ${lvl.level})`}
                className={`inline-flex items-center justify-center w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 text-white shadow-sm transition-transform hover:scale-110 ${
                  lvl.status === 1
                    ? "bg-emerald-500"
                    : lvl.status === 2
                      ? "bg-rose-500"
                      : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                {lvl.status === 1 ? (
                  <CheckCircle2 size={12} />
                ) : lvl.status === 2 ? (
                  <XCircle size={12} />
                ) : (
                  <Clock size={12} />
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-0.5 mt-1">
            <span className="text-[9px] text-gray-400 uppercase font-semibold leading-none">
              Lvl 1: Manager • Lvl 2: HR/Dir
            </span>
          </div>

          {row.approval_status === 0 && row.next_approver && (
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium animate-pulse">
              Waiting: {row.next_approver}
            </p>
          )}
          {row.approval_status !== 0 && (
            <p className="text-[10px] text-gray-400 font-medium">
              Process Completed
            </p>
          )}
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
            {employeeOptions.length > 2 && (
              <FilterDropdown
                value={employeeFilter}
                options={employeeOptions}
                onChange={setEmployeeFilter}
              />
            )}
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
