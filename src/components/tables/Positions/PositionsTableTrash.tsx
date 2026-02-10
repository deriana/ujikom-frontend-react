import Currency from "@/components/ui/currency/Currency";
import {
  useForceDeletePosition,
  usePositions,
  useRestorePosition,
} from "@/hooks/usePosition";
import { Column, Position } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import { useTrashActions } from "@/hooks/useTrashActions";

export default function PositionsTableTrash() {
  const {
    data: positions = [],
    isLoading,
    isError,
    error,
  } = usePositions(true);
  const { mutateAsync: restorePosition } = useRestorePosition();
  const { mutateAsync: forceDeletePosition } = useForceDeletePosition();

  const { handleRestore, handleForceDelete } = useTrashActions({
    label: "Position",
    restoreFn: restorePosition,
    forceDeleteFn: forceDeletePosition,
  });

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
      header: "Action",
      render: (row) => (
        <TableActions
          id={row.uuid}
          dataName={row.name}
          onRestore={handleRestore}
          onForceDelete={handleForceDelete}
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
        label="Positions"
        baseNamePermission={RESOURCES.POSITION}
      />
    </>
  );
}
