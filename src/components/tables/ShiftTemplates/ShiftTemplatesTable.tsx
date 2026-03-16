import {
  useCreateShiftTemplate,
  useDeleteShiftTemplate,
  useShiftTemplates,
  useUpdateShiftTemplate,
} from "@/hooks/useShiftTemplate";
import { Column, ShiftTemplate, ShiftTemplateInput } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useCrudModalForm } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import ShiftTemplateModal from "@/pages/ShiftTemplate/Modal";
import { useMemo, useState } from "react";
import FilterDropdown from "@/components/FilterDropdown";

export default function ShiftTemplatesTable() {
  const {
    data: shiftTemplatesData,
    isLoading,
    isError,
    error,
  } = useShiftTemplates();

  const shiftTemplates = (shiftTemplatesData as ShiftTemplate[]) || [];

  const { mutateAsync: createShiftTemplate } = useCreateShiftTemplate();
  const { mutateAsync: updateShiftTemplate } = useUpdateShiftTemplate();
  const { mutateAsync: deleteShiftTemplate } = useDeleteShiftTemplate();

  const [crossDayFilter, setCrossDayFilter] = useState("all");

  const crossDayOptions = useMemo(() => {
    return [
      { label: "All", value: "all" },
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ];
  }, [])


  const crud = useCrudModalForm<ShiftTemplateInput, any>({
    label: "Shift Template",
    emptyForm: {
      name: "",
      start_time: "",
      end_time: "",
      cross_day: false,
      late_tolerance_minutes: undefined,
    },

    validate: (form) => {
      if (!form.name.trim()) return "Shift name is required";
      if (!form.start_time) return "Start time is required";
      if (!form.end_time) return "End time is required";

      if (form.start_time === form.end_time)
        return "Start time and end time must be different";

      if (
        form.late_tolerance_minutes !== undefined &&
        form.late_tolerance_minutes < 0
      ) {
        return "Late tolerance must be 0 or more";
      }

      return null;
    },

    mapToPayload: (form) => ({
      name: form.name.trim().replace(/\s+/g, " "),
      start_time: form.start_time,
      end_time: form.end_time,
      cross_day: form.cross_day,
      late_tolerance_minutes: form.late_tolerance_minutes,
    }),

    createFn: createShiftTemplate,
    updateFn: (uuid, payload) => updateShiftTemplate({ uuid, data: payload }),
  });

  const handleEdit = (uuid: string) => {
    const shiftTemplate = shiftTemplates.find((p) => p.uuid === uuid);
    if (!shiftTemplate) return;

    // console.log("Start Time:", shiftTemplate.start_time, "End Time:", shiftTemplate.end_time);
    crud.openEdit({
      uuid: shiftTemplate.uuid,
      name: shiftTemplate.name,
      start_time: shiftTemplate.start_time,
      end_time: shiftTemplate.end_time,
      cross_day: shiftTemplate.cross_day,
      late_tolerance_minutes: shiftTemplate.late_tolerance_minutes,
    });
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteShiftTemplate(uuid), {
      loading: "Deleting shiftTemplate...",
      success: "ShiftTemplate deleted successfully",
      error: "Failed to delete shiftTemplate",
    });

  const handleCreate = () => crud.openCreate();

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
            onEdit={handleEdit}
            onDelete={handleDelete}
            baseNamePermission={RESOURCES.SHIFT_TEMPLATE}
          />
      ),
    },
  ];

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load shiftTemplates: {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      <DataTable
        tableTitle="ShiftTemplate Table"
        data={shiftTemplates}
        columns={columns}
        searchableKeys={["name"]}
        loading={isLoading}
        handleCreate={handleCreate}
        label="ShiftTemplates"
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

      <ShiftTemplateModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        shiftData={crud.form}
        setShiftData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
      />
    </>
  );
}
