import { CouponRepository } from "../../domain/repositories/coupon-repository.interface";

export class DeactivateCouponUseCase {
  constructor(private readonly repository: CouponRepository) {}

  async execute(code: string): Promise<void> {
    return this.repository.deactivate(code);
  }
}
