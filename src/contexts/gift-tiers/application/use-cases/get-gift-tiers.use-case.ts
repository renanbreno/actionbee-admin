import { GiftTier } from "../../domain/entities/gift-tier";
import { GiftTierRepository } from "../../domain/repositories/gift-tier-repository.interface";

export class GetGiftTiersUseCase {
  constructor(private readonly repository: GiftTierRepository) {}

  async execute(): Promise<GiftTier[]> {
    return this.repository.getAll();
  }
}
