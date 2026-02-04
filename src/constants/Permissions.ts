export const PERMISSIONS = {
  BASE: {
    INDEX: "index",
    CREATE: "create",
    EDIT: "edit",
    DESTROY: "destroy",
    FORCE_DELETE: "forceDelete",
    RESTORE: "restore",
    SHOW: "show",
    EXPORT: "export",
    IMPORT: "import",
    ARCHIVE: "archive",
    UNARCHIVE: "unarchive",
  },
} as const;

export const buildPermission = (
  resource: string,
  action: (typeof PERMISSIONS.BASE)[keyof typeof PERMISSIONS.BASE]
) => `${resource}.${action}`;
