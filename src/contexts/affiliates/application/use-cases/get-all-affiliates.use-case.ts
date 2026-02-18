import { Affiliate } from "../../domain/entities/affiliate";
import { AffiliateRepository } from "../../domain/repositories/affiliate-repository.interface";

export class GetAllAffiliatesUseCase {
  constructor(private readonly repository: AffiliateRepository) {}

  async execute(): Promise<Affiliate[]> {
    return this.repository.getAll();
  }
}
