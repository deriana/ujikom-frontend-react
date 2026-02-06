import Currency from "@/components/ui/currency/Currency";
import {
  useCreatePosition,
  useDeletePosition,
  usePositions,
  useUpdatePosition,
} from "@/hooks/usePosition";
import { useAllowances } from "@/hooks/useAllowance";
import { Column, Position, PositionInput } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import PositionModal from "@/pages/Positions/Modal";
import PositionShowModal from "@/pages/Positions/ShowModal";
import Badge from "@/components/ui/badge/Badge";
import { useCrudModalForm, useShowModal } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";

export default function PositionsTable() {
  const { data: positions = [], isLoading, isError, error } = usePositions();
  const { data: allowances = [] } = useAllowances();

  const { mutateAsync: createPosition } = useCreatePosition();
  const { mutateAsync: updatePosition } = useUpdatePosition();
  const { mutateAsync: deletePosition } = useDeletePosition();

  const show = useShowModal<string>();

  const crud = useCrudModalForm<PositionInput, any>({
    label: "Position",
    emptyForm: {
      name: "",
      base_salary: 0,
      allowances: [],
    },

    validate: (form) => {
      const name = form.name.trim();
      if (!name) return "Position name is required";
      if (name.length < 3) return "Position name must be at least 3 characters";
      if (form.base_salary <= 0) return "Base salary must be greater than 0";

      const cleaned = form.allowances.filter((a) => a.uuid);
      const hasDuplicate =
        new Set(cleaned.map((a) => a.uuid)).size !== cleaned.length;

      if (hasDuplicate) return "Duplicate allowances are not allowed";

      return null;
    },

    mapToPayload: (form) => {
      const cleanedAllowances = form.allowances
        .filter((a) => a.uuid)
        .map((a) => ({
          uuid: a.uuid,
          amount: a.amount,
        }));

      return {
        name: form.name.trim().replace(/\s+/g, " "),
        base_salary: form.base_salary,
        allowances: cleanedAllowances,
      };
    },

    createFn: createPosition,
    updateFn: (uuid, payload) => updatePosition({ uuid, data: payload }),
  });

  const handleEdit = (uuid: string) => {
    const position = positions.find((p) => p.uuid === uuid);
    if (!position) return;

    crud.openEdit({
      uuid: position.uuid,
      name: position.name,
      base_salary: position.base_salary,
      allowances: position.allowances.map((a) => ({
        uuid: a.uuid,
        name: a.name,
        amount: a.amount ?? 0,
      })),
    });
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deletePosition(uuid), {
      loading: "Deleting position...",
      success: "Position deleted successfully",
      error: "Failed to delete position",
    });

  const handleShow = (uuid: string) => show.open(uuid);
  const handleCreate = () => crud.openCreate();

  const columns: Column<Position>[] = [
    {
      header: "Position Name",
      render: (row) => (
        <span className="font-medium text-gray-800 capitalize dark:text-white/90">
          {row.name}
        </span>
      ),
    },
    {
      header: "Base Salary",
      render: (row) => (
        <Currency
          value={row.base_salary}
          className="font-medium text-gray-800 dark:text-white/90"
        />
      ),
    },
    {
      header: "Allowances",
      render: (row) => {
        const count = row.allowances?.length ?? 0;

        if (count === 0) {
          return <Badge size="sm" color="error">No Allowance</Badge>;
        }

        return (
          <Badge size="sm" color="primary">
            {count} Allowance{count > 1 ? "s" : ""}
          </Badge>
        );
      },
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
          baseNamePermission={RESOURCES.POSITION}
        />
      ),
    },
  ];

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load positions: {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      <DataTable
        tableTitle="Position Table"
        data={positions}
        columns={columns}
        searchableKeys={["name"]}
        loading={isLoading}
        handleCreate={handleCreate}
        label="Positions"
        baseNamePermission={RESOURCES.POSITION}
      />

      <PositionModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        positionData={crud.form}
        setPositionData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
        allowanceOptions={allowances.map((a) => ({
          uuid: a.uuid,
          name: a.name,
          amount: a.amount,
        }))}
      />

      <PositionShowModal
        uuid={show.showId}
        isOpen={show.isOpen}
        onClose={show.close}
      />
    </>
  );
}
