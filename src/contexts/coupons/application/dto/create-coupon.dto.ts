export interface CreateCouponDto {
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
