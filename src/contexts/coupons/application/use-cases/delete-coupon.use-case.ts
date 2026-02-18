import { CouponRepository } from "../../domain/repositories/coupon-repository.interface";

export class DeleteCouponUseCase {
  constructor(private readonly couponRepository: CouponRepository) {}

  async execute(code: string): Promise<void> {
    return this.couponRepository.delete(code);
  }
}
