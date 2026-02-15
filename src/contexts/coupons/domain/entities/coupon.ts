export type CouponType = "BY_CUSTOMER" | "BY_PRODUCT" | "FIRST_PURCHASE" | "STORE_WIDE";
export type CouponStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  discountPercentage: number;
  maxDiscountAmount: number | null;
  minCartValue: number | null;
  expiresAt: string | null;
  usageLimit: number | null;
  usedCount: number;
  status: CouponStatus;
  customerId?: string;
  productId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedCoupons {
  coupons: Coupon[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
