import type { AffiliateCategoryRepository } from "../../domain/repositories/affiliate-category-repository.interface";

export class DeleteAffiliateCategoryUseCase {
  constructor(private readonly repository: AffiliateCategoryRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
