import {
  useAllowances,
  useForceDeleteAllowance,
  useRestoreAllowance,
} from "@/hooks/useAllowance";
import { Column } from "@/types";
import { Allowance, AllowanceType } from "@/types/allowance.types";
import Badge from "@/components/ui/badge/Badge";
import { DataTable } from "../BasicTables/DataTable";
import TableActions from "../BasicTables/TableAction";
import toast from "react-hot-toast";
import { RESOURCES } from "@/constants/Resource";
import { allowanceTypeMap } from "@/constants/Allowance";
import Currency from "@/components/ui/currency/Currency";

export default function AllowanceTableTrash() {
  const {
    data: allowances = [],
    isError,
    error,
    isLoading,
  } = useAllowances(true);
  const { mutateAsync: restoreAllowance } = useRestoreAllowance();
  const { mutateAsync: forceDeleteAllowance } = useForceDeleteAllowance();

  const handleRestore = async (uuid: string) => {
    try {
      await restoreAllowance(uuid);
      toast.success("Allowance Restored Successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(
        "Failed Restore Allowance: " +
          (err?.message.message || "Unknown error"),
      );
    }
  };

  const handleForceDelete = async (uuid: string) => {
    try {
      await forceDeleteAllowance(uuid);
      toast.success("Allowance Force Deleted Successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(
        "Failed Force Delete Allowance: " +
          (err?.message.message || "Unknown error"),
      );
    }
  };

  const columns: Column<Allowance>[] = [
    {
      header: "Allowances Name",
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
          onRestore={handleRestore}
          onForceDelete={handleForceDelete}
          baseNamePermission={RESOURCES.ALLOWANCE}
        />
      ),
    },
  ];

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load trashed allowances: {(error as Error).message}
      </div>
    );
  }

  return (
    <DataTable
      tableTitle="Trashed Allowances"
      data={allowances}
      columns={columns}
      searchableKeys={["name"]}
      loading={isLoading}
      label="Trashed Allowances"
      baseNamePermission={RESOURCES.ALLOWANCE}
    />
  );
}
