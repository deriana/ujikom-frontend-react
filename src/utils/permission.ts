import { buildPermission, PERMISSIONS } from "@/constants/Permissions";
import { RESOURCES } from "@/constants/Resource";

export const isAdmin = (roles?: { name: string }[]) =>
  roles?.some((r) => r.name === "admin");

export const can = (
  permission: string,
  userPermissions: string[] = [],
  roles?: { name: string }[],
) => {
  if (isAdmin(roles)) return true;
  if (permission === "has-any-approval") {
    return hasAnyApprovalPermission(userPermissions);
  }
  return userPermissions.includes(permission);
};

export const checkPermission = (
  userPermissions: string[] | undefined,
  resource: string,
  action: string,
): boolean => {
  if (!userPermissions) return false;

  const requiredPermission = `${resource}-${action}`;

  return userPermissions.includes(requiredPermission);
};

export const hasAnyPermission = (
  userPermissions: string[] | undefined,
  requirements: { resource: string; action: string }[],
): boolean => {
  return requirements.some((req) =>
    checkPermission(userPermissions, req.resource, req.action),
  );
};

export const getApprovalPermissions = () => [
  buildPermission(RESOURCES.LEAVE, PERMISSIONS.BASE.APPROVE),
  buildPermission(RESOURCES.EARLY_LEAVE, PERMISSIONS.BASE.APPROVE),
  buildPermission(RESOURCES.ATTENDANCE_REQUEST, PERMISSIONS.BASE.APPROVE),
  buildPermission(RESOURCES.OVERTIME, PERMISSIONS.BASE.APPROVE),
];

export const hasAnyApprovalPermission = (permissions: string[]) => {
  return getApprovalPermissions().some((p) => permissions.includes(p));
};
