import { AffiliateCategoryRepository } from "../../domain/repositories/affiliate-category-repository.interface";
import { affiliateCategoriesApi } from "../api/affiliate-categories-api.client";
import { AffiliateCategory } from "../../domain/entities/affiliate-category";

export class AffiliateCategoryRepositoryImpl implements AffiliateCategoryRepository {
  async getAll(includeInactive = false): Promise<AffiliateCategory[]> {
    return await affiliateCategoriesApi.getAll(includeInactive);
  }

  async getById(id: string): Promise<AffiliateCategory> {
    return await affiliateCategoriesApi.getById(id);
  }

  async create(data: { name: string; description?: string }): Promise<AffiliateCategory> {
    return await affiliateCategoriesApi.create(data);
  }

  async update(
    id: string,
    data: { name?: string; description?: string | null }
  ): Promise<AffiliateCategory> {
    return await affiliateCategoriesApi.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await affiliateCategoriesApi.delete(id);
  }
}
