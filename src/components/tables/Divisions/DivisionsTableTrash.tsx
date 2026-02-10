import { useDivisions, useForceDeleteDivision, useRestoreDivision } from "@/hooks/useDivision";
import { useTrashActions } from "@/hooks/useTrashActions";
import { Column } from "@/types";
import { Division } from "@/types/division.types";
import Badge from "@/components/ui/badge/Badge";
import { DataTable } from "../BasicTables/DataTable";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";

export default function DivisionTableTrash() {
  const { data: divisions = [], isError, error, isLoading } = useDivisions(true);
  const { mutateAsync: restoreDivision } = useRestoreDivision();
  const { mutateAsync: forceDeleteDivision } = useForceDeleteDivision();

  const { handleRestore, handleForceDelete } = useTrashActions({
    label: "Division",
    restoreFn: restoreDivision,
    forceDeleteFn: forceDeleteDivision,
  });

  const columns: Column<Division>[] = [
    {
      header: "Division Name",
      render: (row) => (
        <span className="font-medium text-gray-800 capitalize dark:text-white/90">
          {row.name}
        </span>
      ),
    },
    {
      header: "Division Code",
      render: (row) => <Badge>{row.code}</Badge>,
    },
    {
      header: "Teams",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.teams.map((team) => (
            <Badge key={team.uuid} size="sm" color="info">
              {team.name}
            </Badge>
          ))}
        </div>
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
          baseNamePermission={RESOURCES.DIVISION}
        />
      ),
    },
  ];

  if (isError) {
    return <div className="text-red-500 text-sm">
      Failed to load trashed divisions: {(error as Error).message}
    </div>;
  }

  return (
    <DataTable
      tableTitle="Trashed Divisions"
      data={divisions}
      columns={columns}
      searchableKeys={["name", "code"]}
      loading={isLoading}
      label="Trashed Divisions"
      baseNamePermission={RESOURCES.DIVISION}
    />
  );
}
