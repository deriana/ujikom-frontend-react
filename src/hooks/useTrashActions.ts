import { handleMutation } from "@/utils/handleMutation";

interface TrashActionConfig {
  label: string;
  restoreFn: (id: string) => Promise<any>;
  forceDeleteFn: (id: string) => Promise<any>;
}

export function useTrashActions({
  label,
  restoreFn,
  forceDeleteFn,
}: TrashActionConfig) {
  const handleRestore = (id: string) =>
    handleMutation(() => restoreFn(id), {
      loading: `Restoring ${label}...`,
      success: `${label} restored successfully`,
      error: `Failed to restore ${label}`,
    });

  const handleForceDelete = (id: string) =>
    handleMutation(() => forceDeleteFn(id), {
      loading: `Deleting ${label} permanently...`,
      success: `${label} permanently deleted`,
      error: `Failed to delete ${label}`,
    });

  return { handleRestore, handleForceDelete };
}
