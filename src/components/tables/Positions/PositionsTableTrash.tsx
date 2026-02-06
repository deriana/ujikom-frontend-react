import Currency from "@/components/ui/currency/Currency";
import {
  useForceDeletePosition,
  usePositions,
  useRestorePosition,
} from "@/hooks/usePosition";
import { Column, Position } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import toast from "react-hot-toast";
import { DataTable } from "../BasicTables/DataTable";

export default function PositionsTableTrash() {
  const {
    data: positions = [],
    isLoading,
    isError,
    error,
  } = usePositions(true);
  const { mutateAsync: restorePosition } = useRestorePosition();
  const { mutateAsync: forceDeletePosition } = useForceDeletePosition();

  const handleRestore = async (uuid: string) => {
    try {
      await restorePosition(uuid);
      toast.success("Position Restored Successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(
        "Failed Restore Position: " + (err?.message.message || "Unknown error"),
      );
    }
  };

  const handleForceDelete = async (uuid: string) => {
    try {
      await forceDeletePosition(uuid);
      toast.success("Position Force Deleted Successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(
        "Failed Force Delete Position: " +
          (err?.message.message || "Unknown error"),
      );
    }
  };

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
