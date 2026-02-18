import type { AffiliateCategoryRepository } from "../../domain/repositories/affiliate-category-repository.interface";
import { AffiliateCategory } from "../../domain/entities/affiliate-category";

export class GetAffiliateCategoryByIdUseCase {
  constructor(private readonly repository: AffiliateCategoryRepository) {}

  async execute(id: string): Promise<AffiliateCategory> {
    return await this.repository.getById(id);
  }
}
