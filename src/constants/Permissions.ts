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
    APPROVE: "approve"
  },
  PAYROLL: {
    pay: "pay"
  },
  DASHBOARD: {
    admin: "admin",
    employee: "employee"
  }
} as const;

export const buildPermission = (
  resource: string,
  action: (typeof PERMISSIONS.BASE)[keyof typeof PERMISSIONS.BASE] | (typeof PERMISSIONS.DASHBOARD)[keyof typeof PERMISSIONS.DASHBOARD]
) => `${resource}.${action}`;
