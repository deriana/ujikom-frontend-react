import { Column } from "@/types";
import { DataTable } from "@/components/tables/BasicTables/DataTable";
import TableActions from "@/components/tables/BasicTables/TableAction";
import toast from "react-hot-toast";
import {
  useDeleteDivision,
  useDivisions,
  useCreateDivision,
  useUpdateDivision,
} from "@/hooks/useDivision";
import { Division, DivisionInput } from "@/types/division.types";
import Badge from "@/components/ui/badge/Badge";
import { useState } from "react";
import DivisionModal from "@/pages/Division/Modal";

export default function DivisionTable() {
  const { data: divisions = [], isLoading, isError, error } = useDivisions();
  const { mutate: deleteDivision } = useDeleteDivision();
  const { mutateAsync: createDivision } = useCreateDivision();
  const { mutateAsync: updateDivision } = useUpdateDivision();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [divisionData, setDivisionData] = useState<DivisionInput>({
    name: "",
    code: "",
    teams: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEdit = (uuid: string) => {
    const division = divisions.find((d) => d.uuid === uuid);
    if (!division) return;

    setDivisionData({
      uuid: division.uuid,
      name: division.name,
      code: division.code,
      teams: division.teams.map((t) => ({ name: t.name })),
    });

    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    try {
      await deleteDivision(uuid);
      toast.success("Division Deleted Successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(
        "Failed Delete Division: " + (err?.message.message || "Unknown error"),
      );
    }
  };

  const handleCreate = () => {
    setDivisionData({ name: "", code: "", teams: [] });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!divisionData.name.trim()) {
      toast.error("Division name is required");
      return;
    }
    if (!divisionData.code.trim()) {
      toast.error("Division code is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateDivision({
          uuid: divisionData.uuid!,
          data: {
            name: divisionData.name,
            code: divisionData.code,
            teams: divisionData.teams,
          },
        });
        toast.success("Division updated successfully!");
      } else {
        await createDivision(divisionData);
        toast.success("Division created successfully!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save division");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Badge key={team.id} size="sm" color="info">
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
          onEdit={handleEdit}
          onDelete={handleDelete}
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
      />

      <DivisionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        divisionData={divisionData}
        setDivisionData={setDivisionData}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </>
  );
}
