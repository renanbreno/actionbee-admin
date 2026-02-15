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
  customerId?: string;
  productId?: string;
}

export const couponsApiClient = {
  getAll(page: number, limit: number): Promise<PaginatedCoupons> {
    return apiFetch<PaginatedCoupons>(
      `/admin/coupons?page=${page}&limit=${limit}`,
    );
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
};
