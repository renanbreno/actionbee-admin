import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { CreateUserInput, UpdateUserInput, User } from "../../domain/types";

export const usersApiClient = {
  getAll(): Promise<User[]> {
    return apiFetch<User[]>("/admin/users");
  },

  create(data: CreateUserInput): Promise<User> {
    return apiFetch<User>("/admin/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateUserInput): Promise<User> {
    return apiFetch<User>(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  updatePassword(id: string, password: string): Promise<void> {
    return apiFetch<void>(`/admin/users/${id}/password`, {
      method: "PATCH",
      body: JSON.stringify({ password }),
    });
  },

  delete(id: string): Promise<void> {
    return apiFetch<void>(`/admin/users/${id}`, { method: "DELETE" });
  },
};
