import { GiftTier } from "../../domain/entities/gift-tier";
import { GiftTierRepository } from "../../domain/repositories/gift-tier-repository.interface";
import { UpdateGiftTierDto } from "../dto/update-gift-tier.dto";

export class UpdateGiftTierUseCase {
  constructor(private readonly repository: GiftTierRepository) {}

  async execute(id: string, dto: UpdateGiftTierDto): Promise<GiftTier> {
    return this.repository.update(id, dto);
  }
}
