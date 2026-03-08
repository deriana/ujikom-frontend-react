import {
  useWorkSchedules,
  useForceDeleteWorkSchedule,
  useRestoreWorkSchedule,
} from "@/hooks/useWorkSchedules";
import { Column } from "@/types";
import { WorkSchedule } from "@/types/workSchedule.types";
import { DataTable } from "../BasicTables/DataTable";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { useTrashActions } from "@/hooks/useTrashActions";
import { Clock, Globe, MapPin } from "lucide-react";
import { WORK_MODE } from "@/constants/WorkMode";

export default function WorkScheduleTableTrash() {
  const {
    data: workSchedulesData,
    isError,
    error,
    isLoading,
  } = useWorkSchedules({ trashed: true });

  const workSchedules = (workSchedulesData as WorkSchedule[]) || [];
  const { mutateAsync: restoreWorkSchedule } = useRestoreWorkSchedule();
  const { mutateAsync: forceDeleteWorkSchedule } = useForceDeleteWorkSchedule();

  const { handleRestore, handleForceDelete } = useTrashActions({
    label: "WorkSchedule",
    restoreFn: restoreWorkSchedule,
    forceDeleteFn: forceDeleteWorkSchedule,
  });

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
          onRestore={handleRestore}
          onForceDelete={handleForceDelete}
          baseNamePermission={RESOURCES.WORK_SCHEDULE}
        />
      ),
    },
  ];

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load trashed workSchedules: {(error as Error).message}
      </div>
    );
  }

  return (
    <DataTable
      tableTitle="Trashed WorkSchedules"
      data={workSchedules}
      columns={columns}
      searchableKeys={["name"]}
      loading={isLoading}
      label="Trashed WorkSchedules"
      baseNamePermission={RESOURCES.WORK_SCHEDULE}
    />
  );
}
