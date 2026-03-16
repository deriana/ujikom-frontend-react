import {
  useWorkSchedules,
  useCreateWorkSchedule,
  useUpdateWorkSchedule,
  useDeleteWorkSchedule,
} from "@/hooks/useWorkSchedules";
import { WorkSchedule, WorkScheduleInput, Column } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import { useMemo, useState } from "react";
import FilterDropdown from "@/components/FilterDropdown";
import { useCrudModalForm } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import { WORK_MODE_OPTIONS, WORK_MODE } from "@/constants/WorkMode";
import { Clock, MapPin, Globe } from "lucide-react";
import WorkScheduleModal from "@/pages/WorkSchedules/Modal";

export default function WorkScheduleTable() {
  const {
    data: workSchedulesData,
    isLoading,
    isError,
    error,
  } = useWorkSchedules();

  const workSchedules = (workSchedulesData as WorkSchedule[]) || [];

  const { mutateAsync: createWorkSchedule } = useCreateWorkSchedule();
  const { mutateAsync: updateWorkSchedule } = useUpdateWorkSchedule();
  const { mutateAsync: deleteWorkSchedule } = useDeleteWorkSchedule();

  const [modeFilter, setModeFilter] = useState("all");

  const crud = useCrudModalForm<WorkScheduleInput, WorkScheduleInput>({
    label: "Work Schedule",
    emptyForm: {
      name: "",
      work_mode_id: undefined,
      work_start_time: "",
      work_end_time: "",
      break_start_time: "",
      break_end_time: "",
      late_tolerance_minutes: 0,
      requires_office_location: false,
    },
    validate: (form) => {
      const name = form.name.trim();
      if (!name) return "Work schedule name is required";
      if (!form.work_mode_id) return "Work mode is required";
      if (!form.work_start_time || !form.work_end_time)
        return "Time range is required";
      if (form.work_end_time <= form.work_start_time)
        return "End time must be after start time";
      if (!form.break_start_time || !form.break_end_time)
        return "Break time range is required";
      if (form.break_end_time <= form.break_start_time)
        return "End time must be after start time";
      if (
        form.late_tolerance_minutes !== null &&
        form.late_tolerance_minutes !== undefined &&
        form.late_tolerance_minutes < 0
      )
        return "Late tolerance must be a positive number";
      return null;
    },
    mapToPayload: (form) => ({
      name: form.name.trim(),
      work_mode_id: form.work_mode_id,
      work_start_time: form.work_start_time?.slice(0, 5) ?? "",
      work_end_time: form.work_end_time?.slice(0, 5) ?? "",
      break_start_time: form.break_start_time?.slice(0, 5) ?? "",
      break_end_time: form.break_end_time?.slice(0, 5) ?? "",
      late_tolerance_minutes: form.late_tolerance_minutes,
      requires_office_location: form.requires_office_location,
    }),
    createFn: createWorkSchedule,
    updateFn: (uuid, payload) => updateWorkSchedule({ uuid, data: payload }),
  });

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteWorkSchedule(uuid), {
      loading: "Deleting WorkSchedule...",
      success: "WorkSchedule deleted successfully",
      error: "Failed to delete WorkSchedule",
    });

  // --- Filter Logic ---
  const filteredData = useMemo(() => {
    if (modeFilter === "all") return workSchedules;
    return workSchedules.filter(
      (ws) => ws.work_mode?.id.toString() === modeFilter,
    );
  }, [workSchedules, modeFilter]);

  const modeOptions = useMemo(
    () => [
      { label: "All Modes", value: "all" },
      ...WORK_MODE_OPTIONS.map((mode) => ({
        label: mode.label,
        value: mode.value.toString(),
      })),
    ],
    [],
  );

  // --- Handlers ---
  const handleEdit = (uuid: string) => {
    const ws = workSchedules.find((w) => w.uuid === uuid);
    if (!ws) return;
    crud.openEdit({
      uuid: ws.uuid,
      name: ws.name,
      work_mode_id: ws.work_mode?.id,
      work_start_time: ws.work_start_time || "",
      work_end_time: ws.work_end_time || "",
      break_start_time: ws.break_start_time || "",
      break_end_time: ws.break_end_time || "",
      late_tolerance_minutes: ws.late_tolerance_minutes ?? 0,
      requires_office_location: ws.requires_office_location ?? false,
    });
  };

  const columns: Column<WorkSchedule>[] = [
    {
      header: "Schedule Name",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-white">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      header: "Work Mode",
      render: (row) => {
        const modeEntry = Object.values(WORK_MODE).find(
          (m) => m.id === row.work_mode?.id,
        );
        const colorClass =
          modeEntry?.color === "blue"
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            : modeEntry?.color === "green"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";

        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${colorClass}`}
          >
            {row.work_mode?.name || "N/A"}
          </span>
        );
      },
    },
    {
      header: "Shift Hours",
      render: (row) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-mono">
            {row.work_start_time?.slice(0, 5) || "00:00"} -{" "}
            {row.work_end_time?.slice(0, 5) || "00:00"}
          </span>
        </div>
      ),
    },
    {
      header: "Late Tolerance",
      render: (row) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <span className="text-sm font-medium">
            {row.late_tolerance_minutes ?? 0}{" "}
            <span className="text-gray-500 dark:text-gray-400 font-normal">
              mins
            </span>
          </span>
        </div>
      ),
    },
    {
      header: "Break Hours",
      render: (row) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-mono">
            {row.break_start_time?.slice(0, 5) || "00:00"} -{" "}
            {row.break_end_time?.slice(0, 5) || "00:00"}
          </span>
        </div>
      ),
    },
    {
      header: "Location Rule",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.requires_office_location ? (
            <>
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Office Bound
              </span>
            </>
          ) : (
            <>
              <Globe className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Anywhere
              </span>
            </>
          )}
        </div>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <TableActions
          id={row.uuid}
          dataName={row.name}
          onEdit={handleEdit}
          onDelete={handleDelete}
          baseNamePermission={RESOURCES.WORK_SCHEDULE}
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
        tableTitle="Work Schedule Management"
        data={filteredData}
        columns={columns}
        searchableKeys={["name"]}
        loading={isLoading}
        handleCreate={() => crud.openCreate()}
        label="Work Schedule"
        baseNamePermission={RESOURCES.WORK_SCHEDULE}
        newFilterComponent={
          <FilterDropdown
            value={modeFilter}
            options={modeOptions}
            onChange={setModeFilter}
          />
        }
      />

      <WorkScheduleModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        data={crud.form}
        setData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
      />
    </>
  );
}
