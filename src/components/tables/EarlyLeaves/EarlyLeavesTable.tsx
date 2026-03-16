import {
  useCreateEarlyLeave,
  useDeleteEarlyLeave,
  useEarlyLeaves,
  useExportEarlyLeave,
  useUpdateEarlyLeave,
} from "@/hooks/useEarlyLeave";
import { Column, EarlyLeave, EarlyLeaveInput } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useCrudModalForm, useShowModal } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import { useRoleName } from "@/hooks/useRoleName";
import { ROLES } from "@/constants/Roles";
import { useEffect, useMemo, useState } from "react";
import {
  APPROVAL_LABEL,
  APPROVAL_STATS,
} from "@/constants/Approval";
import FilterDropdown from "@/components/FilterDropdown";
import { Clock } from "lucide-react";
// import { AuthContext } from "@/context/AuthContext";
import EarlyLeaveModal from "@/pages/EarlyLeaves/Modal";
import EarlyLeaveShowModal from "@/pages/EarlyLeaves/ShowModal";
import { formatDateID } from "@/utils/date";
import toast from "react-hot-toast";
import DatePicker from "@/components/form/date-picker";
interface EarlyLeavesTableProps {
  onDataLoaded?: (data: any[]) => void;
}

export default function EarlyLeavesTable({
  onDataLoaded,
}: EarlyLeavesTableProps) {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);
  const {
    data: earlyLeaves = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useEarlyLeaves({ start_date: startDate, end_date: endDate });
  const { mutateAsync: createEarlyLeave } = useCreateEarlyLeave();
  const { mutateAsync: updateEarlyLeave } = useUpdateEarlyLeave();
  const { mutateAsync: deleteEarlyLeave } = useDeleteEarlyLeave();
  const { mutateAsync: exportEarlyLeave } = useExportEarlyLeave();
  // const { mutateAsync: approveEarlyLeave } = useEarlyLeaveApprovals();
  const { isRole } = useRoleName();
  // const { user } = useContext(AuthContext);

  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = useMemo(() => {
    return earlyLeaves.filter((item) => {
      const matchEmployee =
        employeeFilter === "all" || item.employee_name === employeeFilter;
      const matchStatus =
        statusFilter === "all" || item.status.toString() === statusFilter;
      return matchEmployee && matchStatus;
    });
  }, [earlyLeaves, employeeFilter, statusFilter]);

  useEffect(() => {
    if (onDataLoaded) {
      onDataLoaded(filteredData);
    }
  }, [filteredData, onDataLoaded]);

  const employeeOptions = useMemo(() => {
    const employees = Array.from(
      new Set(earlyLeaves.map((l) => l.employee_name)),
    ).filter(Boolean);

    return [
      { label: "All Employees", value: "all" },
      ...employees.map((name) => ({ label: name, value: name })),
    ];
  }, [earlyLeaves]);

  const statusOptions = useMemo(() => {
    return [
      { label: "All Status", value: "all" },
      ...Object.entries(APPROVAL_LABEL).map(([value, label]) => ({
        label,
        value: value.toString(),
      })),
    ];
  }, []);

  const show = useShowModal<string>();
  const crud = useCrudModalForm<EarlyLeaveInput, FormData>({
    label: "Early Leave Request",
    emptyForm: {
      reason: "",
      attachment: null,
      employee_nik: undefined,
    },
    validate: (form) => {
      if (!form.reason || form.reason.trim().length < 3)
        return "Reason must be at least 3 characters";
      return null;
    },
    mapToPayload: (form) => {
      const formData = new FormData();
      formData.append("reason", form.reason.trim());
      if (form.employee_nik) formData.append("employee_nik", form.employee_nik);
      if (form.attachment instanceof File)
        formData.append("attachment", form.attachment);
      return formData;
    },
    createFn: (payload) => createEarlyLeave(payload as any),
    updateFn: (uuid, payload) =>
      updateEarlyLeave({ uuid, data: payload as any }),
  });

  const handleEdit = (uuid: string) => {
    const item = earlyLeaves.find((p) => p.uuid === uuid);
    if (!item) return;

    if (
      !isRole(ROLES.ADMIN) &&
      !isRole(ROLES.HR) &&
      item.status !== APPROVAL_STATS.PENDING
    ) {
      toast.error("You cannot edit a processed request.");
      return;
    }

    crud.openEdit({
      uuid: item.uuid,
      employee_nik: item.employee_nik,
      reason: item.reason,
      attachment: item.attachment
        ? {
            exists: true,
            filename: item.attachment.filename,
            download_url: item.attachment.download_url,
          }
        : null,
    });
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteEarlyLeave(uuid), {
      loading: "Deleting...",
      success: "Deleted successfully",
      error: "Failed to delete",
    });

   const handleExport = () =>
      handleMutation(
        () =>
          exportEarlyLeave({
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
  
    useEffect(() => {
      if (startDate && endDate) {
        refetch();
      }
    }, [startDate, endDate]);

  const columns: Column<EarlyLeave>[] = [
    {
      header: "Employee",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {row.employee_name}
          </span>
          <span className="text-xs text-gray-500">NIK: {row.employee_nik}</span>
        </div>
      ),
    },
    {
      header: "Early Leave Info",
      render: (row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-700 dark:text-gray-200">
            {formatDateID(row.date)}
          </div>
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <Clock size={12} />
            {row.minutes_early} Minutes Early
          </div>
        </div>
      ),
    },
    {
      header: "Reason",
      render: (row) => (
        <span
          className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-45 block italic"
          title={row.reason}
        >
          "{row.reason}"
        </span>
      ),
    },
    {
      header: "Status",
      render: (row) => {
        const statusConfig = {
          [APPROVAL_STATS.PENDING]: {
            label: "Pending",
            color: "warning",
            dot: "bg-amber-500",
          },
          [APPROVAL_STATS.APPROVED]: {
            label: "Approved",
            color: "success",
            dot: "bg-emerald-500",
          },
          [APPROVAL_STATS.REJECTED]: {
            label: "Rejected",
            color: "error",
            dot: "bg-rose-500",
          },
        };
        const status =
          statusConfig[row.status as keyof typeof statusConfig] ||
          statusConfig[0];
        return (
          <Badge size="sm" color={status.color as any} variant="light">
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status.dot}`} />
            {status.label}
          </Badge>
        );
      },
    },
    {
      header: "Action",
      render: (row) => (
        <TableActions
          id={row.uuid}
          dataName={row.employee_name}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShow={() => show.open(row.uuid)}
          baseNamePermission={RESOURCES.EARLY_LEAVE}
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
        tableTitle="Early Leave Requests"
        data={earlyLeaves}
        columns={columns}
        searchableKeys={["employee_name", "employee_nik"]}
        loading={isLoading}
        handleCreate={crud.openCreate}
        handleExport={handleExport}
        label="Early Leave"
        baseNamePermission={RESOURCES.EARLY_LEAVE}
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

      <EarlyLeaveModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        earlyLeaveData={crud.form}
        setEarlyLeaveData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
        isUserAdminOrHR={isRole(ROLES.ADMIN) || isRole(ROLES.HR)}
      />

      <EarlyLeaveShowModal
        uuid={show.showId}
        isOpen={show.isOpen}
        onClose={show.close}
      />
    </>
  );
}
