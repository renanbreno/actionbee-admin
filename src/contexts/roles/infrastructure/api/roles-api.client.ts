import { apiFetch } from "@/shared/infrastructure/api/api-client";
import {
  CreateRoleInput,
  PermissionGroup,
  Role,
  UpdateRoleInput,
} from "../../domain/types";

export const rolesApiClient = {
  getAll(): Promise<Role[]> {
    return apiFetch<Role[]>("/admin/roles");
  },

  getById(id: string): Promise<Role> {
    return apiFetch<Role>(`/admin/roles/${id}`);
  },

  create(data: CreateRoleInput): Promise<Role> {
    return apiFetch<Role>("/admin/roles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateRoleInput): Promise<Role> {
    return apiFetch<Role>(`/admin/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return apiFetch<void>(`/admin/roles/${id}`, { method: "DELETE" });
  },

  getPermissionsCatalog(): Promise<PermissionGroup[]> {
    return apiFetch<PermissionGroup[]>("/admin/permissions");
  },
};
