import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { Coupon, PaginatedCoupons } from "../../domain/entities/coupon";

export interface CreateCouponApiRequest {
  code: string;
  type: string;
  discountPercentage: number;
  maxDiscountAmount?: number;
  minCartValue?: number;
  expiresAt?: string;
  usageLimit?: number;
  customerEmail?: string;
  productId?: string;
}

export const couponsApiClient = {
  getAll(page: number, limit: number, search?: string, status?: string, affiliateCategoryId?: string): Promise<PaginatedCoupons> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (affiliateCategoryId) params.set("affiliateCategoryId", affiliateCategoryId);
    return apiFetch<PaginatedCoupons>(`/admin/coupons?${params.toString()}`);
  },

  create(data: CreateCouponApiRequest): Promise<Coupon> {
    return apiFetch<Coupon>("/admin/coupons", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  activate(code: string): Promise<void> {
    return apiFetch<void>(`/admin/coupons/${code}/activate`, {
      method: "PATCH",
    });
  },

  deactivate(code: string): Promise<void> {
    return apiFetch<void>(`/admin/coupons/${code}/deactivate`, {
      method: "PATCH",
    });
  },

  delete(code: string): Promise<void> {
    return apiFetch<void>(`/admin/coupons/${code}`, {
      method: "DELETE",
    });
  },
};
