import {
  useCreatePointRule,
  useDeletePointRule,
  useUpdatePointRule,
  useToggleStatusPointRule,
  usePointRules,
} from "@/hooks/usePointRule";
import { Column, PointRule, PointRuleInput } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useCrudModalForm } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import PointRuleModal from "@/pages/PointRule/Modal";
import { ClipboardList, Power, PowerOff, Star, Lock } from "lucide-react";
import { POINT_CATEGORY } from "@/constants/PointCategory";

export default function PointRuleTable() {
  // 1. Fetch data menggunakan interface PointRule
  const {
    data: pointRules = [],
    isLoading,
    isError,
    error,
  } = usePointRules(); // Asumsi nama hook fetch data

  const { mutateAsync: toggleStatus } = useToggleStatusPointRule();
  const { mutateAsync: createRule } = useCreatePointRule();
  const { mutateAsync: updateRule } = useUpdatePointRule();
  const { mutateAsync: deleteRule } = useDeletePointRule();

  // 2. Setup CRUD Form dengan PointRuleInput
  const crud = useCrudModalForm<PointRuleInput, any>({
    label: "Point Rule",
    emptyForm: {
      category: POINT_CATEGORY.ATTENDANCE,
      event_name: "",
      description: "",
      points: 0,
      operator: "==",
      min_value: null,
      max_value: null,
      is_active: true,
    },

    mapToPayload: (form) => ({
      category: form.category,
      event_name: form.event_name.trim(),
      description: form.description?.trim() || "",
      points: Number(form.points), // Pastikan dikiim sebagai angka
      operator: form.operator,
      min_value: form.min_value !== null ? Number(form.min_value) : null,
      max_value: form.max_value !== null ? Number(form.max_value) : null,
      is_active: form.is_active,
    }),

    createFn: createRule,
    updateFn: (uuid, payload) => updateRule({ uuid, data: payload }),
  });

  const handleEdit = (uuid: string) => {
    const rule = pointRules.find((r) => r.uuid === uuid);
    if (!rule) return;

    crud.openEdit({
      uuid: rule.uuid,
      category: rule.category,
      event_name: rule.event_name, // Ganti dari name ke event_name
      description: rule.description || "",
      points: rule.points, // Tambahkan points
      operator: rule.operator,
      min_value: rule.min_value,
      max_value: rule.max_value,
      is_active: rule.is_active,
    });
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteRule(uuid), {
      loading: "Deleting rule...",
      success: "Rule deleted successfully",
      error: "Failed to delete rule",
    });

  const handleToggleStatus = (uuid: string) =>
    handleMutation(() => toggleStatus(uuid), {
      loading: "Toggling status...",
      success: "Status updated successfully",
      error: "Failed to update status",
    });

  const columns: Column<PointRule>[] = [
    {
      header: "Event & Description",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <ClipboardList size={20} />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 capitalize dark:text-gray-100 truncate">
                {row.event_name}
              </span>
              {row.system_reserve && (
                <Lock size={12} className="text-amber-500 shrink-0" />
              )}
            </div>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              {row.category.replace(/_/g, " ")}
            </span>
            <span className="text-xs text-gray-500 line-clamp-1 mt-0.5">
              {row.description || "No description provided"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Logic Condition",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Badge variant="light" color="primary">
              {row.operator}
            </Badge>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {row.operator === "BETWEEN" 
                ? `${row.min_value} - ${row.max_value}` 
                : row.min_value ?? "-"}
            </span>
          </div>
          <p className="text-[9px] text-gray-400 italic">
            Trigger logic
          </p>
        </div>
      ),
    },
    {
      header: "Points",
      render: (row) => (
        <div className="flex items-center gap-1.5 font-semibold">
          <Star size={14} className={row.points >= 0 ? "text-yellow-500" : "text-red-500"} />
          <span className={row.points >= 0 ? "text-green-600" : "text-red-600"}>
            {row.points >= 0 ? `+${row.points}` : row.points}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <Badge variant="light" color={row.is_active ? "success" : "error"}>
          <div className="flex items-center gap-1">
            <span
              className={`h-1.5 w-1.5 rounded-full ${row.is_active ? "bg-green-500" : "bg-red-500"}`}
            />
            {row.is_active ? "Active" : "Inactive"}
          </div>
        </Badge>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <TableActions
          id={row.uuid}
          dataName={row.event_name}
          onEdit={handleEdit}
          onDelete={handleDelete}
          actions={[
            {
              label: row.is_active ? "Deactivate" : "Activate",
              variant: row.is_active ? "danger" : "success",
              icon: row.is_active ? <PowerOff size={16} /> : <Power size={16} />,
              onClick: (uuid) => handleToggleStatus(uuid),
            },
          ]}
          baseNamePermission={RESOURCES.POINT_RULE} // Pastikan RESOURCE nya sesuai
        />
      ),
    },
  ];

  if (isError) return <div className="p-4 text-red-500">Error: {(error as Error).message}</div>;

  return (
    <>
      <DataTable
        tableTitle="Point Rules Management"
        data={pointRules}
        columns={columns}
        searchableKeys={["event_name", "description"]}
        loading={isLoading}
        handleCreate={() => crud.openCreate()}
        label="Point Rule"
        baseNamePermission={RESOURCES.POINT_RULE}
      />

      <PointRuleModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        data={crud.form}
        setData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
      />
    </>
  );
}