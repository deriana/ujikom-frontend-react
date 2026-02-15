import {
  useEmployeeWorkSchedules,
  useCreateEmployeeWorkSchedule,
  useUpdateEmployeeWorkSchedule,
  useDeleteEmployeeWorkSchedule,
} from "@/hooks/useEmployeeWorkSchedule";
import {
  EmployeeWorkSchedule,
  EmployeeWorkScheduleInput,
  Column,
} from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import { useMemo, useState } from "react";
import FilterDropdown from "@/components/FilterDropdown";
import { useCrudModalForm } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import { Calendar, Briefcase } from "lucide-react";
import UserProfile from "@/components/UserProfile";
import EmployeeWorkScheduleModal from "@/pages/EmployeeWorkSchedule/Modal";
import { useWorkSchedules } from "@/hooks/useWorkSchedules";
import { useGetEmployeeForInput } from "@/hooks/useUser";
import { formatDateID } from "@/utils/date";

export default function EmployeeWorkScheduleTable() {
  const {
    data: employeeWorkSchedules = [],
    isLoading,
    isError,
    error,
  } = useEmployeeWorkSchedules();

  const { mutateAsync: createWS } = useCreateEmployeeWorkSchedule();
  const { mutateAsync: updateWS } = useUpdateEmployeeWorkSchedule();
  const { mutateAsync: deleteWS } = useDeleteEmployeeWorkSchedule();

  const { data: workSchedule = [] } = useWorkSchedules();
  const { data: employee = [] } = useGetEmployeeForInput();

  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [scheduleFilter, setScheduleFilter] = useState("all");

  const employeeOptions = useMemo(() => {
    const names = Array.from(
      new Set(
        employeeWorkSchedules.map((s) => s.employee?.name).filter(Boolean),
      ),
    );
    return [
      { label: "All Employees", value: "all" },
      ...names.map((n) => ({ label: n!, value: n! })),
    ];
  }, [employeeWorkSchedules]);

  const scheduleOptions = useMemo(() => {
    const schedules = Array.from(
      new Set(
        employeeWorkSchedules.map((s) => s.work_schedule?.name).filter(Boolean),
      ),
    );
    return [
      { label: "All Schedules", value: "all" },
      ...schedules.map((s) => ({ label: s!, value: s! })),
    ];
  }, [employeeWorkSchedules]);

  const modeOptions = useMemo(() => {
    const modes = Array.from(
      new Set(
        employeeWorkSchedules
          .map((s) =>
            typeof s.work_schedule?.work_mode === "object"
              ? s.work_schedule?.work_mode?.name
              : s.work_schedule?.work_mode,
          )
          .filter(Boolean),
      ),
    );

    return [
      { label: "All Modes", value: "all" },
      ...modes.map((m) => ({ label: m!, value: m! })),
    ];
  }, [employeeWorkSchedules]);

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Active Today", value: "true" },
    { label: "Inactive", value: "false" },
  ];

  const crud = useCrudModalForm<
    EmployeeWorkScheduleInput,
    EmployeeWorkScheduleInput
  >({
    label: "Employee Work Schedule",
    emptyForm: {
      employee_nik: "",
      work_schedule_uuid: "",
      start_date: "",
      end_date: null,
    },
    validate: (form) => {
      if (!form.employee_nik) return "Employee is required";
      if (!form.work_schedule_uuid) return "Work schedule is required";
      if (!form.start_date) return "Start date is required";
      return null;
    },
    mapToPayload: (form) => ({
      employee_nik: form.employee_nik,
      work_schedule_uuid: form.work_schedule_uuid,
      start_date: form.start_date,
      end_date: form.end_date,
    }),
    createFn: createWS,
    updateFn: (uuid, payload) => updateWS({ uuid, data: payload }),
  });

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteWS(uuid), {
      loading: "Deleting assignment...",
      success: "Assignment deleted successfully",
      error: "Failed to delete assignment",
    });

  const handleEdit = (uuid: string) => {
    console.log("Editing UUID:", uuid); // <-- ini log UUID
    const ws = employeeWorkSchedules.find((w) => w.uuid === uuid);
    if (!ws) return;
    crud.openEdit({
      uuid: ws.uuid,
      employee_nik: ws.employee.nik ?? "",
      work_schedule_uuid: ws.work_schedule.uuid ?? "",
      start_date: ws.start_date ?? "",
      end_date: ws.end_date ?? null,
    });
  };

  const columns: Column<EmployeeWorkSchedule>[] = [
    {
      header: "Employee Details",
      render: (row) => (
        <div className="flex items-center gap-3">
          <UserProfile
            src={row.employee?.profile_photo} // ganti ini sesuai field foto employee
            alt={row.employee?.name || "N/A"}
            size={36} // bisa disesuaikan
            className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
          />
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 dark:text-gray-100 leading-tight">
              {row.employee?.name || "N/A"}
            </span>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
              {row.employee?.nik || "No ID"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Schedule & Mode",
      render: (row) => {
        // Menangani perbedaan format JSON (string vs object)
        const workMode =
          typeof row.work_schedule?.work_mode === "object"
            ? row.work_schedule?.work_mode?.name
            : row.work_schedule?.work_mode;

        const modeColors: Record<string, string> = {
          WFO: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400",
          WFH: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400",
          HYBRID:
            "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
        };

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Briefcase className="w-3.5 h-3.5" />
              {row.work_schedule?.name || "No Schedule"}
            </div>
            <span
              className={`w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${modeColors[workMode || ""] || "bg-gray-100 text-gray-600"}`}
            >
              {workMode || "Not Set"}
            </span>
          </div>
        );
      },
    },
    {
      header: "Contract Period",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="tabular-nums">{formatDateID(row.start_date)}</span>
            <span className="text-gray-400">→</span>
            <span
              className={
                row.end_date
                  ? "tabular-nums"
                  : "italic text-blue-500 font-medium"
              }
            >
              {row.end_date ? formatDateID(row.end_date) : "Present"}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase italic">
            Updated: {new Date(row.updated_at).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      header: "Live Status",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {row.is_active_today && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${row.is_active_today ? "bg-green-500" : "bg-gray-400"}`}
            ></span>
          </span>
          <span
            className={`text-xs font-semibold ${row.is_active_today ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}
          >
            {row.is_active_today ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <TableActions
          id={row.uuid}
          dataName={row.employee?.name || "N/A"}
          onEdit={handleEdit}
          onDelete={handleDelete}
          baseNamePermission={RESOURCES.EMPLOYEE_WORK_SCHEDULE}
        />
      ),
    },
  ];

  if (isError)
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
        Error: {(error as Error).message}
      </div>
    );

  return (
    <>
      <DataTable
        tableTitle="Employee Schedule Assignments"
        data={employeeWorkSchedules}
        columns={columns}
        searchableKeys={["employee.name", "work_schedule.name"]}
        loading={isLoading}
        handleCreate={() => crud.openCreate()}
        label="Assignment"
        baseNamePermission={RESOURCES.EMPLOYEE_WORK_SCHEDULE}
        newFilterComponent={
          <>
            <FilterDropdown
              value={employeeFilter}
              options={employeeOptions}
              onChange={setEmployeeFilter}
            />
            <FilterDropdown
              value={scheduleFilter}
              options={scheduleOptions}
              onChange={setScheduleFilter}
            />
            <FilterDropdown
              value={modeFilter}
              options={modeOptions}
              onChange={setModeFilter}
            />
            <FilterDropdown
              value={statusFilter}
              options={statusOptions}
              onChange={setStatusFilter}
            />
          </>
        }
        extraFilters={{
          "employee.name": employeeFilter,
          "work_schedule.name": scheduleFilter,
          "work_schedule.work_mode": modeFilter,
          is_active_today: statusFilter,
        }}
      />

      <EmployeeWorkScheduleModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        data={crud.form}
        setData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
        employees={employee}
        schedules={workSchedule}
      />
    </>
  );
}
