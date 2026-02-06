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
import toast from "react-hot-toast";
import { DataTable } from "../BasicTables/DataTable";
import { useState } from "react";
import PositionModal from "@/pages/Positions/Modal";
import PositionShowModal from "@/pages/Positions/ShowModal";
import Badge from "@/components/ui/badge/Badge";

export default function PositionsTable() {
  const { data: positions = [], isLoading, isError, error } = usePositions();
  const { data: allowances = [] } = useAllowances();

  const { mutateAsync: deletePosition } = useDeletePosition();
  const { mutateAsync: createPosition } = useCreatePosition();
  const { mutateAsync: updatePosition } = useUpdatePosition();

  const [showUuid, setShowUuid] = useState<string | null>(null);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);

  const emptyForm: PositionInput = {
    name: "",
    base_salary: 0,
    allowances: [],
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [positionData, setPositionData] = useState<PositionInput>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const openCreate = () => {
    setPositionData(emptyForm);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEdit = (uuid: string) => {
    const position = positions.find((p) => p.uuid === uuid);
    if (!position) return;

    setPositionData({
      uuid: position.uuid,
      name: position.name,
      base_salary: position.base_salary,
      allowances: position.allowances.map((a) => ({
        uuid: a.uuid,
        name: a.name,
        amount: a.amount ?? 0,
      })),
    });

    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPositionData(emptyForm);
    setIsEditMode(false);
  };

  const handleSubmit = async () => {
    if (!positionData.name.trim()) {
      toast.error("Position name is required");
      return;
    }

    if (positionData.base_salary <= 0) {
      toast.error("Base salary must be greater than 0");
      return;
    }

    const cleanedAllowances = positionData.allowances
      .filter((a) => a.uuid)
      .map((a) => ({
        uuid: a.uuid,
        amount: a.amount,
      }));

    const hasDuplicate =
      new Set(cleanedAllowances.map((a) => a.uuid)).size !==
      cleanedAllowances.length;

    if (hasDuplicate) {
      toast.error("Duplicate allowances are not allowed");
      return;
    }

    const payload = {
      name: positionData.name,
      base_salary: positionData.base_salary,
      allowances: cleanedAllowances,
    };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updatePosition({ uuid: positionData.uuid!, data: payload });
        toast.success("Position updated successfully!");
      } else {
        await createPosition(payload);
        toast.success("Position created successfully!");
      }

      closeModal();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save position");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (uuid: string) => {
    try {
      await deletePosition(uuid);
      toast.success("Position deleted successfully!");
    } catch {
      toast.error("Failed delete position");
    }
  };

  const handleShow = (uuid: string) => {
    setShowUuid(uuid);
    setIsShowModalOpen(true);
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
      header: "Allowances",
      render: (row) => {
        const count = row.allowances?.length ?? 0;

        if (count === 0) {
          return (
            <Badge size="sm" color="error">No Allowance</Badge>
          );
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
          onEdit={openEdit}
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
        handleCreate={openCreate}
        label="Positions"
        baseNamePermission={RESOURCES.POSITION}
      />

      <PositionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        positionData={positionData}
        setPositionData={setPositionData}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        allowanceOptions={allowances.map((a) => ({
          uuid: a.uuid,
          name: a.name,
          amount: a.amount, // default master amount
        }))}
      />

      <PositionShowModal
        uuid={showUuid}
        isOpen={isShowModalOpen}
        onClose={() => setIsShowModalOpen(false)}
      />
    </>
  );
}
