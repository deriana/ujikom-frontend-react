import {
  useCreatePointItem,
  useDeletePointItem,
  useUpdatePointItem,
  useToggleStatusPointItem,
  usePointItems,
} from "@/hooks/usePointItem";
import { Column, PointItem, PointItemInput } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useCrudModalForm, useShowModal } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import PointItemModal from "@/pages/PointItems/Modal";
import { Package, Power, PowerOff, Star, Box } from "lucide-react";
import PointItemShowModal from "@/pages/PointItems/ShowModal";

export default function PointItemTable() {
  // 1. Fetch data menggunakan interface PointItem
  const {
    data: pointItems = [],
    isLoading,
    isError,
    error,
  } = usePointItems();

  const { mutateAsync: toggleStatus } = useToggleStatusPointItem();
  const { mutateAsync: createItem } = useCreatePointItem();
  const { mutateAsync: updateItem } = useUpdatePointItem();
  const { mutateAsync: deleteItem } = useDeletePointItem();

  const show = useShowModal<string>();

  // 2. Setup CRUD Form dengan PointItemInput
  const crud = useCrudModalForm<PointItemInput, any>({
    label: "Point Item",
    emptyForm: {
      name: "",
      description: "",
      required_points: 0,
      stock: 0,
      category: "GOODS",
      is_active: true,
      image: null,
    },

    mapToPayload: (form) => {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description || "");
      formData.append("required_points", String(form.required_points));
      formData.append("stock", String(form.stock));
      formData.append("category", form.category || "GOODS");
      formData.append("is_active", form.is_active ? "1" : "0");
      if (form.image) formData.append("image", form.image);
      return formData;
    },

    createFn: createItem,
    updateFn: (uuid, payload) => updateItem({ uuid, payload }),
  });

  const handleEdit = (uuid: string) => {
    const item = pointItems.find((i) => i.uuid === uuid);
    if (!item) return;

    crud.openEdit({
      uuid: item.uuid,
      name: item.name,
      description: item.description || "",
      required_points: item.required_points,
      stock: item.stock,
      category: item.category,
      is_active: item.is_active,
      image: item.image_url,
    });
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteItem(uuid), {
      loading: "Deleting item...",
      success: "Item deleted successfully",
      error: "Failed to delete item",
    });

  const handleToggleStatus = (uuid: string) =>
    handleMutation(() => toggleStatus(uuid), {
      loading: "Toggling status...",
      success: "Status updated successfully",
      error: "Failed to update status",
    });

  const columns: Column<PointItem>[] = [
    {
      header: "Item & Category",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image_url ? (
            <img
              src={row.image_url}
              alt={row.name}
              className="h-10 w-10 shrink-0 rounded-lg object-cover border border-gray-100 dark:border-gray-800"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Package size={20} />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-gray-100 truncate">
                {row.name}
              </span>
            </div>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              {row.category}
            </span>
            <span className="text-xs text-gray-500 line-clamp-1 mt-0.5">
              {row.description || "No description provided"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Stock",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Box size={14} className="text-gray-400" />
          <span className={`text-sm font-medium ${row.stock <= 5 ? "text-red-500 font-bold" : "text-gray-700 dark:text-gray-300"}`}>
            {row.stock}
          </span>
        </div>
      ),
    },
    {
      header: "Required Points",
      render: (row) => (
        <div className="flex items-center gap-1.5 font-semibold">
          <Star size={14} className="text-yellow-500" />
          <span className="text-indigo-600 dark:text-indigo-400">
            {row.required_points.toLocaleString()}
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
          dataName={row.name}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShow={() => show.open(row.uuid)}
          actions={[
            {
              label: row.is_active ? "Deactivate" : "Activate",
              variant: row.is_active ? "danger" : "success",
              icon: row.is_active ? <PowerOff size={16} /> : <Power size={16} />,
              onClick: (uuid) => handleToggleStatus(uuid),
            },
          ]}
          baseNamePermission={RESOURCES.POINT_ITEM}
        />
      ),
    },
  ];

  if (isError) return <div className="p-4 text-red-500">Error: {(error as Error).message}</div>;

  return (
    <>
      <DataTable
        tableTitle="Point Items Management"
        data={pointItems}
        columns={columns}
        searchableKeys={["name", "description", "category"]}
        loading={isLoading}
        handleCreate={() => crud.openCreate()}
        label="Point Item"
        baseNamePermission={RESOURCES.POINT_ITEM}
      />

      <PointItemModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        data={crud.form}
        setData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
      />

      <PointItemShowModal
        uuid={show.showId}
        isOpen={show.isOpen}
        onClose={show.close}
      />
    </>
  );
}