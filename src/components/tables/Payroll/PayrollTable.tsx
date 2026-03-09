import { useEffect, useMemo, useState } from "react";
import { Column, PayrollCreateInput, PayrollFormState, PayrollUpdateInput } from "@/types";
import { DataTable } from "@/components/tables/BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import {
  useBulkFinalizePayroll,
  useCreatePayroll,
  useFinalizePayroll,
  usePayrolls,
  useUpdatePayroll,
  useVoidPayroll,
} from "@/hooks/usePayroll";
import FilterDropdown from "@/components/FilterDropdown";
import TableActions from "../BasicTables/TableAction";
import { formatDateID } from "@/utils/date";
import { RESOURCES } from "@/constants/Resource";
import { useShowModal } from "@/hooks/useShowModal";
import { useCrudModalForm } from "@/hooks/useCrudModalForm";
import Currency from "@/components/ui/currency/Currency";
import PayrollShowModal from "@/pages/Payroll/ShowModal";
import { handleMutation } from "@/utils/handleMutation";
import { CheckCircle, X } from "lucide-react";
import Button from "@/components/ui/button/Button";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";
import MonthPicker from "@/components/form/MonthPicker";
import PayrollModal from "@/pages/Payroll/Modal";
import { useIsMobile } from "@/hooks/useIsMobile";

const STATUS_DRAFT = 0;
const STATUS_FINALIZED = 1;
const STATUS_VOIDED = 2;

const STATUS_LABELS: Record<number, string> = {
  [STATUS_DRAFT]: "Draft",
  [STATUS_FINALIZED]: "Finalized",
  [STATUS_VOIDED]: "Voided",
};

export default function PayrollTable() {
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");
  const [employeeFilter, setEmployeeFilter] = useState<string>("all");
  const now = new Date();
  const [periodFilter, setPeriodFilter] = useState<string>(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
  );
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [confirmBulk, setConfirmBulk] = useState<{
    isOpen: boolean;
    ids: (string | number)[];
  }>({ isOpen: false, ids: [] });

  const {
    data: payrolls = [],
    isLoading,
    isError,
    error,
    refetch,
  } = usePayrolls();
  const isMobile =  useIsMobile();

  const { mutateAsync: updatePayroll } = useUpdatePayroll();
  const { mutateAsync: createPayroll } = useCreatePayroll();
  const { mutateAsync: finalizePayroll } = useFinalizePayroll();
  const { mutateAsync: voidPayroll } = useVoidPayroll();
  const { mutateAsync: bulkFinalizePayroll } = useBulkFinalizePayroll();


  // Employee options
  const employeeOptions = useMemo(() => {
    const employees = Array.from(
      new Set(payrolls.map((p) => p.employee_name).filter(Boolean)),
    );
    return [
      { label: "All Employees", value: "all" },
      ...employees.map((e) => ({ label: e!, value: e! })),
    ];
  }, [payrolls]);

  // Status options
  const statusOptions = useMemo(
    () => [
      { label: "All Status", value: "all" },
      { label: STATUS_LABELS[STATUS_DRAFT], value: STATUS_DRAFT.toString() },
      {
        label: STATUS_LABELS[STATUS_FINALIZED],
        value: STATUS_FINALIZED.toString(),
      },
      {
        label: STATUS_LABELS[STATUS_VOIDED],
        value: STATUS_VOIDED.toString(),
      }
    ],
    [],
  );

  const crud = useCrudModalForm<PayrollFormState, any>({
    label: "Payroll",
    emptyForm: {
      month: "",
      employee_niks: [],
      manual_adjustment: 0,
      adjustment_note: "",
    },
    mapToPayload: (form) => {
      if (crud.isEdit) {
        return {
          manual_adjustment: form.manual_adjustment,
          adjustment_note: form.adjustment_note,
        } as PayrollUpdateInput;
      }

      return {
        month: form.month,
        employee_niks: form.employee_niks,
      } as PayrollCreateInput;
    },
    createFn: (payload) => createPayroll(payload),
    updateFn: (uuid, payload) => updatePayroll({ uuid, data: payload }),
  });

  const handleCreate = () => crud.openCreate();

  const handleEdit = (uuid: string) => {
    const item = payrolls.find((p) => p.uuid === uuid);
    if (!item) return;

    if (!item.can.update) {
      alert("You cannot edit this payroll as it has already been processed.");
      return;
    }

    crud.openEdit({
      uuid: item.uuid,
      manual_adjustment: item.manual_adjustment,
      adjustment_note: item.adjustment_note,
      employee_name: item.employee_name,
    } as any);
  };

  const show = useShowModal<string>();

  const handleShow = (uuid: string) => {
    show.open(uuid);
  };

  const handleFinalizeAction = (uuid: string) => {
    handleMutation(() => finalizePayroll(uuid), {
      loading: "Finalizing payroll...",
      success: "Payroll finalized successfully",
      error: "Failed to finalize payroll",
    });
  };

  const handleVoidAction = (uuid: string, note: string) => {
    handleMutation(() => voidPayroll({ uuid, note }), {
      loading: "Voiding payroll...",
      success: "Payroll voided successfully",
      error: "Failed to void payroll",
    });
  };

  const handleBulkFinalize = (ids: (string | number)[]) => {
    handleMutation(() => bulkFinalizePayroll({ payroll_uuids: ids as string[] }), {
      loading: "Finalizing payrolls...",
      success: "Payrolls finalized successfully",
      error: "Failed to finalize payrolls",
      onSuccess: () => {
        setSelectedIds([]);
        setConfirmBulk({ isOpen: false, ids: [] });
      },
    });
  };

  // Columns
  const columns: Column<any>[] = [
    {
      header: "Employee",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-white capitalize leading-tight">
            {row.employee_name}
          </span>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
            ID: {row.employee_nik.substring(0, 8)}...
          </span>
        </div>
      ),
    },
    {
      header: "Payroll Period",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium text-gray-600 dark:text-gray-300">
            {formatDateID(row.period_start)}
          </div>
          <span className="text-gray-400 text-xs">→</span>
          <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium text-gray-600 dark:text-gray-300">
            {formatDateID(row.period_end)}
          </div>
        </div>
      ),
    },
    {
      header: "Adjustment",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              Amount
            </span>
            <Currency
              value={row.manual_adjustment ?? 0}
              className={`text-sm font-medium ${row.manual_adjustment < 0
                ? "text-red-500"
                : row.manual_adjustment > 0
                  ? "text-emerald-500"
                  : "text-gray-400"
                }`}
            />
          </div>
          {row.adjustment_note && (
            <p
              className="text-[11px] text-gray-500 dark:text-gray-400 italic line-clamp-1 max-w-37.5"
              title={row.adjustment_note}
            >
              "{row.adjustment_note}"
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Salary Summary",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
              Gross
            </span>
            <Currency
              value={row.gross_salary}
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            />
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 pt-1">
            <span className="text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
              Net
            </span>
            <Currency
              value={row.net_salary}
              className="text-sm font-bold text-gray-900 dark:text-white"
            />
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      render: (row) => {
        const isFinalized = row.status === STATUS_FINALIZED;
        const isVoided = row.status === STATUS_VOIDED;

        const badgeConfig = isVoided
          ? { color: "error", label: "Voided", dot: "bg-red-500" }
          : isFinalized
            ? { color: "success", label: "Finalized", dot: "bg-green-500" }
            : { color: "warning", label: "Draft", dot: "bg-yellow-500" };

        return (
          <Badge
            size="sm"
            variant="light"
            color={badgeConfig.color as any}
          >
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${badgeConfig.dot}`} />
              <span className="capitalize">
                {STATUS_LABELS[row.status] || badgeConfig.label}
              </span>
            </div>
          </Badge>
        );
      },
    },
    {
      header: "Finalize/Void",
      render: (row) => {
        return (
          <TableActions
            id={row.uuid}
            dataName={`Payroll - ${row.employee_name}`}
            baseNamePermission={RESOURCES.OVERTIME}
            actions={
              row.can?.pay
                ? [
                  {
                    label: "Finalize",
                    variant: "success",
                    icon: <CheckCircle size={16} />,
                    onClick: (uuid) => handleFinalizeAction(uuid),
                  },
                  {
                    label: "Void",
                    variant: "danger",
                    icon: <X size={16} />,
                    showNote: true,
                    onClick: (uuid, note) =>
                      handleVoidAction(
                        uuid,
                        note || "",
                      ),
                  }
                ]
                : []
            }
          />
        );
      },
    },
    {
      header: "Action",
      render: (row) => (
        <TableActions
          id={row.uuid}
          dataName="Payroll"
          baseNamePermission={RESOURCES.PAYROLL}
          onShow={handleShow}
          onEdit={handleEdit}
          can={row.can}
        />
      ),
    },
  ];

 

  // Filtered data
  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((p) => {
      const matchesEmployee =
        employeeFilter === "all" || p.employee_name === employeeFilter;
      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter;
      const matchesPeriod = (() => {
        if (!periodFilter) return true;
        const [y, m] = periodFilter.split("-").map(Number);
        const fStart = new Date(y, m - 1, 1);
        const fEnd = new Date(y, m, 0); // last day of month
        const rStart = new Date(p.period_start);
        const rEnd = new Date(p.period_end);
        return rStart <= fEnd && rEnd >= fStart;
      })();
      return matchesEmployee && matchesStatus && matchesPeriod;
    });
  }, [payrolls, employeeFilter, statusFilter, periodFilter]);

  useEffect(() => {
    refetch();
  }, []);

  if (isError) {
    return (
      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
        <span className="font-bold">Error:</span> {(error as Error).message}
      </div>
    );
  }

   const StatusFilter = (
    filteredPayrolls.length > 1 && <FilterDropdown
      value={statusFilter.toString()}
      options={statusOptions}
      onChange={(val) => setStatusFilter(val === "all" ? "all" : Number(val))}
    />
  );

  const EmployeeFilter = (
    employeeOptions.length > 2 && <FilterDropdown
      value={employeeFilter}
      options={employeeOptions}
      onChange={setEmployeeFilter}
    />
  );

  return (
    <>
      <DataTable
        tableTitle="Payrolls"
        data={filteredPayrolls}
        columns={columns}
        loading={isLoading}
        searchableKeys={["employee_name", "status"]}
        label="Payroll"
        baseNamePermission={RESOURCES.PAYROLL}
        handleCreate={handleCreate}
        newFilterComponent={
          <>
            {StatusFilter}
            {EmployeeFilter}
            <MonthPicker
              id="payroll-period-filter"
              value={periodFilter}
              onChange={setPeriodFilter}
              placeholder="Filter by period"
              className="min-w-40"
            />
          </>
        }
        extraFilters={{
          employee_name: employeeFilter,
          status: statusFilter.toString(),
        }}
        enableSelection
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        hideChecbox={!filteredPayrolls.some((p) => p.can?.pay)}
        selectionActions={(selectedIds) =>
          selectedIds.length > 0 && (
            <Button
              onClick={() => setConfirmBulk({ isOpen: true, ids: selectedIds })}
              variant="primary"
              size="sm"
            >
              <CheckCircle size={14} />
              Finalize
            </Button>
          )
        }
      />

      <PayrollModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        payrollData={crud.form}
        setPayrollData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
        isEdit={crud.isEdit}
      />

      <PayrollShowModal
        uuid={show.showId}
        isOpen={show.isOpen}
        onClose={show.close}
      />

      <ConfirmModal
        isOpen={confirmBulk.isOpen}
        onClose={() => setConfirmBulk({ isOpen: false, ids: [] })}
        onConfirm={() => handleBulkFinalize(confirmBulk.ids)}
        title="Finalize Selected Payrolls"
        message={`Are you sure you want to finalize ${confirmBulk.ids.length} payroll(s)? This action cannot be undone.`}
        confirmLabel="Yes, Finalize"
        variant="success"
      />
    </>
  );
}
