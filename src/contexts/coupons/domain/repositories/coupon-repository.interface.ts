import { Coupon, PaginatedCoupons } from "../entities/coupon";

export interface CreateCouponParams {
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

export interface CouponRepository {
  getAll(page: number, limit: number): Promise<PaginatedCoupons>;
  create(params: CreateCouponParams): Promise<Coupon>;
  activate(code: string): Promise<void>;
  deactivate(code: string): Promise<void>;
}
