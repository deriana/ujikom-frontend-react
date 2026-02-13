import {
  useShiftTemplates,
  useForceDeleteShiftTemplate,
  useRestoreShiftTemplate,
} from "@/hooks/useShiftTemplate";
import { Column } from "@/types";
import { ShiftTemplate } from "@/types/shiftTemplate.types";
import Badge from "@/components/ui/badge/Badge";
import { DataTable } from "../BasicTables/DataTable";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { useTrashActions } from "@/hooks/useTrashActions";
import { useMemo, useState } from "react";
import FilterDropdown from "@/components/FilterDropdown";

export default function ShiftTemplateTableTrash() {
  const {
    data: shiftTemplates = [],
    isError,
    error,
    isLoading,
  } = useShiftTemplates(true);
  const { mutateAsync: restoreShiftTemplate } = useRestoreShiftTemplate();
  const { mutateAsync: forceDeleteShiftTemplate } =
    useForceDeleteShiftTemplate();

  const { handleRestore, handleForceDelete } = useTrashActions({
    label: "ShiftTemplate",
    restoreFn: restoreShiftTemplate,
    forceDeleteFn: forceDeleteShiftTemplate,
  });

  const [crossDayFilter, setCrossDayFilter] = useState("all");

  const crossDayOptions = useMemo(() => {
    return [
      { label: "All", value: "all" },
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ];
  }, []);

  const columns: Column<ShiftTemplate>[] = [
    {
      header: "Shift Name",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      header: "Time",
      render: (row) => (
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
            {row.start_time}
          </span>
          <span className="text-gray-400">—</span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
            {row.end_time}
          </span>
        </div>
      ),
    },
    {
      header: "Cross Day",
      render: (row) => (
        <Badge
          size="sm"
          variant="solid"
          color={row.cross_day ? "warning" : "success"}
        >
          {row.cross_day ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      header: "Late Tolerance",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <span className="text-gray-700 dark:text-gray-300 font-mono">
            {row.late_tolerance_minutes ?? 0}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500 uppercase">
            min
          </span>
        </div>
      ),
    },
    {
      header: "Employees",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Badge size="sm" color="primary">
            {row.employee_shifts_count}
          </Badge>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Total
          </span>
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
          baseNamePermission={RESOURCES.SHIFT_TEMPLATE}
        />
      ),
    },
  ];

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load trashed shiftTemplates: {(error as Error).message}
      </div>
    );
  }

  return (
    <DataTable
      tableTitle="Trashed ShiftTemplates"
      data={shiftTemplates}
      columns={columns}
      searchableKeys={["name"]}
      loading={isLoading}
      label="Trashed ShiftTemplates"
      baseNamePermission={RESOURCES.SHIFT_TEMPLATE}
      extraFilters={{ cross_day: crossDayFilter }}
      newFilterComponent={
        <FilterDropdown
          value={crossDayFilter}
          options={crossDayOptions}
          onChange={setCrossDayFilter}
        />
      }
    />
  );
}
