import { Affiliate } from "../../domain/entities/affiliate";
import {
  AffiliateRepository,
  CreateAffiliateParams,
  UpdateAffiliateParams,
} from "../../domain/repositories/affiliate-repository.interface";
import { affiliatesApiClient } from "../api/affiliates-api.client";

export class AffiliateRepositoryImpl implements AffiliateRepository {
  async getAll(): Promise<Affiliate[]> {
    return affiliatesApiClient.getAll();
  }

  async create(params: CreateAffiliateParams): Promise<Affiliate> {
    return affiliatesApiClient.create(params);
  }

  async update(id: string, params: UpdateAffiliateParams): Promise<Affiliate> {
    return affiliatesApiClient.update(id, params);
  }

  async delete(id: string): Promise<void> {
    return affiliatesApiClient.delete(id);
  }
}
