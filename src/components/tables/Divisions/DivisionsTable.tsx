import { Column, Division, DivisionInput } from "@/types";
import { DataTable } from "@/components/tables/BasicTables/DataTable";
import TableActions from "@/components/tables/BasicTables/TableAction";
import {
  useDeleteDivision,
  useDivisions,
  useCreateDivision,
  useUpdateDivision,
} from "@/hooks/useDivision";
import Badge from "@/components/ui/badge/Badge";
import DivisionModal from "@/pages/Division/Modal";
import DivisionShowModal from "@/pages/Division/ShowModal";
import { RESOURCES } from "@/constants/Resource";
import { useCrudModalForm, useShowModal } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";

export default function DivisionTable() {
  const { data: divisions = [], isLoading, isError, error } = useDivisions();
  const { mutateAsync: deleteDivision } = useDeleteDivision();
  const { mutateAsync: createDivision } = useCreateDivision();
  const { mutateAsync: updateDivision } = useUpdateDivision();
  const show = useShowModal<string>();
  const crud = useCrudModalForm<DivisionInput, DivisionInput>({
    label: "Division",
    emptyForm: { name: "", code: "", teams: [] },
    validate: (form) => {
      if (!form.name.trim()) return "Division name is required";
      if (!form.code.trim()) return "Division code is required";
      return null;
    },

    mapToPayload: (form) => ({
      name: form.name.trim().replace(/\s+/g, " "), 
      code: form.code.trim().toUpperCase(),
      teams: form.teams,
    }),
    createFn: createDivision,
    updateFn: (uuid, payload) => updateDivision({ uuid, data: payload }),
  });

  const handleEdit = (uuid: string) => {
    const division = divisions.find((d) => d.uuid === uuid);
    if (!division) return;
    crud.openEdit({
      uuid: division.uuid,
      name: division.name,
      code: division.code,
      teams: division.teams.map((t) => ({ uuid: t.uuid, name: t.name })),
    });
  };

  const handleCreate = () => {
    crud.openCreate();
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteDivision(uuid), {
      loading: "Deleting division...",
      success: "Division deleted successfully",
      error: "Failed to delete division",
    });

  const handleShow = (uuid: string) => {
    show.open(uuid);
  };

  const MAX_TEAMS = 3;
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
      render: (row) => {
        const teams = row.teams ?? [];

        return (
          <div className="flex flex-wrap gap-1">
            {teams.length > 0 ? (
              <>
                {teams.slice(0, MAX_TEAMS).map((team) => (
                  <Badge key={team.uuid} size="sm" color="info">
                    {team.name}
                  </Badge>
                ))}

                {teams.length > MAX_TEAMS && (
                  <Badge size="sm" color="warning">
                    +{teams.length - MAX_TEAMS} more
                  </Badge>
                )}
              </>
            ) : (
              <Badge size="sm" color="error">
                No Teams
              </Badge>
            )}
          </div>
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
          baseNamePermission={RESOURCES.DIVISION}
        />
      ),
    },
  ];

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load divisions: {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      <DataTable
        tableTitle="Divisions Table"
        data={divisions}
        columns={columns}
        searchableKeys={["name", "code"]}
        loading={isLoading}
        handleCreate={handleCreate}
        label="Divisions"
        baseNamePermission={RESOURCES.DIVISION}
      />

      <DivisionModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        divisionData={crud.form}
        setDivisionData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
      />

      <DivisionShowModal
        uuid={show.showId}
        isOpen={show.isOpen}
        onClose={show.close}
      />
    </>
  );
}
