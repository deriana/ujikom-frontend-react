import {
  useCreateEarlyLeave,
  useDeleteEarlyLeave,
  useEarlyLeaveApprovals,
  useEarlyLeaves,
  useUpdateEarlyLeave,
} from "@/hooks/useEarlyLeave";
import { Column, EarlyLeave, EarlyLeaveInput } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useCrudModalForm, useShowModal } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import { useGetEmployeeForInput } from "@/hooks/useUser";
import { useRoleName } from "@/hooks/useRoleName";
import { ROLES } from "@/constants/Roles";
import { useContext, useMemo, useState } from "react";
import {
  APPROVAL_INPUT,
  APPROVAL_LABEL,
  APPROVAL_STATS,
} from "@/constants/Approval";
import FilterDropdown from "@/components/FilterDropdown";
import { Check, X, Clock } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import EarlyLeaveModal from "@/pages/EarlyLeaves/Modal";
import EarlyLeaveShowModal from "@/pages/EarlyLeaves/ShowModal";
import { formatDateID } from "@/utils/date";

export default function EarlyLeavesTable() {
  const {
    data: earlyLeaves = [],
    isLoading,
    isError,
    error,
  } = useEarlyLeaves();
  const { mutateAsync: createEarlyLeave } = useCreateEarlyLeave();
  const { mutateAsync: updateEarlyLeave } = useUpdateEarlyLeave();
  const { mutateAsync: deleteEarlyLeave } = useDeleteEarlyLeave();
  const { mutateAsync: approveEarlyLeave } = useEarlyLeaveApprovals();
  const { data: employee = [] } = useGetEmployeeForInput();
  const { isRole } = useRoleName();
  const { user } = useContext(AuthContext);

  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const employeeOptions = useMemo(() => {
    const employees = Array.from(
      new Set(earlyLeaves.map((l) => l.employee_name)),
    ).filter(Boolean);

    return [
      { label: "All Employees", value: "all" },
      ...employees.map((name) => ({ label: name, value: name })),
    ];
  }, [earlyLeaves]);

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
  const crud = useCrudModalForm<EarlyLeaveInput, FormData>({
    label: "Early Leave Request",
    emptyForm: {
      reason: "",
      attachment: null,
      employee_nik: undefined,
    },
    validate: (form) => {
      if (!form.reason || form.reason.trim().length < 3)
        return "Reason must be at least 3 characters";
      return null;
    },
    mapToPayload: (form) => {
      const formData = new FormData();
      formData.append("reason", form.reason.trim());
      if (form.employee_nik) formData.append("employee_nik", form.employee_nik);
      if (form.attachment instanceof File)
        formData.append("attachment", form.attachment);
      return formData;
    },
    createFn: (payload) => createEarlyLeave(payload as any),
    updateFn: (uuid, payload) =>
      updateEarlyLeave({ uuid, data: payload as any }),
  });

  const handleEdit = (uuid: string) => {
    const item = earlyLeaves.find((p) => p.uuid === uuid);
    if (!item) return;

    if (
      !isRole(ROLES.ADMIN) &&
      !isRole(ROLES.HR) &&
      item.status !== APPROVAL_STATS.PENDING
    ) {
      alert("You cannot edit a processed request.");
      return;
    }

    crud.openEdit({
      uuid: item.uuid,
      employee_nik: item.employee_nik,
      reason: item.reason,
      attachment: null,
    });
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteEarlyLeave(uuid), {
      loading: "Deleting...",
      success: "Deleted successfully",
      error: "Failed to delete",
    });

  const handleApprovalAction = (
    uuid: string,
    status: boolean,
    note?: string,
  ) => {
    const isApprove = status === APPROVAL_INPUT.APPROVED;

    handleMutation(
      () =>
        approveEarlyLeave({
          uuid,
          status,
          note,
        }),
      {
        loading: isApprove ? "Approving Early leave..." : "Rejecting Early leave...",
        success: `Early Leave ${isApprove ? "approved" : "rejected"} successfully`,
        error: `Failed to ${isApprove ? "approve" : "reject"} Early leave`,
      },
    );
  };

  const columns: Column<EarlyLeave>[] = [
    {
      header: "Employee",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {row.employee_name}
          </span>
          <span className="text-xs text-gray-500">NIK: {row.employee_nik}</span>
        </div>
      ),
    },
    {
      header: "Early Leave Info",
      render: (row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-700 dark:text-gray-200">
            {formatDateID(row.date)}
          </div>
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <Clock size={12} />
            {row.minutes_early} Minutes Early
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
          statusConfig[row.status as keyof typeof statusConfig] ||
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
            id={row.uuid || ""}
            dataName={`Early Leave - ${row.employee_name}`}
            baseNamePermission={RESOURCES.EARLY_LEAVE}
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
          baseNamePermission={RESOURCES.EARLY_LEAVE}
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
        tableTitle="Early Leave Requests"
        data={earlyLeaves}
        columns={columns}
        searchableKeys={["employee_name", "employee_nik"]}
        loading={isLoading}
        handleCreate={crud.openCreate}
        label="Early Leave"
        baseNamePermission={RESOURCES.EARLY_LEAVE}
        newFilterComponent={
          <>
            <FilterDropdown
              value={employeeFilter}
              options={employeeOptions}
              onChange={setEmployeeFilter}
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
          status: statusFilter,
        }}
      />

      <EarlyLeaveModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        earlyLeaveData={crud.form}
        setEarlyLeaveData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
        employees={employee}
        isUserAdminOrHR={isRole(ROLES.ADMIN) || isRole(ROLES.HR)}
      />

      <EarlyLeaveShowModal
        uuid={show.showId}
        isOpen={show.isOpen}
        onClose={show.close}
      />
    </>
  );
}
