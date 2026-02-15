import { Can } from "@/components/auth/Can";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Tooltip from "@/components/ui/tooltip";
import { buildPermission, PERMISSIONS } from "@/constants/Permissions";
import { useModal } from "@/hooks/useModal";
import { Eye, Pencil, Trash2, RotateCcw, Archive, XCircle } from "lucide-react";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

// 1. Definisikan Tipe Data agar lebih strict
type StandardActionType =
  | "delete"
  | "forceDelete"
  | "restore"
  | "archive"
  | "unarchive";

interface CustomAction<T> {
  label: string;
  variant:
    | "success"
    | "danger"
    | "warning"
    | "primary"
    | "secondary"
    | "destructive";
  icon: React.ReactNode;
  permission?: string;
  onClick: (id: T, note?: string) => void;
  showNote?: boolean;
}

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
  actions?: CustomAction<T>[];
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
  newComponent,
  actions = [],
}: TableActionsProps<T>) {
  const { isOpen, openModal, closeModal } = useModal();
  const [note, setNote] = useState("");

  // State terpisah untuk menghindari bentrok logic modal
  const [activeStandardAction, setActiveStandardAction] =
    useState<StandardActionType | null>(null);
  const [activeCustomAction, setActiveCustomAction] =
    useState<CustomAction<T> | null>(null);

  const { permissions = [] } = useContext(AuthContext);

  // --- Konfigurasi Statis Aksi Standar ---
  const standardConfig: Record<
    StandardActionType,
    {
      label: string;
      variant: string;
      icon: React.ReactNode;
      perm: keyof typeof PERMISSIONS.BASE;
    }
  > = {
    delete: {
      label: "Delete",
      variant: "danger",
      icon: <Trash2 size={16} />,
      perm: "DESTROY",
    },
    forceDelete: {
      label: "Permanently Delete",
      variant: "destructive",
      icon: <Trash2 size={16} />,
      perm: "FORCE_DELETE",
    },
    restore: {
      label: "Restore",
      variant: "success",
      icon: <RotateCcw size={16} />,
      perm: "RESTORE",
    },
    archive: {
      label: "Archive",
      variant: "secondary",
      icon: <Archive size={16} />,
      perm: "ARCHIVE",
    },
    unarchive: {
      label: "Unarchive",
      variant: "secondary",
      icon: <XCircle size={16} />,
      perm: "UNARCHIVE",
    },
  };

  // --- Helpers ---
  const getFullPerm = (action: keyof typeof PERMISSIONS.BASE) =>
    buildPermission(baseNamePermission, PERMISSIONS.BASE[action]);

  const hasPermission = (action: keyof typeof PERMISSIONS.BASE) =>
    permissions.includes(getFullPerm(action));

  const handleOpenStandard = (action: StandardActionType) => {
    setActiveCustomAction(null);
    setActiveStandardAction(action);
    openModal();
  };

  const handleOpenCustom = (action: CustomAction<T>) => {
    setActiveStandardAction(null);
    setActiveCustomAction(action);
    openModal();
  };

  const handleConfirmAction = () => {
    if (activeStandardAction) {
      const handlers = {
        delete: onDelete,
        forceDelete: onForceDelete,
        restore: onRestore,
        archive: onArchive,
        unarchive: onUnarchive,
      };
      handlers[activeStandardAction]?.(id);
    } else if (activeCustomAction) {
      activeCustomAction.onClick(id, note);
    }

    setNote("");
    closeModal();
  };

  const handleCancel = () => {
    setNote(""); // Reset note saat batal
    closeModal();
  };

  // --- Render Logic ---
  const renderStandardButton = (type: StandardActionType, exists: boolean) => {
    if (!exists) return null;
    const config = standardConfig[type];
    return (
      <Can key={type} value={getFullPerm(config.perm)}>
        <Tooltip content={`${config.label} ${dataName}`}>
          <Button
            onClick={() => handleOpenStandard(type)}
            size="sm"
            variant={config.variant as any}
          >
            {config.icon}
          </Button>
        </Tooltip>
      </Can>
    );
  };

  const hasAnyVisibleCustom = actions.some(
    (a) => !a.permission || permissions.includes(a.permission),
  );

  const canShow = !!(
    (onShow && hasPermission("SHOW")) ||
    (onEdit && hasPermission("EDIT")) ||
    (onDelete && hasPermission("DESTROY")) ||
    (onForceDelete && hasPermission("FORCE_DELETE")) ||
    (onRestore && hasPermission("RESTORE")) ||
    (onArchive && hasPermission("ARCHIVE")) ||
    (onUnarchive && hasPermission("UNARCHIVE")) ||
    hasAnyVisibleCustom ||
    newComponent
  );

  const modalInfo = activeStandardAction
    ? standardConfig[activeStandardAction]
    : activeCustomAction
      ? { label: activeCustomAction.label, variant: activeCustomAction.variant }
      : null;

  return (
    <div className="flex items-center gap-2 justify-start">
      {canShow ? (
        <>
          {/* Show & Edit (Aksi Utama) */}
          {onShow && hasPermission("SHOW") && (
            <Tooltip content={`Show ${dataName}`}>
              <Button onClick={() => onShow(id)} size="sm">
                <Eye size={16} />
              </Button>
            </Tooltip>
          )}

          {onEdit && hasPermission("EDIT") && (
            <Tooltip content={`Edit ${dataName}`}>
              <Button onClick={() => onEdit(id)} size="sm" variant="warning">
                <Pencil size={16} />
              </Button>
            </Tooltip>
          )}

          {/* Render CRUD Standar */}
          {renderStandardButton("delete", !!onDelete)}
          {renderStandardButton("forceDelete", !!onForceDelete)}
          {renderStandardButton("restore", !!onRestore)}
          {renderStandardButton("archive", !!onArchive)}
          {renderStandardButton("unarchive", !!onUnarchive)}

          {/* Render Custom Actions (Approve, Reject, dll) */}
          {actions.map((action, index) => {
            const btn = (
              <Tooltip key={index} content={`${action.label} ${dataName}`}>
                <Button
                  onClick={() => handleOpenCustom(action)}
                  size="sm"
                  variant={action.variant as any}
                >
                  {action.icon}
                </Button>
              </Tooltip>
            );
            return action.permission ? (
              <Can key={index} value={action.permission}>
                {btn}
              </Can>
            ) : (
              btn
            );
          })}

          {newComponent && (
            <div className="flex items-center gap-2">{newComponent}</div>
          )}
        </>
      ) : (
        <span className="text-xs text-gray-400 italic">No actions</span>
      )}

      {/* Satu Modal untuk Semua Aksi */}
      {/* Di dalam Modal */}
      {modalInfo && (
        <Modal isOpen={isOpen} onClose={handleCancel} className="max-w-100 m-4">
          <div className="rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-7">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {modalInfo.label} Confirmation
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to{" "}
              <strong>{modalInfo.label.toLowerCase()}</strong>{" "}
              <strong>{dataName || "this item"}</strong>?
            </p>

            {/* --- BAGIAN INPUT NOTE --- */}
            {activeCustomAction?.showNote && (
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes / Reason (Optional)
                </label>
                <textarea
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Add a reason for this decision..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center gap-3 mt-6 lg:justify-end">
              <Button onClick={handleCancel} size="sm" variant="info">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmAction}
                variant={modalInfo.variant as any}
              >
                Confirm {modalInfo.label}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
