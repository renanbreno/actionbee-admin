import { AdminUser } from "../entities/admin-user";

/**
 * Verifica se o usuário possui uma permissão. `super_admin` é wildcard e tem
 * acesso total, espelhando a regra do backend.
 */
export function userHasPermission(
  user: AdminUser | null,
  permission: string,
): boolean {
  if (!user) return false;
  if (user.role === "super_admin") return true;
  return user.permissions.includes(permission);
}

export function userHasAnyPermission(
  user: AdminUser | null,
  permissions: string[],
): boolean {
  if (!user) return false;
  if (user.role === "super_admin") return true;
  if (permissions.length === 0) return true;
  return permissions.some((permission) =>
    user.permissions.includes(permission),
  );
}
