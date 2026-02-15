import { CouponRepositoryImpl } from "./infrastructure/repositories/coupon-repository.impl";
import { GetCouponsUseCase } from "./application/use-cases/get-coupons.use-case";
import { CreateCouponUseCase } from "./application/use-cases/create-coupon.use-case";
import { ActivateCouponUseCase } from "./application/use-cases/activate-coupon.use-case";
import { DeactivateCouponUseCase } from "./application/use-cases/deactivate-coupon.use-case";

const couponRepository = new CouponRepositoryImpl();

export const getCouponsUseCase = new GetCouponsUseCase(couponRepository);
export const createCouponUseCase = new CreateCouponUseCase(couponRepository);
export const activateCouponUseCase = new ActivateCouponUseCase(couponRepository);
export const deactivateCouponUseCase = new DeactivateCouponUseCase(couponRepository);
