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
    APPROVE: "approve",
    LOG: "log",
    DOWNLOAD: "download",
  },
  PAYROLL: {
    pay: "pay"
  },
  TICKET: {
    reply: "reply",
    status: "status",
    assign: "assign",
    rate: "rate",
    dashboard: "dashboard",
  },
  DASHBOARD: {
    admin: "admin",
    employee: "employee"
  },
  POINT: {
    addPoint: "addPoint",
  },
  ATTENDANCE: {
    recap: "recap",
  }
} as const;

type AllActions = {
  [K in keyof typeof PERMISSIONS]: (typeof PERMISSIONS)[K][keyof (typeof PERMISSIONS)[K]];
}[keyof typeof PERMISSIONS];

export const buildPermission = (
  resource: string,
  action: AllActions,
) => `${resource}.${action}`;
