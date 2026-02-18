import {
  useEarlyLeaveApprovals,
  useEarlyLeaveApprovalsList,
} from "@/hooks/useEarlyLeave";
import { Column, EarlyLeave } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useShowModal } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import { useMemo, useState } from "react";
import {
  APPROVAL_INPUT,
  APPROVAL_LABEL,
  APPROVAL_STATS,
} from "@/constants/Approval";
import FilterDropdown from "@/components/FilterDropdown";
import { Check, X, Clock } from "lucide-react";
import EarlyLeaveShowModal from "@/pages/EarlyLeaves/ShowModal";
import { formatDateID } from "@/utils/date";

export default function EarlyLeavesApprovalTable() {
  const {
    data: earlyLeaves = [],
    isLoading,
    isError,
    error,
  } = useEarlyLeaveApprovalsList();
  const { mutateAsync: approveEarlyLeave } = useEarlyLeaveApprovals();
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
        loading: isApprove
          ? "Approving Early leave..."
          : "Rejecting Early leave...",
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
      header: "Detail",
      render: (row) => (
        <TableActions
          id={row.uuid}
          dataName={row.employee_name}
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
        tableTitle="Early Leave Requests"
        data={earlyLeaves}
        columns={columns}
        searchableKeys={["employee_name", "employee_nik"]}
        loading={isLoading}
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

      <EarlyLeaveShowModal
        uuid={show.showId}
        isOpen={show.isOpen}
        onClose={show.close}
      />
    </>
  );
}
