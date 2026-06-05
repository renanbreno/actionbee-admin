import { AdminUser } from "../entities/admin-user";
import { userHasPermission } from "./permissions";

/**
 * Rotas candidatas a "destino inicial", em ordem de prioridade. A primeira cuja
 * permissão o usuário possui é o destino. A ordem espelha o menu lateral.
 */
const LANDING_CANDIDATES: { href: string; permission: string }[] = [
  { href: "/dashboard", permission: "dashboard:view" },
  { href: "/dashboard/orders", permission: "orders:view" },
  { href: "/dashboard/products", permission: "products:view" },
  { href: "/dashboard/inventory", permission: "inventory:view" },
  { href: "/dashboard/gift-tiers", permission: "gifts:view" },
  { href: "/dashboard/coupons", permission: "coupons:view" },
  { href: "/dashboard/announcements", permission: "announcements:view" },
  { href: "/dashboard/crm/pipelines", permission: "crm:view" },
  { href: "/dashboard/affiliates/list", permission: "affiliates:view" },
  { href: "/dashboard/representatives", permission: "representatives:view" },
  { href: "/dashboard/vendedores", permission: "vendedores:view" },
  { href: "/dashboard/customers", permission: "customers:view" },
  { href: "/dashboard/financial", permission: "financial:view" },
  { href: "/dashboard/users", permission: "users:view" },
  { href: "/dashboard/store-settings", permission: "settings:view" },
];

/**
 * Primeira rota que o usuário tem permissão de acessar, ou `null` se ele não
 * puder acessar nenhuma área.
 */
export function resolveLandingRoute(user: AdminUser | null): string | null {
  const match = LANDING_CANDIDATES.find((candidate) =>
    userHasPermission(user, candidate.permission),
  );
  return match?.href ?? null;
}
