import { PaginatedCoupons } from "../../domain/entities/coupon";
import { CouponRepository } from "../../domain/repositories/coupon-repository.interface";

export class GetCouponsUseCase {
  constructor(private readonly repository: CouponRepository) {}

  async execute(page: number, limit: number): Promise<PaginatedCoupons> {
    return this.repository.getAll(page, limit);
  }
}
