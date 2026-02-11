import {
  useCreateHoliday,
  useDeleteHoliday,
  useHolidays,
  useUpdateHoliday,
} from "@/hooks/useHoliday";
import { Column, Holiday, HolidayInput } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useCrudModalForm } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import { formatDateID, isValidDate } from "@/utils/date";
import HolidayModal from "@/pages/Holidays/Modal";

export default function HolidaysTable() {
  const { data: holidays = [], isLoading, isError, error } = useHolidays();

  const { mutateAsync: createHoliday } = useCreateHoliday();
  const { mutateAsync: updateHoliday } = useUpdateHoliday();
  const { mutateAsync: deleteHoliday } = useDeleteHoliday();

  const crud = useCrudModalForm<HolidayInput, any>({
    label: "Holiday",
    emptyForm: {
      name: "",
      date: "",
      is_recurring: false,
    },

    validate: (form) => {
      if (!form.name.trim()) return "Holiday name is required";
      if (!form.date) return "Holiday date is required";
      if (!isValidDate(form.date)) return "Invalid date format";

      return null;
    },

    mapToPayload: (form) => ({
      name: form.name.trim().replace(/\s+/g, " "),
      date: form.date,
      is_recurring: form.is_recurring,
    }),

    createFn: createHoliday,
    updateFn: (uuid, payload) => updateHoliday({ uuid, data: payload }),
  });

  const handleEdit = (uuid: string) => {
    const holiday = holidays.find((h) => h.uuid === uuid);
    if (!holiday) return;

    crud.openEdit({
      uuid: holiday.uuid,
      name: holiday.name,
      date: holiday.date,
      is_recurring: holiday.is_recurring,
    });
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteHoliday(uuid), {
      loading: "Deleting holiday...",
      success: "Holiday deleted successfully",
      error: "Failed to delete holiday",
    });

  const handleCreate = () => crud.openCreate();

  const columns: Column<Holiday>[] = [
    {
      header: "Holiday Name",
      render: (row) => (
        <span className="font-medium text-gray-800 capitalize dark:text-white/90">
          {row.name}
        </span>
      ),
    },
    {
      header: "Date",
      render: (row) => (
        <span className="text-gray-700 dark:text-white/80">
          {formatDateID(row.date)}
        </span>
      ),
    },
    {
      header: "Type",
      render: (row) =>
        row.is_recurring ? (
          <Badge size="sm" color="warning">
            Recurring
          </Badge>
        ) : (
          <Badge size="sm" color="success">
            One-time
          </Badge>
        ),
    },
    {
      header: "Created By",
      render: (row) => (
        <span className="text-gray-600 dark:text-white/70">
          {row.creator?.name ?? "-"}
        </span>
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
          baseNamePermission={RESOURCES.HOLIDAY}
        />
      ),
    },
  ];

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load holidays: {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      <DataTable
        tableTitle="Holiday Table"
        data={holidays}
        columns={columns}
        searchableKeys={["name"]}
        loading={isLoading}
        handleCreate={handleCreate}
        label="Holidays"
        baseNamePermission={RESOURCES.HOLIDAY}
      />

      <HolidayModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        holidayData={crud.form}
        setHolidayData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
      />
    </>
  );
}
