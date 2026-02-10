import { Can } from "@/components/auth/Can";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Tooltip from "@/components/ui/tooltip";
import { buildPermission, PERMISSIONS } from "@/constants/Permissions";
import { useModal } from "@/hooks/useModal";
import { Eye, Pencil, Trash2, RotateCcw, Archive, XCircle } from "lucide-react";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

type ActionType =
  | "delete"
  | "forceDelete"
  | "restore"
  | "archive"
  | "unarchive";

interface TableActionsProps<T extends string | number> {
  id: T;
  dataName?: string;
  baseNamePermission: string;
  onDelete?: (id: T) => void;
  onRestore?: (id: T) => void;
  onArchive?: (id: T) => void;
  onUnarchive?: (id: T) => void;
  onForceDelete?: (id: T) => void;
  onShow?: (id: T) => void;
  onEdit?: (id: T) => void;
  newComponent?: React.ReactNode;
}

export default function TableActions<T extends string | number>({
  id,
  dataName,
  baseNamePermission,
  onDelete,
  onRestore,
  onArchive,
  onUnarchive,
  onForceDelete,
  onShow,
  onEdit,
}: TableActionsProps<T>) {
  const { isOpen, openModal, closeModal } = useModal();
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null);

  const handleOpenModal = (action: ActionType) => {
    setCurrentAction(action);
    openModal();
  };

  const { permissions = [] } = useContext(AuthContext);

  const hasPermission = (action: keyof typeof PERMISSIONS.BASE) =>
    permissions.includes(
      buildPermission(baseNamePermission, PERMISSIONS.BASE[action]),
    );

  const handleConfirmAction = () => {
    if (!currentAction) return;

    switch (currentAction) {
      case "delete":
        onDelete?.(id);
        break;
      case "forceDelete":
        onForceDelete?.(id);
        break;
      case "restore":
        onRestore?.(id);
        break;
      case "archive":
        onArchive?.(id);
        break;
      case "unarchive":
        onUnarchive?.(id);
        break;
    }
    closeModal();
  };

  const actionConfig: Record<
    ActionType,
    { label: string; variant: string; icon: React.ReactNode }
  > = {
    delete: { label: "Delete", variant: "danger", icon: <Trash2 size={16} /> },
    forceDelete: {
      label: "Permanently Delete",
      variant: "destructive",
      icon: <Trash2 size={16} />,
    },
    restore: {
      label: "Restore",
      variant: "success",
      icon: <RotateCcw size={16} />,
    },
    archive: {
      label: "Archive",
      variant: "secondary",
      icon: <Archive size={16} />,
    },
    unarchive: {
      label: "Unarchive",
      variant: "secondary",
      icon: <XCircle size={16} />,
    },
  };

  const actionPermissionMap: Record<ActionType, keyof typeof PERMISSIONS.BASE> =
    {
      delete: "DESTROY",
      forceDelete: "FORCE_DELETE",
      restore: "RESTORE",
      archive: "ARCHIVE",
      unarchive: "UNARCHIVE",
    };

  const renderButton = (action: ActionType, handlerExists: boolean) => {
    if (!handlerExists) return null;

    const permissionKey = actionPermissionMap[action];
    const permission = buildPermission(
      baseNamePermission || "",
      PERMISSIONS.BASE[permissionKey],
    );

    return (
      <Can key={action} value={permission}>
        <Tooltip content={`${actionConfig[action].label} ${dataName}`}>
          <Button
            onClick={() => handleOpenModal(action)}
            aria-label={actionConfig[action].label}
            size="sm"
            variant={actionConfig[action].variant as any}
          >
            {actionConfig[action].icon}
          </Button>
        </Tooltip>
      </Can>
    );
  };

  const canShow =
    (onShow && hasPermission("INDEX")) ||
    (onEdit && hasPermission("EDIT")) ||
    (onDelete && hasPermission("DESTROY")) ||
    (onForceDelete && hasPermission("FORCE_DELETE")) ||
    (onRestore && hasPermission("RESTORE")) ||
    (onArchive && hasPermission("ARCHIVE")) ||
    (onUnarchive && hasPermission("UNARCHIVE"));

  return (
    <div className="flex items-center gap-2 justify-start">
      {canShow ? (
        <>
          {onShow && (
            <Can
              value={buildPermission(
                baseNamePermission || "",
                PERMISSIONS.BASE.INDEX,
              )}
            >
              <Tooltip content={`Show ${dataName}`}>
                <Button onClick={() => onShow(id)} aria-label="Show" size="sm">
                  <Eye size={16} />
                </Button>
              </Tooltip>
            </Can>
          )}

          {onEdit && (
            <Can
              value={buildPermission(baseNamePermission || "", PERMISSIONS.BASE.EDIT)}
            >
              <Tooltip content={`Edit ${dataName}`}>
                <Button
                  onClick={() => onEdit(id)}
                  aria-label="Edit"
                  size="sm"
                  variant="warning"
                >
                  <Pencil size={16} />
                </Button>
              </Tooltip>
            </Can>
          )}

          {renderButton("delete", !!onDelete)}
          {renderButton("forceDelete", !!onForceDelete)}
          {renderButton("restore", !!onRestore)}
          {renderButton("archive", !!onArchive)}
          {renderButton("unarchive", !!onUnarchive)}
        </>
      ) : (
        <span className="text-xs text-gray-400 italic">No actions</span>
      )}

      {/* Universal Modal */}
      {currentAction && (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-100 m-4">
          <div className="no-scrollbar relative w-full max-w-100 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-7">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {actionConfig[currentAction].label} Confirmation
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                Are you sure you want to{" "}
                {actionConfig[currentAction].label.toLowerCase()}{" "}
                <strong>{dataName || "this item"}</strong>? This action cannot
                be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmAction}
                variant={actionConfig[currentAction].variant as any}
              >
                {actionConfig[currentAction].label}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
