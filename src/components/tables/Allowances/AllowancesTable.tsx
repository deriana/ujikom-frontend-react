import {
  useAllowances,
  useCreateAllowance,
  useDeleteAllowance,
  useUpdateAllowance,
} from "@/hooks/useAllowance";
import { Allowance, AllowanceInput, AllowanceType, Column } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import toast from "react-hot-toast";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { allowanceTypeMap } from "@/constants/Allowance";
import Currency from "@/components/ui/currency/Currency";
import { useMemo, useState } from "react";
import AllowanceModal from "@/pages/Allowances/Modal";
import AllowanceShowModal from "@/pages/Allowances/ShowModal";
import FilterDropdown from "@/components/FilterDropdown";

export default function AllowanceTable() {
  const { data: allowances = [], isLoading, isError, error } = useAllowances();
  const { mutateAsync: createAllowance } = useCreateAllowance();
  const { mutateAsync: updateAllowance } = useUpdateAllowance();
  const { mutateAsync: deleteAllowance } = useDeleteAllowance();
  const [showUuid, setShowUuid] = useState<string | null>(null);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allowanceData, setAllowanceData] = useState<AllowanceInput>({
    name: "",
    type: "fixed",
    amount: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const typeOptions = useMemo(() => {
    return [
      { label: "All Types", value: "all" },
      ...Object.entries(allowanceTypeMap).map(([key, meta]) => ({
        label: meta.label,
        value: key,
      })),
    ];
  }, []);

  const filteredAllowances = useMemo(() => {
    if (!allowances) return [];

    return allowances.filter((allowance) => {
      if (typeFilter === "all") return true;
      return allowance.type === typeFilter;
    });
  }, [allowances, typeFilter]);

  const handleEdit = (uuid: string) => {
    const allowance = allowances.find((a) => a.uuid === uuid);
    if (!allowance) return;

    setAllowanceData({
      uuid: allowance.uuid,
      name: allowance.name,
      type: allowance.type,
      amount: allowance.amount,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    try {
      await deleteAllowance(uuid);
      toast.success("Allowance Deleted Successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(
        "Failed Delete Allowance: " + (err?.message || "Unknown error"),
      );
    }
  };

  const handleShow = (uuid: string) => {
    setShowUuid(uuid);
    setIsShowModalOpen(true);
  };

  const handleCreate = () => {
    setAllowanceData({ name: "", type: "fixed", amount: 0 });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!allowanceData.name.trim()) {
      toast.error("Allowance name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateAllowance({
          uuid: allowanceData.uuid!,
          data: allowanceData,
        });
        toast.success("Edit Allowance");
      } else {
        await createAllowance(allowanceData);
        toast.success("Create Allowance");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save allowance");
    } finally {
      setIsSubmitting(false);
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
        data={filteredAllowances}
        columns={columns}
        searchableKeys={["name"]}
        loading={isLoading}
        handleCreate={handleCreate}
        label="Allowances"
        baseNamePermission={RESOURCES.ALLOWANCE}
        newFilterComponent={
          <FilterDropdown
            value={typeFilter}
            options={typeOptions}
            onChange={(val) => setTypeFilter(val)}
          />
        }
      />

      <AllowanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allowanceData={allowanceData}
        setAllowanceData={setAllowanceData}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />

      <AllowanceShowModal
        uuid={showUuid}
        isOpen={isShowModalOpen}
        onClose={() => setIsShowModalOpen(false)}
      />
    </>
  );
}
