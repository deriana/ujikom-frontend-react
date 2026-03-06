import {
  useCreateEmployeeShift,
  useDeleteEmployeeShift,
  useEmployeeShifts,
  useUpdateEmployeeShift,
} from "@/hooks/useEmployeeShift";

import { Column, EmployeeShift, EmployeeShiftInput } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import { useCrudModalForm } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import { formatDateID, isValidDate } from "@/utils/date";
import { Calendar, Clock } from "lucide-react";
import UserProfile from "@/components/UserProfile";
import { useGetEmployeeForInput } from "@/hooks/useUser";
import { useShiftTemplates } from "@/hooks/useShiftTemplate";
import EmployeeShiftModal from "@/pages/EmployeeShift/Modal";
import { useEffect, useMemo, useState } from "react";
import FilterDropdown from "@/components/FilterDropdown";
import DatePicker from "@/components/form/date-picker";

export default function EmployeeShiftsTable() {
  const today = new Date().toISOString().split("T")[0];
  const {
    data: employeeShifts = [],
    isLoading,
    isError,
    error,
    refetch
  } = useEmployeeShifts();

  const { mutateAsync: createEmployeeShift } = useCreateEmployeeShift();
  const { mutateAsync: updateEmployeeShift } = useUpdateEmployeeShift();
  const { mutateAsync: deleteEmployeeShift } = useDeleteEmployeeShift();
  const { data: employee = [] } = useGetEmployeeForInput();
  const { data: shift = [] } = useShiftTemplates();

  const [employeeFilter, setEmployeeFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>(today);

  const employeeOptions = useMemo(() => {
    const employees = Array.from(
      new Set(employeeShifts.map((u) => u.employee?.nik).filter(Boolean)),
    );
    return [
      { label: "All Employees", value: "all" },
      ...employees.map((t) => ({ label: t!, value: t! })),
    ];
  }, [employeeShifts]);

  const shiftOptions = useMemo(() => {
    const shifts = Array.from(
      new Set(
        employeeShifts.map((u) => u.shift_template?.name).filter(Boolean),
      ),
    );
    return [
      { label: "All Shifts", value: "all" },
      ...shifts.map((t) => ({ label: t!, value: t! })),
    ];
  }, [employeeShifts]);

  const crud = useCrudModalForm<EmployeeShiftInput, any>({
    label: "Employee Shift",
    emptyForm: {
      employee_nik: "",
      shift_template_uuid: "" as any,
      shift_date: "",
    },

    validate: (form) => {
      if (!form.employee_nik.trim()) return "Employee NIK is required";
      if (!form.shift_template_uuid) return "Shift template is required";
      if (!form.shift_date) return "Shift date is required";
      if (!isValidDate(form.shift_date)) return "Invalid shift date";

      return null;
    },

    mapToPayload: (form) => ({
      employee_nik: form.employee_nik.trim(),
      shift_template_uuid: form.shift_template_uuid,
      shift_date: form.shift_date,
    }),

    createFn: createEmployeeShift,
    updateFn: (uuid, payload) => updateEmployeeShift({ uuid, data: payload }),
  });

  const handleEdit = (uuid: string) => {
    const shift = employeeShifts.find((s) => s.uuid === uuid);
    if (!shift) return;

    crud.openEdit({
      uuid: shift.uuid,
      employee_nik: shift.employee.nik,
      shift_template_uuid: shift.shift_template.uuid,
      shift_date: shift.shift_date,
    });
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteEmployeeShift(uuid), {
      loading: "Deleting employee shift...",
      success: "Employee shift deleted successfully",
      error: "Failed to delete employee shift",
    });

  const handleCreate = () => crud.openCreate();

  const columns: Column<EmployeeShift>[] = [
    {
      header: "Employee",
      render: (row) => (
        <div className="flex items-center gap-3">
          <UserProfile
            src={row.employee?.profile_photo} 
            alt={row.employee?.name || "N/A"}
            size={36} 
            className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">
              {row.employee?.name || "-"}
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
              {row.employee?.nik || "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Shift Detail",
      render: (row) => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
              {row.shift_template?.name || "-"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 font-mono">
            <Clock size={14} className="text-gray-400" />
            <span>{row.shift_template?.start_time}</span>
            <span className="text-gray-300">—</span>
            <span>{row.shift_template?.end_time}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Date Scheduled",
      render: (row) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Calendar size={16} className="text-gray-400" />
          <span className="font-medium">{formatDateID(row.shift_date)}</span>
        </div>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <TableActions
          id={row.uuid}
          dataName={row.employee?.name}
          onEdit={handleEdit}
          onDelete={handleDelete}
          baseNamePermission={RESOURCES.EMPLOYEE_SHIFT}
        />
      ),
    },
  ];

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load employee shifts: {(error as Error).message}
      </div>
    );
  }

    const dateFilterComponent = (
      <DatePicker
        id="employeeShift-date"
        mode="single"
        placeholder="Date Filter"
        value={dateFilter}
        onChange={(dates) => {
          if (dates.length > 0) {
            const date = dates[0];
            const localDate = date.toLocaleDateString("en-CA"); // YYYY-MM-DD
            setDateFilter(localDate);
          }
        }}
      />
    );


  useEffect(() => {
    if (dateFilter) {
      refetch();
    }
  }, [dateFilter]);

  return (
    <>
      <DataTable
        tableTitle="Employee Shift Table"
        data={employeeShifts}
        columns={columns}
        searchableKeys={[
          "employee.name",
          "employee.nik",
          "shift_template.name",
          "shift_date",
        ]}
        loading={isLoading}
        handleCreate={handleCreate}
        label="Employee Shifts"
        baseNamePermission={RESOURCES.EMPLOYEE_SHIFT}
        newFilterComponent={
          <>
            <FilterDropdown
              value={employeeFilter}
              options={employeeOptions}
              onChange={setEmployeeFilter}
            />
            <FilterDropdown
              value={shiftFilter}
              options={shiftOptions}
              onChange={setShiftFilter}
            />
            {/* {dateFilterComponent} */}
          </>
        }
        extraFilters={{
          "employee.nik": employeeFilter,
          "shift_template.name": shiftFilter,
        //   "shift_date": dateFilter
        }}
      />

      <EmployeeShiftModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        data={crud.form}
        setData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
        employees={employee}
        shifts={shift}
      />
    </>
  );
}
