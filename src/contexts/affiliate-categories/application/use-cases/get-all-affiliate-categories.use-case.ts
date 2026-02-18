import type { AffiliateCategoryRepository } from "../../domain/repositories/affiliate-category-repository.interface";
import { AffiliateCategory } from "../../domain/entities/affiliate-category";

export class GetAllAffiliateCategoriesUseCase {
  constructor(private readonly repository: AffiliateCategoryRepository) {}

  async execute(includeInactive = false): Promise<AffiliateCategory[]> {
    return await this.repository.getAll(includeInactive);
  }
}
