import {
  useCreateOvertime,
  useDeleteOvertime,
  useOvertimes,
  useExportOvertime,
  useUpdateOvertime,
} from "@/hooks/useOvertime";
import { Column, Overtime, OvertimeInput } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useCrudModalForm, useShowModal } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import { useRoleName } from "@/hooks/useRoleName";
import { useEffect, useMemo, useState } from "react";
import { APPROVAL_STATS } from "@/constants/Approval";
import FilterDropdown from "@/components/FilterDropdown";
import { Calendar, Clock } from "lucide-react";
import { formatDateID } from "@/utils/date";
import OvertimeModal from "@/pages/Overtime/Modal";
import { ROLES } from "@/constants/Roles";
import OvertimeShowModal from "@/pages/Overtime/ShowModal";
import DatePicker from "@/components/form/date-picker";

interface OvertimeTableProps {
  onDataLoaded?: (data: any[]) => void;
}

export default function OvertimesTable({ onDataLoaded }: OvertimeTableProps) {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);
  const {
    data: overtimes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useOvertimes({ start_date: startDate, end_date: endDate });
  const { mutateAsync: createOvertime } = useCreateOvertime();
  const { mutateAsync: updateOvertime } = useUpdateOvertime();
  const { mutateAsync: deleteOvertime } = useDeleteOvertime();

  const { isRole } = useRoleName();

  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { mutateAsync: exportOvertime } = useExportOvertime();

  const filteredData = useMemo(() => {
    return overtimes.filter((item) => {
      const matchEmployee = employeeFilter === "all" || item.employee_name === employeeFilter;
      const matchStatus = statusFilter === "all" || item.status.toString() === statusFilter;
      return matchEmployee && matchStatus;
    });
  }, [overtimes, employeeFilter, statusFilter]);

  useEffect(() => {
    if (onDataLoaded) {
      onDataLoaded(filteredData);
    }
  }, [filteredData, onDataLoaded]);

  const employeeOptions = useMemo(() => {
    const employees = Array.from(
      new Set(overtimes.map((o) => o.employee_name)),
    ).filter(Boolean);
    return [
      { label: "All Employees", value: "all" },
      ...employees.map((name) => ({ label: name, value: name })),
    ];
  }, [overtimes]);

  const statusOptions = useMemo(
    () => [
      { label: "All Status", value: "all" },
      ...Object.entries(APPROVAL_STATS).map(([key, value]) => ({
        label: key,
        value: value.toString(),
      })),
    ],
    [],
  );

  const show = useShowModal<string>();
  const crud = useCrudModalForm<OvertimeInput, OvertimeInput>({
    label: "Overtime",
    emptyForm: {
      reason: "",
      employee_nik: undefined,
    },
    validate: (form) => {
      if (!form.reason || form.reason.trim().length < 3)
        return "Reason must be at least 3 characters";
      return null;
    },
    mapToPayload: (form) => ({
      reason: form.reason.trim(),
      employee_nik: form.employee_nik,
    }),
    createFn: (payload) => createOvertime(payload),
    updateFn: (uuid, payload) => updateOvertime({ uuid, data: payload }),
  });

  const handleEdit = (uuid: string) => {
    const item = overtimes.find((o) => o.uuid === uuid);
    if (!item) return;

    if (!item.can.update) {
      alert("You cannot edit this overtime as it has already been processed.");
      return;
    }

    crud.openEdit({
      uuid: item.uuid,
      reason: item.reason,
      employee_nik: item.employee_nik,
    });
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteOvertime(uuid), {
      loading: "Deleting...",
      success: "Deleted successfully",
      error: "Failed to delete",
    });

  const handleExport = () =>
    handleMutation(
      () =>
        exportOvertime({
          start_date: startDate,
          end_date: endDate,
        }),
      {
        loading: "Exporting...",
        success: "Export successfully",
        error: "Failed to export",
      },
    );

  const StartDateFilter = (
    <DatePicker
      id="overtime-start-date"
      mode="single"
      placeholder="Start date"
      value={startDate}
      onChange={(dates) => {
        if (dates.length > 0) {
          const date = dates[0];
          const localDate = date.toLocaleDateString("en-CA");
          setStartDate(localDate);
        }
      }}
    />
  );

  const EndDateFilter = (
    <DatePicker
      id="overtime-end-date"
      mode="single"
      placeholder="End date"
      value={endDate}
      onChange={(dates) => {
        if (dates.length > 0) {
          const date = dates[0];
          const localDate = date.toLocaleDateString("en-CA");
          setEndDate(localDate);
        }
      }}
    />
  );

  useEffect(() => {
    refetch();
  }, [startDate, endDate]);

  const columns: Column<Overtime>[] = [
    {
      header: "Employee",
      render: (row) => (
        <div className="flex items-center gap-3">
          {/* Init Circle Avatar */}
          {/* <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800">
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300">
              {row.employee_name}
            </span>
          </div> */}
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {row.employee_name}
            </span>
            <span className="text-[10px] font-medium text-gray-400 tracking-wider">
              {row.employee_nik}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Overtime Date",
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar size={14} className="text-gray-400" />
            {formatDateID(row.date)}
          </div>
        </div>
      ),
    },
    {
      header: "Duration",
      render: (row) => {
        const hours = Math.floor(row.duration_minutes / 60);
        const mins = row.duration_minutes % 60;
        return (
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
            <Clock size={13} className="text-blue-500" />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
              {hours > 0 ? `${hours}h ` : ""}
              {mins}m
            </span>
          </div>
        );
      },
    },
    {
      header: "Reason",
      render: (row) => (
        <div className="group relative">
          <p
            className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 italic max-w-45"
            title={row.reason}
          >
            {row.reason || "-"}
          </p>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gray-200 dark:bg-gray-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </div>
      ),
    },
    {
      header: "Approval Status",
      render: (row) => {
        const statusConfig = {
          [APPROVAL_STATS.PENDING]: {
            label: "Pending",
            color: "warning",
            dot: "bg-amber-500",
            shadow: "shadow-amber-500/20",
          },
          [APPROVAL_STATS.APPROVED]: {
            label: "Approved",
            color: "success",
            dot: "bg-emerald-500",
            shadow: "shadow-emerald-500/20",
          },
          [APPROVAL_STATS.REJECTED]: {
            label: "Rejected",
            color: "error",
            dot: "bg-rose-500",
            shadow: "shadow-rose-500/20",
          },
        };
        const status =
          statusConfig[row.status] || statusConfig[APPROVAL_STATS.PENDING];

        return (
          <Badge size="sm" color={status.color as any} variant="light">
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${status.dot}`}
            />
            <span className="font-bold tracking-tight">{status.label}</span>
          </Badge>
        );
      },
    },
    {
      header: "Action",
      className: "text-right",
      render: (row) => (
        <TableActions
          id={row.uuid}
          dataName={row.employee_name}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShow={() => show.open(row.uuid)}
          baseNamePermission={RESOURCES.OVERTIME}
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
        tableTitle="Overtimes"
        data={overtimes}
        columns={columns}
        searchableKeys={["employee_name", "employee_nik"]}
        loading={isLoading}
        handleCreate={crud.openCreate}
        handleExport={handleExport}
        label="Overtime"
        baseNamePermission={RESOURCES.OVERTIME}
        newFilterComponent={
          <>
            {StartDateFilter}
            {EndDateFilter}
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

      <OvertimeModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        overtimeData={crud.form}
        setOvertimeData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
        isUserAdminOrHR={isRole(ROLES.ADMIN) || isRole(ROLES.HR)}
      />

      <OvertimeShowModal
        uuid={show.showId}
        isOpen={show.isOpen}
        onClose={show.close}
      />
    </>
  );
}
