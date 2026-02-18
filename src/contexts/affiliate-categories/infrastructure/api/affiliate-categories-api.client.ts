import { apiFetch } from "@/shared/infrastructure/api/api-client";
import type { AffiliateCategory } from "../../domain/entities/affiliate-category";
import type {
  CreateAffiliateCategoryDTO,
  UpdateAffiliateCategoryDTO,
} from "../../domain/repositories/affiliate-category-repository.interface";

export const affiliateCategoriesApi = {
  getAll: async (includeInactive = false): Promise<AffiliateCategory[]> => {
    const params = new URLSearchParams();
    if (includeInactive) {
      params.append("includeInactive", "true");
    }
    const query = params.toString();
    return apiFetch<AffiliateCategory[]>(
      `/admin/affiliate-categories${query ? `?${query}` : ""}`
    );
  },

  getById: async (id: string): Promise<AffiliateCategory> => {
    return apiFetch<AffiliateCategory>(`/admin/affiliate-categories/${id}`);
  },

  create: async (data: CreateAffiliateCategoryDTO): Promise<AffiliateCategory> => {
    return apiFetch<AffiliateCategory>("/admin/affiliate-categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: UpdateAffiliateCategoryDTO
  ): Promise<AffiliateCategory> => {
    return apiFetch<AffiliateCategory>(`/admin/affiliate-categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch(`/admin/affiliate-categories/${id}`, {
      method: "DELETE",
    });
  },
};
