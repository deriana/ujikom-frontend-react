import { useLeaveApprovals, useLeaveApprovalsList } from "@/hooks/useLeave";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { handleMutation } from "@/utils/handleMutation";
import { useRoleName } from "@/hooks/useRoleName";
import { ROLES } from "@/constants/Roles";
import LeaveShowModal from "@/pages/Leave/ShowModal";
import { useMemo, useState } from "react";
import {
  APPROVAL_INPUT,
  APPROVAL_LABEL,
  APPROVAL_STATS,
} from "@/constants/Approval";
import FilterDropdown from "@/components/FilterDropdown";
import { Check, CheckCircle2, X, XCircle } from "lucide-react";
import { formatDateID } from "@/utils/date";
import { useShowModal } from "@/hooks/useShowModal";
import { Column, Leave } from "@/types";

export default function LeavesApprovalTable() {
  const {
    data: leaves = [],
    isLoading,
    isError,
    error,
  } = useLeaveApprovalsList();
  const { mutateAsync: approveLeave } = useLeaveApprovals();
  const { isRole } = useRoleName();
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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
  header: "Approval Progress",
  render: (row) => {
    // Menghitung jumlah yang sudah approve
    const approvedCount = row.approval_levels?.filter(lvl => lvl.status === 1).length || 0;
    const totalLevels = row.approval_levels?.length || 0;
    const isFullyApproved = approvedCount === totalLevels;

    return (
      <div className="flex flex-col gap-2 min-w-32">
        {/* Lingkaran Status (Avatar Stack) */}
        <div className="flex -space-x-2 overflow-hidden">
          {row.approval_levels?.map((lvl, i) => (
            <div
              key={i}
              title={`${lvl.nama_approver} (Level ${lvl.level})`}
              className={`relative inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 text-white shadow-sm transition-all hover:z-10 hover:scale-110 ${
                lvl.status === 1
                  ? "bg-emerald-500" // Hijau untuk Approved
                  : lvl.status === 2
                    ? "bg-rose-500"   // Merah untuk Rejected
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400" // Abu untuk Pending
              }`}
            >
              {lvl.status === 1 ? (
                <CheckCircle2 size={14} strokeWidth={3} />
              ) : lvl.status === 2 ? (
                <XCircle size={14} />
              ) : (
                <span className="text-[10px] font-bold">{lvl.level}</span>
              )}
            </div>
          ))}
        </div>

        {/* Info Label */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
              isFullyApproved 
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            }`}>
              {approvedCount}/{totalLevels} Approved
            </span>
          </div>

          {/* Status Text Berdasarkan Kondisi */}
          {row.approval_status === 0 && row.next_approver ? (
            <p className="text-[10px] text-gray-500 italic">
              Next: <span className="font-semibold text-orange-500">{row.next_approver}</span>
            </p>
          ) : (
            <p className={`text-[10px] font-medium ${isFullyApproved ? "text-emerald-600" : "text-gray-400"}`}>
              {isFullyApproved ? "Finalized & Approved" : "Process Stopped"}
            </p>
          )}
        </div>
      </div>
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
        tableTitle="Leave Requests"
        data={leaves}
        columns={columns}
        searchableKeys={["reason", "employee_name", "leave_type"]}
        loading={isLoading}
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

      <LeaveShowModal
        uuid={show.showId}
        isOpen={show.isOpen}
        onClose={show.close}
      />
    </>
  );
}
