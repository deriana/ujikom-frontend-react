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
  can?: {
    update?: boolean;
    delete?: boolean;
    restore?: boolean;
    archive?: boolean;
    unarchive?: boolean;
    forceDelete?: boolean;
    show?: boolean;
  };
  isSystemReserve?: boolean;
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
  can,
  isSystemReserve,
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
      hoverColor: string;
    }
  > = {
    delete: {
      label: "Delete",
      variant: "outline",
      icon: <Trash2 size={16} className="text-slate-500 group-hover:text-red-500" />,
      perm: "DESTROY",
      hoverColor: "text-red-500",
    },
    forceDelete: {
      label: "Permanently Delete",
      variant: "outline",
      icon: <Trash2 size={16} className="text-slate-500 group-hover:text-red-500" />,
      perm: "FORCE_DELETE",
      hoverColor: "text-red-500",
    },
    restore: {
      label: "Restore",
      variant: "outline",
      icon: <RotateCcw size={16} className="text-slate-500 group-hover:text-green-500" />,
      perm: "RESTORE",
      hoverColor: "text-green-500",
    },
    archive: {
      label: "Archive",
      variant: "outline",
      icon: <Archive size={16} className="text-slate-500 group-hover:text-gray-500" />,
      perm: "ARCHIVE",
      hoverColor: "text-gray-500",
    },
    unarchive: {
      label: "Unarchive",
      variant: "outline",
      icon: <XCircle size={16} className="text-slate-500 group-hover:text-gray-500" />,
      perm: "UNARCHIVE",
      hoverColor: "text-gray-500",
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
    setNote("");
    closeModal();
  };

  const shouldShowEdit =
    onEdit &&
    hasPermission("EDIT") &&
    can?.update !== false &&
    !isSystemReserve;

  const shouldShowView = onShow && hasPermission("SHOW") && can?.show !== false;
  // Apakah user punya izin secara permission & policy?
  const canEdit = hasPermission("EDIT") && can?.update !== false;
  const canView = hasPermission("SHOW") && can?.show !== false;

  // Apakah tombol Edit harus di-disable? (Karena tidak punya izin ATAU System Reserve)
  const isEditDisabled = !canEdit || isSystemReserve;

  // Apakah tombol View harus di-disable?
  const isViewDisabled = !canView;

  // --- Render Logic ---
  const renderStandardButton = (type: StandardActionType, exists: boolean) => {
    if (!exists) return null;

    const config = standardConfig[type];
    const hasPerm = hasPermission(config.perm);
    const isLocked =
      isSystemReserve && (type === "delete" || type === "forceDelete");

    const policyMap: Record<StandardActionType, boolean | undefined> = {
      delete: can?.delete,
      forceDelete: can?.forceDelete,
      restore: can?.restore,
      archive: can?.archive,
      unarchive: can?.unarchive,
    };

    const isRestrictedByPolicy = policyMap[type] === false;

    const isDisabled = !hasPerm || isLocked || isRestrictedByPolicy;

    return (
      <Tooltip
        key={type}
        content={
          !hasPerm
            ? `You don't have permission to ${config.label.toLowerCase()}`
            : isLocked
              ? `System Reserved: Cannot ${config.label.toLowerCase()}`
              : isRestrictedByPolicy
                ? `Action not allowed: The current status or rules prevent this action.`
                : `${config.label} ${dataName}`
        }
      >
        <div className="inline-block">
          <Button
            onClick={() => !isDisabled && handleOpenStandard(type)}
            size="sm"
            variant="outline"
            disabled={isDisabled}
            className={
              isDisabled ? "opacity-30 cursor-not-allowed grayscale" : "group"
            }
          >
            {config.icon}
          </Button>
        </div>
      </Tooltip>
    );
  };

  const hasAnyVisibleCustom = actions.some(
    (a) => !a.permission || permissions.includes(a.permission),
  );

  const canShow = !!(
    shouldShowView ||
    shouldShowEdit ||
    (onDelete && hasPermission("DESTROY") && can?.delete !== false) ||
    (onForceDelete &&
      hasPermission("FORCE_DELETE") &&
      can?.forceDelete !== false) ||
    (onRestore && hasPermission("RESTORE") && can?.restore !== false) ||
    (onArchive && hasPermission("ARCHIVE") && can?.archive !== false) ||
    (onUnarchive && hasPermission("UNARCHIVE") && can?.unarchive !== false) ||
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
          {onShow && (
            <Tooltip
              content={
                !canView ? "No access to view details" : `Show ${dataName}`
              }
            >
              <div className="inline-block">
                <Button
                  onClick={() => !isViewDisabled && onShow(id)}
                  size="sm"
                  variant="outline"
                  disabled={isViewDisabled}
                  className={`group ${
                    isViewDisabled
                      ? "opacity-30 grayscale cursor-not-allowed"
                      : ""
                  }`}
                >
                  <Eye size={16} className="text-slate-500 group-hover:text-blue-500" />
                </Button>
              </div>
            </Tooltip>
          )}

          {/* TOMBOL EDIT */}
          {onEdit && (
            <Tooltip
              content={
                !canEdit
                  ? "No access to edit"
                  : isSystemReserve
                    ? "System Reserved: Cannot edit"
                    : `Edit ${dataName}`
              }
            >
              <div className="inline-block">
                <Button
                  onClick={() => !isEditDisabled && onEdit(id)}
                  size="sm"
                  variant="outline"
                  disabled={isEditDisabled}
                  className={`group ${
                    isEditDisabled
                      ? "opacity-30 grayscale cursor-not-allowed"
                      : ""
                  }`}
                >
                  <Pencil size={16} className="text-slate-500 group-hover:text-yellow-500" />
                </Button>
              </div>
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
                  variant="outline"
                  className="group"
                >
                  <span className="text-slate-500 group-hover:text-gray-500">
                    {action.icon}
                  </span>
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
              <Button onClick={handleCancel} size="sm" variant="outline">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmAction}
                variant="outline"
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
