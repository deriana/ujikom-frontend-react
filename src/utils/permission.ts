export const isAdmin = (roles?: { name: string }[]) =>
  roles?.some(r => r.name === "admin");

export const can = (
  permission: string,
  userPermissions: string[] = [],
  roles?: { name: string }[]
) => {
  if (isAdmin(roles)) return true;
  return userPermissions.includes(permission);
};
