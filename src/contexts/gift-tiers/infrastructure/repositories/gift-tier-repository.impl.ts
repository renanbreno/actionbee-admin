import { GiftTier } from "../../domain/entities/gift-tier";
import {
  GiftTierRepository,
  CreateGiftTierParams,
  UpdateGiftTierParams,
} from "../../domain/repositories/gift-tier-repository.interface";
import { giftTiersApiClient } from "../api/gift-tiers-api.client";

export class GiftTierRepositoryImpl implements GiftTierRepository {
  async getAll(): Promise<GiftTier[]> {
    return giftTiersApiClient.getAll();
  }

  async create(params: CreateGiftTierParams): Promise<GiftTier> {
    return giftTiersApiClient.create(params);
  }

  async update(id: string, params: UpdateGiftTierParams): Promise<GiftTier> {
    return giftTiersApiClient.update(id, params);
  }

  async activate(id: string): Promise<GiftTier> {
    return giftTiersApiClient.activate(id);
  }

  async deactivate(id: string): Promise<GiftTier> {
    return giftTiersApiClient.deactivate(id);
  }

  async delete(id: string): Promise<void> {
    return giftTiersApiClient.delete(id);
  }
}
