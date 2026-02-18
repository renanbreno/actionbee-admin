import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { GiftTier } from "../../domain/entities/gift-tier";

export interface CreateGiftTierApiRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  minOrderValue: number;
  productId?: string;
}

export interface UpdateGiftTierApiRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
  minOrderValue?: number;
  productId?: string;
}

export const giftTiersApiClient = {
  getAll(): Promise<GiftTier[]> {
    return apiFetch<GiftTier[]>("/admin/gift-tiers");
  },

  create(data: CreateGiftTierApiRequest): Promise<GiftTier> {
    return apiFetch<GiftTier>("/admin/gift-tiers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateGiftTierApiRequest): Promise<GiftTier> {
    return apiFetch<GiftTier>(`/admin/gift-tiers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  activate(id: string): Promise<GiftTier> {
    return apiFetch<GiftTier>(`/admin/gift-tiers/${id}/activate`, {
      method: "PATCH",
    });
  },

  deactivate(id: string): Promise<GiftTier> {
    return apiFetch<GiftTier>(`/admin/gift-tiers/${id}/deactivate`, {
      method: "PATCH",
    });
  },

  delete(id: string): Promise<void> {
    return apiFetch<void>(`/admin/gift-tiers/${id}`, {
      method: "DELETE",
    });
  },
};
