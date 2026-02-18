import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { Affiliate } from "../../domain/entities/affiliate";

export interface CreateAffiliateApiRequest {
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  socialMedia?: string[];
  commissionRate: number;
  categoryId?: string;
}

export interface UpdateAffiliateApiRequest {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  socialMedia?: string[];
  commissionRate?: number;
  categoryId?: string;
}

export const affiliatesApiClient = {
  getAll(): Promise<Affiliate[]> {
    return apiFetch<Affiliate[]>("/admin/affiliates");
  },

  create(data: CreateAffiliateApiRequest): Promise<Affiliate> {
    return apiFetch<Affiliate>("/admin/affiliates", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateAffiliateApiRequest): Promise<Affiliate> {
    return apiFetch<Affiliate>(`/admin/affiliates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return apiFetch<void>(`/admin/affiliates/${id}`, {
      method: "DELETE",
    });
  },
};
