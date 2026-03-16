import { useEffect, useMemo, useState } from "react";
import { Column } from "@/types";
import { DataTable } from "@/components/tables/BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useAttendances, useExportAttendance } from "@/hooks/useAttendance";
import {
  Attendance,
  AttendanceCorrectionInput,
} from "@/types/attendance.types";
import DatePicker from "@/components/form/date-picker";
import TableActions from "../BasicTables/TableAction";
import { useShowModal } from "@/hooks/useShowModal";
import AttendanceShowModal from "@/pages/AttendanceReport/ShowModal";
import { RESOURCES } from "@/constants/Resource";
import {
  ATTENDANCE_STATUS,
  ATTENDANCE_STATUS_LABEL,
} from "@/constants/Attendance";
import { formatDateID } from "@/utils/date";
import { handleMutation } from "@/utils/handleMutation";
import { useCreateAttendanceCorrection } from "@/hooks/useAttendanceCorrection";
import { useCrudModalForm } from "@/hooks/useCrudModalForm";
import AttendanceCorrectionModal from "@/pages/AttendanceReport/Modal";
import FilterDropdown from "@/components/FilterDropdown";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useNavigate } from "react-router-dom";

interface AttendanceTableProps {
  onDataLoaded?: (data: Attendance[]) => void;
  onLoading?: (isLoading: boolean) => void;
}

export default function AttendanceTable({
  onDataLoaded,
  onLoading,
}: AttendanceTableProps) {
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [employeeFilter, setEmployeeFilter] = useState<string>("all");

  const show = useShowModal<number>();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { mutateAsync: createAttendanceCorrection } =
    useCreateAttendanceCorrection();

  const {
    data: attendances = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAttendances({
    start_date: startDate,
    end_date: endDate,
  });

  useEffect(() => {
    onLoading?.(isLoading);
  }, [isLoading, onLoading]);

  useEffect(() => {
    if (!isLoading && attendances && onDataLoaded) {
      onDataLoaded(attendances);
    }
  }, [attendances, isLoading, onDataLoaded]);

  const { mutateAsync: exportAttendance } = useExportAttendance();

  const handleShow = (id: number) => {
    if (isMobile) {
      navigate(`/attendance/${id}`)
      return;
    }
    show.open(id);
  };

  const handleExport = () =>
    handleMutation(
      () =>
        exportAttendance({
          start_date: startDate,
          end_date: endDate,
        }),
      {
        loading: "Exporting...",
        success: "Export successfully",
        error: "Failed to export",
      },
    );

  const ensureHiFormat = (timeString: string | null | undefined) => {
    if (!timeString) return "";
    const time = timeString.includes(" ")
      ? timeString.split(" ")[1]
      : timeString;
    return time.substring(0, 5);
  };

  const crud = useCrudModalForm<AttendanceCorrectionInput, FormData>({
    label: "Attendance Correction Request",
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
      if (!form.attendance_id) return "Attendance ID is required";
      return null;
    },
    mapToPayload: (form) => {
      console.log("Submitting Correction Form:", form);
      const formData = new FormData();
      formData.append("reason", form.reason.trim());
      if (form.attendance_id)
        formData.append("attendance_id", form.attendance_id.toString());
      if (form.clock_in_requested) {
        formData.append(
          "clock_in_requested",
          ensureHiFormat(form.clock_in_requested),
        );
      }

      if (form.clock_out_requested) {
        formData.append(
          "clock_out_requested",
          ensureHiFormat(form.clock_out_requested),
        );
      }

      if (form.attachment instanceof File)
        formData.append("attachment", form.attachment);
      return formData;
    },
    createFn: (payload) => createAttendanceCorrection(payload as any),
  });

  const handleRequestCorrection = (id: number) => {
    const row = attendances.find((a) => a.id === id);
    if (!row) return;

    crud.openCreate();
    crud.setForm({
      reason: "",
      attachment: null,
      attendance_id: row.id,
      clock_in_requested: row.clock_in || "",
      clock_out_requested: row.clock_out || "",
    });
  };

  // Generate options for employee filter dynamically
  const employeeOptions = useMemo(() => {
    const employees = Array.from(
      new Set(attendances.map((a) => a.employee.name).filter(Boolean)),
    );
    return [
      { label: "All Employees", value: "all" },
      ...employees.map((e) => ({ label: e!, value: e! })),
    ];
  }, [attendances]);

  // Status options (using constants)
  const statusOptions = useMemo(
    () => [
      { label: "All Status", value: "all" },
      ...Object.values(ATTENDANCE_STATUS).map((s) => ({
        label: ATTENDANCE_STATUS_LABEL[s] || s,
        value: s,
      })),
    ],
    [],
  );

  const columns: Column<Attendance>[] = [
    {
      header: "Employee",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 dark:text-white/90 capitalize leading-tight">
            {row.employee.name || "-"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
            NIK: {row.employee.nik || "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Date",
      render: (row) => (
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          {formatDateID(row.date)}
        </span>
      ),
    },
    {
      header: "Status",
      render: (row) => {
        const isPresent = row.status?.toLowerCase() === "present";
        return (
          <Badge
            size="sm"
            variant="light"
            color={isPresent ? "success" : "error"}
          >
            {row.status?.toUpperCase() || "-"}
          </Badge>
        );
      },
    },
    {
      header: "Clock In/Out",
      render: (row) => (
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            {row.clock_in || "--:--"}
          </span>
          <span className="text-gray-400 dark:text-gray-600">/</span>
          <span className="text-rose-600 dark:text-rose-400 font-medium">
            {row.clock_out || "--:--"}
          </span>
        </div>
      ),
    },
    {
      header: "Late",
      render: (row) => {
        const late = row.late_minutes ?? 0;
        return (
          <div className="flex flex-col">
            <span
              className={`font-semibold ${
                late > 0
                  ? "text-orange-600 dark:text-orange-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {late} <span className="text-[10px] font-normal italic">min</span>
            </span>
            {late > 0 && (
              <span className="text-[9px] leading-none text-red-500 animate-pulse">
                Late Arrival
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Work Time",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-gray-800 dark:text-gray-200 font-medium">
            {row.work_minutes ?? 0}{" "}
            <span className="text-[10px] opacity-60">MINS</span>
          </span>
          {(row.overtime_minutes ?? 0) > 0 && (
            <span className="text-[11px] text-orange-600 dark:text-orange-400 font-bold">
              +{row.overtime_minutes ?? 0} OT
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <TableActions
          id={row.id}
          dataName="Attendance"
          onShow={handleShow}
          baseNamePermission={RESOURCES.ATTENDANCE_CORRECTION}
          onEdit={handleRequestCorrection}
          can={row.can}
        />
      ),
    },
  ];

  const StartDateFilter = (
    <DatePicker
      id="attendance-start-date"
      mode="single"
      placeholder="Start date"
      value={startDate}
      onChange={(dates) => {
        if (dates.length > 0) {
          const date = dates[0];
          const localDate = date.toLocaleDateString("en-CA"); // YYYY-MM-DD
          setStartDate(localDate);
        }
      }}
    />
  );

  const EndDateFilter = (
    <DatePicker
      id="attendance-end-date"
      mode="single"
      placeholder="End date"
      value={endDate}
      onChange={(dates) => {
        if (dates.length > 0) {
          const date = dates[0];
          const localDate = date.toLocaleDateString("en-CA"); // YYYY-MM-DD
          setEndDate(localDate);
        }
      }}
    />
  );

  const StatusFilter = (
    <FilterDropdown
      value={statusFilter}
      options={statusOptions}
      onChange={setStatusFilter}
    />
  );

  const EmployeeFilter = (
    <FilterDropdown
      value={employeeFilter}
      options={employeeOptions}
      onChange={setEmployeeFilter}
    />
  );

  useEffect(() => {
    if (startDate && endDate) {
      refetch();
    }
  }, [startDate, endDate]);

  if (isError) {
    return (
      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
        <span className="font-bold">Error:</span> {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      <DataTable
        tableTitle="Employee Attendance"
        data={attendances}
        columns={columns}
        searchableKeys={["employee.name", "employee.nik", "status"]}
        loading={isLoading}
        label="Attendance"
        handleExport={handleExport}
        newFilterComponent={
          <>
            {StartDateFilter}
            {EndDateFilter}
            {StatusFilter}
            {EmployeeFilter}
          </>
        }
        extraFilters={{
          status: statusFilter,
          "employee.name": employeeFilter,
        }}
      />

      <AttendanceCorrectionModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        attendanceData={crud.form}
        setAttendanceData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
        originalDate={
          attendances.find((a) => a.id === crud.form.attendance_id)?.date
        }
      />

      <AttendanceShowModal
        id={show.showId}
        isOpen={show.isOpen}
        onClose={show.close}
      />
    </>
  );
}
