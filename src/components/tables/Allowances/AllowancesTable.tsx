import {
  useAllowances,
  useCreateAllowance,
  useDeleteAllowance,
  useUpdateAllowance,
} from "@/hooks/useAllowance";
import { Allowance, AllowanceInput, AllowanceType, Column } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { allowanceTypeMap } from "@/constants/Allowance";
import Currency from "@/components/ui/currency/Currency";
import { useMemo, useState } from "react";
import AllowanceModal from "@/pages/Allowances/Modal";
import AllowanceShowModal from "@/pages/Allowances/ShowModal";
import FilterDropdown from "@/components/FilterDropdown";
import { useCrudModalForm, useShowModal } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";

export default function AllowanceTable() {
  const { data: allowances = [], isLoading, isError, error } = useAllowances();
  const { mutateAsync: createAllowance } = useCreateAllowance();
  const { mutateAsync: updateAllowance } = useUpdateAllowance();
  const { mutateAsync: deleteAllowance } = useDeleteAllowance();

  const show = useShowModal<string>();

  const crud = useCrudModalForm<AllowanceInput, AllowanceInput>({
    label: "Allowance",
    emptyForm: { name: "", type: "fixed", amount: 0 },
    validate: (form) => {
      const name = form.name.trim();
      if (!name) return "Allowance name is required";
      if (name.length < 3) return "Allowance name must be at least 3 characters";
      // if (form.amount < 0) return "Amount cannot be negative";
      return null;
    },
    mapToPayload: (form) => ({
      name: form.name.trim().replace(/\s+/g, " "),
      type: form.type,
      amount: form.amount,
    }),
    createFn: createAllowance,
    updateFn: (uuid, payload) => updateAllowance({ uuid, data: payload }),
  });

  const [typeFilter, setTypeFilter] = useState("all");

  const typeOptions = useMemo(() => {
    return [
      { label: "All Types", value: "all" },
      ...Object.entries(allowanceTypeMap).map(([key, meta]) => ({
        label: meta.label,
        value: key,
      })),
    ];
  }, []);

  const handleEdit = (uuid: string) => {
    const allowance = allowances.find((a) => a.uuid === uuid);
    if (!allowance) return;
    crud.openEdit({
      uuid: allowance.uuid,
      name: allowance.name,
      type: allowance.type,
      amount: allowance.amount,
    });
  };

  const handleCreate = () => crud.openCreate();

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteAllowance(uuid), {
      loading: "Deleting allowance...",
      success: "Allowance deleted successfully",
      error: "Failed to delete allowance",
    });

  const handleShow = (uuid: string) => show.open(uuid);

  const columns: Column<Allowance>[] = [
    {
      header: "Allowance Name",
      render: (row) => (
        <span className="font-medium text-gray-800 capitalize dark:text-white/90">
          {row.name}
        </span>
      ),
    },
    {
      header: "Type",
      render: (row: { type: AllowanceType }) => {
        const meta = allowanceTypeMap[row.type];
        return (
          <Badge color={meta.color} size="sm">
            {meta.label}
          </Badge>
        );
      },
    },
    {
      header: "Amount",
      render: (row) => (
        <Currency
          value={row.amount}
          className="font-medium text-gray-800 dark:text-white/90"
        />
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
          onShow={handleShow}
          baseNamePermission={RESOURCES.ALLOWANCE}
        />
      ),
    },
  ];

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load allowances: {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      <DataTable
        tableTitle="Allowance Table"
        data={allowances} // semua data mentah
        columns={columns}
        searchableKeys={["name"]}
        loading={isLoading}
        handleCreate={handleCreate}
        label="Allowances"
        baseNamePermission={RESOURCES.ALLOWANCE}
        extraFilters={{ type: typeFilter }} // ini yang bikin filter diterapkan langsung
        newFilterComponent={
          <FilterDropdown
            value={typeFilter}
            options={typeOptions}
            onChange={setTypeFilter}
          />
        }
      />

      <AllowanceModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        allowanceData={crud.form}
        setAllowanceData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
      />

      <AllowanceShowModal
        uuid={show.showId}
        isOpen={show.isOpen}
        onClose={show.close}
      />
    </>
  );
}
