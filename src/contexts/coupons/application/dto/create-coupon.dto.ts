export interface CreateCouponDto {
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
