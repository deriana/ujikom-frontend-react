import { useEffect, useMemo, useState } from "react";
import { Column } from "@/types";
import { DataTable } from "@/components/tables/BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useAttendances } from "@/hooks/useAttendance";
import { Attendance } from "@/types/attendance.types";
import DatePicker from "@/components/form/date-picker";
import TableActions from "../BasicTables/TableAction";
import { useShowModal } from "@/hooks/useShowModal";
import AttendanceShowModal from "@/pages/AttendanceReport/ShowModal";
import { RESOURCES } from "@/constants/Resource";
import {
  ATTENDANCE_STATUS,
  ATTENDANCE_STATUS_LABEL,
} from "@/constants/Attendance";
import FilterDropdown from "@/components/FilterDropdown";

export default function AttendanceTable() {
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [employeeFilter, setEmployeeFilter] = useState<string>("all");

  const show = useShowModal<number>();

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

  const handleShow = (id: number) => {
    show.open(id);
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
          {row.date}
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
          baseNamePermission={RESOURCES.ATTENDANCE}
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

      <AttendanceShowModal
        id={show.showId}
        isOpen={show.isOpen}
        onClose={show.close}
      />
    </>
  );
}
