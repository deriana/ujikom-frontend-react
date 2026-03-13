import {
  useCreateAssessmentCategory,
  useDeleteAssessmentCategory,
  useAssessmentCategories,
  useUpdateAssessmentCategory,
  useToggleStatusAssessmentCategory,
} from "@/hooks/useAssessmentCategory";
import { Column, AssessmentCategory, AssessmentCategoryInput } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useCrudModalForm } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import AssessmentCategoryModal from "@/pages/AssessmentCategory/Modal";
import { ClipboardList, User, Power, PowerOff } from "lucide-react";

export default function AssessmentCategoryTable() {
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useAssessmentCategories();
  const { mutateAsync: toggleStatusCategory } =
    useToggleStatusAssessmentCategory();

  const { mutateAsync: createCategory } = useCreateAssessmentCategory();
  const { mutateAsync: updateCategory } = useUpdateAssessmentCategory();
  const { mutateAsync: deleteCategory } = useDeleteAssessmentCategory();

  const crud = useCrudModalForm<AssessmentCategoryInput, any>({
    label: "Assessment Category",
    emptyForm: {
      name: "",
      description: "",
      is_active: true,
    },

    validate: (form) => {
      if (!form.name.trim()) return "Category name is required";
      return null;
    },

    mapToPayload: (form) => ({
      name: form.name.trim(),
      description: form.description.trim(),
      is_active: form.is_active,
    }),

    createFn: createCategory,
    updateFn: (uuid, payload) => updateCategory({ uuid, data: payload }),
  });

  const handleEdit = (uuid: string) => {
    const category = categories.find((h) => h.uuid === uuid);
    if (!category) return;

    crud.openEdit({
      uuid: category.uuid,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
    });
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteCategory(uuid), {
      loading: "Deleting category...",
      success: "Category deleted successfully",
      error: "Failed to delete category",
    });

  const handleCreate = () => crud.openCreate();

  const handleToggleStatus = (uuid: string) =>
    handleMutation(() => toggleStatusCategory(uuid), {
      loading: "Toggling status...",
      success: "Status toggled successfully",
      error: "Failed to toggle status",
    });

  const columns: Column<AssessmentCategory>[] = [
    {
      header: "Category Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <ClipboardList size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 capitalize dark:text-gray-100">
              {row.name}
            </span>
            <span className="text-xs text-gray-500 line-clamp-1 max-w-50">
              {row.description || "No description provided"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Created By",
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <User size={12} />
          {row.creator?.name ? (
            <span className="truncate max-w-25">{row.creator.name}</span>
          ) : (
            "System"
          )}
        </span>
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
          dataName={row.name}
          onEdit={handleEdit}
          onDelete={handleDelete}
          actions={
            row.can?.update
              ? [
                  {
                    label: row.is_active ? "Deactivate" : "Activate",
                    variant: row.is_active ? "danger" : "success",
                    icon: row.is_active ? (
                      <PowerOff size={16} />
                    ) : (
                      <Power size={16} />
                    ),
                    onClick: (uuid) => handleToggleStatus(uuid),
                  },
                ]
              : []
          }
          baseNamePermission={RESOURCES.ASSESSMENT_CATEGORY}
        />
      ),
    },
  ];

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load categories: {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      <DataTable
        tableTitle="Assessment Category Table"
        data={categories}
        columns={columns}
        searchableKeys={["name", "description"]}
        loading={isLoading}
        handleCreate={handleCreate}
        label="Categories"
        baseNamePermission={RESOURCES.ASSESSMENT_CATEGORY}
      />

      <AssessmentCategoryModal
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
