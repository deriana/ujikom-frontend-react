import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface TableActionsProps<T extends string | number> {
  id: T;
  dataName?: string;
  onShow?: (id: T) => void;
  onEdit?: (id: T) => void;
  onDelete?: (id: T) => void;
}

export default function TableActions<T extends string | number>({
  id,
  onShow,
  onEdit,
  onDelete,
  dataName,
}: TableActionsProps<T>) {
  const { isOpen, openModal, closeModal } = useModal();

  const handleConfirmDelete = () => {
    onDelete?.(id);
    closeModal();
  };

  return (
    <div className="flex items-center gap-2 justify-start">
      {onShow && (
        <button
          onClick={() => onShow(id)}
          className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 dark:hover:bg-white/10"
          aria-label="Show"
        >
          <Eye size={16} />
        </button>
      )}

      {onEdit && (
        <button
          onClick={() => onEdit(id)}
          className="p-2 rounded-lg text-gray-500 hover:bg-yellow-50 dark:hover:bg-white/10"
          aria-label="Edit"
        >
          <Pencil size={16} />
        </button>
      )}

      {onDelete && (
        <button
          onClick={openModal}
          className="p-2 rounded-lg text-gray-500 hover:bg-red-50 dark:hover:bg-white/10"
          aria-label="Delete"
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* Modal Konfirmasi Delete */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-100 m-4">
        <div className="no-scrollbar relative w-full max-w-100 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-7">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Delete Confirmation
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Are you sure you want to delete{" "}
              <strong>{dataName || "this item"}</strong>? This action cannot be
              undone.
            </p>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handleConfirmDelete} variant="danger">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
