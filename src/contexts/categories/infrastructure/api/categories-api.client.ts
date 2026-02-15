import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { Category } from "../../domain/entities/category";

export interface CreateCategoryApiRequest {
  name: string;
  description?: string;
  featured?: boolean;
  parentId?: string;
}

export interface UpdateCategoryApiRequest {
  name: string;
  description?: string;
  isActive?: boolean;
  featured?: boolean;
  parentId?: string;
}

export const categoriesApiClient = {
  getAll(): Promise<Category[]> {
    return apiFetch<Category[]>("/admin/categories");
  },

  getById(id: string): Promise<Category> {
    return apiFetch<Category>(`/admin/categories/${id}`);
  },

  create(data: CreateCategoryApiRequest): Promise<Category> {
    return apiFetch<Category>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateCategoryApiRequest): Promise<Category> {
    return apiFetch<Category>(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return apiFetch<void>(`/admin/categories/${id}`, {
      method: "DELETE",
    });
  },
};
