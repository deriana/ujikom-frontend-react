import {
  useCreateAttendanceRequest,
  useDeleteAttendanceRequest,
  useAttendanceRequestApprovals,
  useAttendanceRequests,
  useUpdateAttendanceRequest,
} from "@/hooks/useAttendanceRequest";
import { Column, AttendanceRequest, AttendanceRequestInput } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useCrudModalForm, useShowModal } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import { useRoleName } from "@/hooks/useRoleName";
import { ROLES } from "@/constants/Roles";
import { useMemo, useState } from "react";
import {
  APPROVAL_INPUT,
  APPROVAL_LABEL,
  APPROVAL_STATS,
} from "@/constants/Approval";
import FilterDropdown from "@/components/FilterDropdown";
import { Check, X, Calendar } from "lucide-react";
import { formatDateID } from "@/utils/date";
import AttendanceRequestModal from "@/pages/AttendanceRequest/Modal";
import AttendanceRequestShowModal from "@/pages/AttendanceRequest/ShowModal";

export default function AttendanceRequestsTable() {
  const {
    data: attendanceRequests = [],
    isLoading,
    isError,
    error,
  } = useAttendanceRequests();
  const { mutateAsync: createAttendanceRequest } = useCreateAttendanceRequest();
  const { mutateAsync: updateAttendanceRequest } = useUpdateAttendanceRequest();
  const { mutateAsync: deleteAttendanceRequest } = useDeleteAttendanceRequest();
  const { mutateAsync: approveAttendanceRequest } =
    useAttendanceRequestApprovals();
  const { isRole } = useRoleName();
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const employeeOptions = useMemo(() => {
    const employees = Array.from(
      new Set(attendanceRequests.map((l) => l.employee?.name)),
    ).filter(Boolean);

    return [
      { label: "All Employees", value: "all" },
      ...employees.map((name) => ({ label: name, value: name })),
    ];
  }, [attendanceRequests]);

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
  const crud = useCrudModalForm<AttendanceRequestInput, AttendanceRequestInput>(
    {
      label: "Attendance Request",
      emptyForm: {
        reason: "",
        employee_nik: undefined,
        request_type: "SHIFT",
        start_date: new Date().toISOString().split("T")[0],
        end_date: null,
        shift_template_uuid: undefined,
        work_schedule_uuid: undefined,
      },
      validate: (form) => {
        if (!form.reason || form.reason.trim().length < 3)
          return "Reason must be at least 3 characters";
        if (!form.request_type) return "Request type is required";
        if (!form.start_date) return "Start date is required";
        return null;
      },
      mapToPayload: (form) => ({
        ...form,
        reason: form.reason.trim(),
      }),
      createFn: (payload) => createAttendanceRequest(payload),
      updateFn: (uuid, payload) =>
        updateAttendanceRequest({ uuid, data: payload }),
    },
  );

  const handleEdit = (uuid: string) => {
    const item = attendanceRequests.find((p) => p.uuid === uuid);
    if (!item) return;

    if (!item.can.update) {
      alert("You cannot edit this request as it has already been processed.");
      return;
    }

    crud.openEdit({
      uuid: item.uuid,
      employee_nik: item.employee.nik,
      request_type: item.request_type,
      reason: item.reason,
      start_date: item.start_date,
      end_date: item.end_date,
      shift_template_uuid: item.shift_details?.uuid,
      work_schedule_uuid: item.work_schedule_details?.uuid,
    });
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteAttendanceRequest(uuid), {
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
        approveAttendanceRequest({
          uuid,
          status,
          note,
        }),
      {
        loading: isApprove
          ? "Approving Attendance Request..."
          : "Rejecting Attendance Request...",
        success: `Attendance Request ${isApprove ? "approved" : "rejected"} successfully`,
        error: `Failed to ${isApprove ? "approve" : "reject"} Attendance Request`,
      },
    );
  };

  const columns: Column<AttendanceRequest>[] = [
    {
      header: "Employee",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {row.employee?.name} {/* Sesuai nested object employee */}
          </span>
          <span className="text-xs text-gray-500">
            NIK: {row.employee?.nik}
          </span>
        </div>
      ),
    },
    {
      header: "Request Info",
      render: (row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-700 dark:text-gray-200">
            {row.request_type === "SHIFT" ? "Shift Change" : "Work Mode Change"}
          </div>
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <Calendar size={12} />
            {formatDateID(row.start_date)}
            {row.end_date && ` - ${formatDateID(row.end_date)}`}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">
            {row.shift_details?.name || row.work_schedule_details?.name}
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
    // {
    //   header: "Approval",
    //   render: (row) => {
    //     return (
    //       <TableActions
    //         id={row.uuid}
    //         dataName={`Request - ${row.employee.name}`}
    //         baseNamePermission={RESOURCES.ATTENDANCE_REQUEST}
    //         actions={
    //           row.can?.approve
    //             ? [
    //                 {
    //                   label: "Approve",
    //                   variant: "success",
    //                   icon: <Check size={16} />,
    //                   showNote: true,
    //                   onClick: (uuid, note) =>
    //                     handleApprovalAction(
    //                       uuid,
    //                       APPROVAL_INPUT.APPROVED,
    //                       note,
    //                     ),
    //                 },
    //                 {
    //                   label: "Reject",
    //                   variant: "danger",
    //                   icon: <X size={16} />,
    //                   showNote: true,
    //                   onClick: (uuid, note) =>
    //                     handleApprovalAction(
    //                       uuid,
    //                       APPROVAL_INPUT.REJECTED,
    //                       note,
    //                     ),
    //                 },
    //               ]
    //             : []
    //         }
    //       />
    //     );
    //   },
    // },
    {
      header: "Action",
      render: (row) => (
        <TableActions
          id={row.uuid}
          dataName={row.employee?.name}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShow={() => show.open(row.uuid)}
          baseNamePermission={RESOURCES.ATTENDANCE_REQUEST}
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
        tableTitle="Attendance Requests"
        data={attendanceRequests}
        columns={columns}
        searchableKeys={["employee.name", "employee.nik"]}
        loading={isLoading}
        handleCreate={crud.openCreate}
        label="Attendance Request"
        baseNamePermission={RESOURCES.EARLY_LEAVE}
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

      <AttendanceRequestModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        attendanceRequestData={crud.form}
        setAttendanceRequestData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
        isUserAdminOrHR={isRole(ROLES.ADMIN) || isRole(ROLES.HR)}
      />

      <AttendanceRequestShowModal
        uuid={show.showId}
        isOpen={show.isOpen}
        onClose={show.close}
      />
    </>
  );
}
