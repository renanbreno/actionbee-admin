import type { AffiliateCategoryRepository } from "../../domain/repositories/affiliate-category-repository.interface";
import type { CreateAffiliateCategoryDTO } from "../../domain/repositories/affiliate-category-repository.interface";
import { AffiliateCategory } from "../../domain/entities/affiliate-category";

export class CreateAffiliateCategoryUseCase {
  constructor(private readonly repository: AffiliateCategoryRepository) {}

  async execute(data: CreateAffiliateCategoryDTO): Promise<AffiliateCategory> {
    return await this.repository.create(data);
  }
}
