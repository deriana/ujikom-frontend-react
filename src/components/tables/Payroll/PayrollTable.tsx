import { useEffect, useMemo, useState } from "react";
import { Column, PayrollUpdateInput } from "@/types";
import { DataTable } from "@/components/tables/BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import {
  useBulkFinalizePayroll,
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
import PayrollModal from "@/pages/Payroll/Modal";
import PayrollShowModal from "@/pages/Payroll/ShowModal";
import { handleMutation } from "@/utils/handleMutation";
import { CheckCircle, X } from "lucide-react";
import Button from "@/components/ui/button/Button";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";

const STATUS_DRAFT = 0;
const STATUS_FINALIZED = 1;

const STATUS_LABELS: Record<number, string> = {
  [STATUS_DRAFT]: "Draft",
  [STATUS_FINALIZED]: "Finalized",
};

export default function PayrollTable() {
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");
  const [employeeFilter, setEmployeeFilter] = useState<string>("all");
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

  const { mutateAsync: updatePayroll } = useUpdatePayroll();
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
    ],
    [],
  );

  const crud = useCrudModalForm<PayrollUpdateInput, PayrollUpdateInput>({
    label: "Payroll",
    emptyForm: {
      manual_adjustment: 0,
      adjustment_note: "",
    },
    mapToPayload: (form) => ({
      manual_adjustment: form.manual_adjustment,
      adjustment_note: form.adjustment_note,
    }),
    updateFn: (uuid, payload) => updatePayroll({ uuid, data: payload }),
  });

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
            ID: {row.uuid.substring(0, 8)}...
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
        return (
          <Badge
            size="sm"
            variant="light"
            color={isFinalized ? "success" : "warning"}
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${isFinalized ? "bg-green-500" : "bg-yellow-500"}`}
              />
              {STATUS_LABELS[row.status] ||
                (isFinalized ? "Finalized" : "Draft")}
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
                  // {
                  //   label: "Void",
                  //   variant: "danger",
                  //   icon: <X size={16} />,
                  //   showNote: true,
                  //   onClick: (uuid, note) =>
                  //     handleVoidAction(
                  //       uuid,
                  //       note || "",
                  //     ),
                  // }
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

  const StatusFilter = (
    <FilterDropdown
      value={statusFilter.toString()}
      options={statusOptions}
      onChange={(val) => setStatusFilter(val === "all" ? "all" : Number(val))}
    />
  );

  const EmployeeFilter = (
    <FilterDropdown
      value={employeeFilter}
      options={employeeOptions}
      onChange={setEmployeeFilter}
    />
  );

  // Filtered data
  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((p) => {
      const matchesEmployee =
        employeeFilter === "all" || p.employee_name === employeeFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === STATUS_FINALIZED
          ? p.status === STATUS_FINALIZED
          : p.status === STATUS_DRAFT);
      return matchesEmployee && matchesStatus;
    });
  }, [payrolls, employeeFilter, statusFilter]);

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

  return (
    <>
      <DataTable
        tableTitle="Payrolls"
        data={filteredPayrolls}
        columns={columns}
        loading={isLoading}
        searchableKeys={["employee_name", "status"]}
        label="Payroll"
        newFilterComponent={
          <>
            {StatusFilter}
            {EmployeeFilter}
          </>
        }
        extraFilters={{
          employee_name: employeeFilter,
          status: statusFilter.toString(),
        }}
        enableSelection
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
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
