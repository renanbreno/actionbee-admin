import type { AffiliateCategoryRepository } from "../../domain/repositories/affiliate-category-repository.interface";
import type { UpdateAffiliateCategoryDTO } from "../../domain/repositories/affiliate-category-repository.interface";
import { AffiliateCategory } from "../../domain/entities/affiliate-category";

export class UpdateAffiliateCategoryUseCase {
  constructor(private readonly repository: AffiliateCategoryRepository) {}

  async execute(
    id: string,
    data: UpdateAffiliateCategoryDTO
  ): Promise<AffiliateCategory> {
    return await this.repository.update(id, data);
  }
}
