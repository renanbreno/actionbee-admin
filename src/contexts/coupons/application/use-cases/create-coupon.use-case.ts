import { Coupon } from "../../domain/entities/coupon";
import { CouponRepository } from "../../domain/repositories/coupon-repository.interface";
import { CreateCouponDto } from "../dto/create-coupon.dto";

export class CreateCouponUseCase {
  constructor(private readonly repository: CouponRepository) {}

  async execute(dto: CreateCouponDto): Promise<Coupon> {
    return this.repository.create(dto);
  }
}
