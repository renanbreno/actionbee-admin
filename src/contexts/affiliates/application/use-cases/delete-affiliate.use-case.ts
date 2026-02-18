import { AffiliateRepository } from "../../domain/repositories/affiliate-repository.interface";

export class DeleteAffiliateUseCase {
  constructor(private readonly repository: AffiliateRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
