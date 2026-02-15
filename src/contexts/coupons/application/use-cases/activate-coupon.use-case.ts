import { CouponRepository } from "../../domain/repositories/coupon-repository.interface";

export class ActivateCouponUseCase {
  constructor(private readonly repository: CouponRepository) {}

  async execute(code: string): Promise<void> {
    return this.repository.activate(code);
  }
}
