import {
  useAttendanceCorrections,
  useCreateAttendanceCorrection,
  useUpdateAttendanceCorrection,
  useDeleteAttendanceCorrection,
} from "@/hooks/useAttendanceCorrection";
import {
  Column,
  AttendanceCorrection,
  AttendanceCorrectionInput,
} from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useCrudModalForm, useShowModal } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import { useRoleName } from "@/hooks/useRoleName";
import { ROLES } from "@/constants/Roles";
import { useEffect, useMemo, useState } from "react";
import {
  APPROVAL_LABEL,
  APPROVAL_STATS,
} from "@/constants/Approval";
import FilterDropdown from "@/components/FilterDropdown";
import { Clock, Info } from "lucide-react";
import AttendanceCorrectionModal from "@/pages/AttendanceReport/Modal";
import { formatDateID } from "@/utils/date";
import DatePicker from "@/components/form/date-picker";
import { useNavigate } from "react-router-dom";
import AttendanceShowModal from "@/pages/AttendanceReport/ShowModal";

interface AttendanceCorrectionTableProps {
  onDataLoaded?: (data: any[]) => void;
}

export default function AttendanceCorrectionTable({
  onDataLoaded,
}: AttendanceCorrectionTableProps) {
  const today = new Date().toISOString().split("T")[0];

  const {
    data: corrections = [],
    isLoading,
    isError,
    error,
  } = useAttendanceCorrections();

  const { mutateAsync: createCorrection } = useCreateAttendanceCorrection();
  const { mutateAsync: updateCorrection } = useUpdateAttendanceCorrection();
  const { mutateAsync: deleteCorrection } = useDeleteAttendanceCorrection();
  const { isRole } = useRoleName();
  const navigate = useNavigate();

  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<string>(today);

  const filteredData = useMemo(() => {
    return corrections.filter((item) => {
      const matchEmployee =
        employeeFilter === "all" || item.employee_name === employeeFilter;
      const matchStatus =
        statusFilter === "all" || item.status.toString() === statusFilter;
      const matchDate =
        !dateFilter || item.attendance_date === dateFilter;
      return matchEmployee && matchStatus && matchDate;
    });
  }, [corrections, employeeFilter, statusFilter]);

  useEffect(() => {
    if (onDataLoaded) {
      onDataLoaded(filteredData);
    }
  }, [filteredData, onDataLoaded]);

  const employeeOptions = useMemo(() => {
    const employees = Array.from(
      new Set(corrections.map((l) => l.employee_name)),
    ).filter(Boolean);

    return [
      { label: "All Employees", value: "all" },
      ...employees.map((name) => ({ label: name!, value: name! })),
    ];
  }, [corrections]);

  const statusOptions = useMemo(() => {
    return [
      { label: "All Status", value: "all" },
      ...Object.entries(APPROVAL_LABEL).map(([value, label]) => ({
        label,
        value: value.toString(),
      })),
    ];
  }, []);

  const show = useShowModal<number>();
  const crud = useCrudModalForm<AttendanceCorrectionInput, FormData>({
    label: "Attendance Correction",
    emptyForm: {
      reason: "",
      attachment: null,
      attendance_id: undefined,
      clock_in_requested: "",
      clock_out_requested: "",
    },
    validate: (form) => {
      if (!form.reason || form.reason.trim().length < 3)
        return "Reason must be at least 3 characters";
      return null;
    },
    mapToPayload: (form) => {
      const formData = new FormData();
      formData.append("reason", form.reason.trim());
      if (form.clock_in_requested)
        formData.append("clock_in_requested", form.clock_in_requested);
      if (form.clock_out_requested)
        formData.append("clock_out_requested", form.clock_out_requested);
      if (form.attachment instanceof File)
        formData.append("attachment", form.attachment);
      return formData;
    },
    createFn: (payload) => createCorrection(payload as any),
    updateFn: (uuid, payload) =>
      updateCorrection({ uuid, data: payload as any }),
  });

  const handleCreateRedirect = () => {
    navigate("/attendances/report");
  };

  const handleEdit = (uuid: string) => {
    const item = corrections.find((p) => p.uuid === uuid);
    if (!item) return;

    if (
      !isRole(ROLES.ADMIN) &&
      !isRole(ROLES.HR) &&
      item.status !== APPROVAL_STATS.PENDING
    ) {
      alert("You cannot edit a processed correction.");
      return;
    }

    crud.openEdit({
      uuid: item.uuid,
      employee_nik: item.employee_nik ?? undefined,
      reason: item.reason,
      clock_in_requested: item.clock_in_requested || "",
      clock_out_requested: item.clock_out_requested || "",
      attachment: item.attachment
        ? {
            exists: true,
            filename: item.attachment.filename,
            download_url: item.attachment.download_url,
          }
        : null,
    });
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteCorrection(uuid), {
      loading: "Deleting...",
      success: "Deleted successfully",
      error: "Failed to delete correction",
    });

  const columns: Column<AttendanceCorrection>[] = [
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
      header: "Correction Info",
      render: (row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-700 dark:text-gray-200">
            {formatDateID(row.attendance_date || "")}
          </div>
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <Clock size={12} />
            {row.clock_in_requested || "--:--"} /{" "}
            {row.clock_out_requested || "--:--"}
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
      header: "Action",
      render: (row) => (
        <TableActions
          id={row.uuid}
          dataName={row.employee_name || "Correction"}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShow={() => show.open(row.attendance_id)}
          baseNamePermission={RESOURCES.ATTENDANCE_CORRECTION}
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
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl flex items-start gap-3">
        <Info
          className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
          size={18}
        />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-bold mb-1">How to request a correction?</p>
          <p className="opacity-90">
            New correction requests must be initiated from the{" "}
            <span
              className="font-bold underline cursor-pointer"
              onClick={() => navigate("/attendances/report")}
            >
              Attendance Report
            </span>
            . Find the specific date you want to correct and click the edit
            icon.
          </p>
        </div>
      </div>

      <DataTable
        tableTitle="Attendance Correction Requests"
        data={corrections}
        columns={columns}
        searchableKeys={["employee_name", "employee_nik"]}
        loading={isLoading}
        handleCreate={handleCreateRedirect}
        label="Correction"
        baseNamePermission={RESOURCES.ATTENDANCE_CORRECTION}
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
            <DatePicker
              id="correction-date-filter"
              mode="single"
              placeholder="Filter by date"
              value={dateFilter}
              onChange={(dates) => {
                if (dates.length > 0) {
                  const date = dates[0];
                  const localDate = date.toLocaleDateString("en-CA");
                  setDateFilter(localDate);
                } else {
                  setDateFilter("");
                }
              }}
            />
            </>
        }
        extraFilters={{
          employee_name: employeeFilter,
          status: statusFilter,
          attendance_date: dateFilter,
        }}
      />

      <AttendanceCorrectionModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        attendanceData={crud.form}
        setAttendanceData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
      />

      <AttendanceShowModal
        id={show.showId}
        isOpen={show.isOpen}
        onClose={show.close}
      />
    </>
  );
}
