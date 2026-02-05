import Currency from "@/components/ui/currency/Currency";
import { usePositions } from "@/hooks/usePosition";
import { Column, Position } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import toast from "react-hot-toast";
import { DataTable } from "../BasicTables/DataTable";

export default function PositionsTable() {
  const { data: positions = [], isLoading, isError, error } = usePositions();

  const handleCreate = () => {
    toast.success("Create Postion");
  };

  const handleEdit = (uuid: string) => {
    toast.success(`Edit Postion ${uuid}`);
  };

  const handleDelete = async (uuid: string) => {
    toast.success(`Delete Postion ${uuid}`);
  };

  const handleShow = (uuid: string) => {
    toast.success(`Show Postion ${uuid}`);
  };

  const columns: Column<Position>[] = [
    {
      header: "Postions Name",
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
    </>
  );
}
