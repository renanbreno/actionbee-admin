import { Coupon, PaginatedCoupons } from "../../domain/entities/coupon";
import {
  CouponRepository,
  CreateCouponParams,
} from "../../domain/repositories/coupon-repository.interface";
import { couponsApiClient } from "../api/coupons-api.client";

export class CouponRepositoryImpl implements CouponRepository {
  async getAll(page: number, limit: number): Promise<PaginatedCoupons> {
    return couponsApiClient.getAll(page, limit);
  }

  async create(params: CreateCouponParams): Promise<Coupon> {
    return couponsApiClient.create(params);
  }

  async activate(code: string): Promise<void> {
    return couponsApiClient.activate(code);
  }

  async deactivate(code: string): Promise<void> {
    return couponsApiClient.deactivate(code);
  }
}
