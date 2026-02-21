import Cookies from "js-cookie";
import { env } from "@/shared/config/env";
import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { GiftTier } from "../../domain/entities/gift-tier";

async function multipartFetch<T>(
  path: string,
  method: string,
  formData: FormData,
): Promise<T> {
  const accessToken = Cookies.get("ab_access_token");

  const res = await fetch(`${env.API_BASE_URL}${path}`, {
    method,
    body: formData,
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface CreateGiftTierApiRequest {
  name: string;
  description?: string;
  minOrderValue: number;
  productId?: string;
  image?: File;
}

export interface UpdateGiftTierApiRequest {
  name?: string;
  description?: string;
  minOrderValue?: number;
  productId?: string;
  image?: File;
}

export const giftTiersApiClient = {
  getAll(): Promise<GiftTier[]> {
    return apiFetch<GiftTier[]>("/admin/gift-tiers");
  },

  create(data: CreateGiftTierApiRequest): Promise<GiftTier> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("minOrderValue", String(data.minOrderValue));
    if (data.description) formData.append("description", data.description);
    if (data.productId) formData.append("productId", data.productId);
    if (data.image) formData.append("image", data.image);
    return multipartFetch<GiftTier>("/admin/gift-tiers", "POST", formData);
  },

  update(id: string, data: UpdateGiftTierApiRequest): Promise<GiftTier> {
    const formData = new FormData();
    if (data.name !== undefined) formData.append("name", data.name);
    if (data.minOrderValue !== undefined) formData.append("minOrderValue", String(data.minOrderValue));
    if (data.description !== undefined) formData.append("description", data.description);
    if (data.productId !== undefined) formData.append("productId", data.productId);
    if (data.image) formData.append("image", data.image);
    return multipartFetch<GiftTier>(`/admin/gift-tiers/${id}`, "PATCH", formData);
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
