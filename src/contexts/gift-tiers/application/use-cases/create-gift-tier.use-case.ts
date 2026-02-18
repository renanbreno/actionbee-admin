import { GiftTier } from "../../domain/entities/gift-tier";
import { GiftTierRepository } from "../../domain/repositories/gift-tier-repository.interface";
import { CreateGiftTierDto } from "../dto/create-gift-tier.dto";

export class CreateGiftTierUseCase {
  constructor(private readonly repository: GiftTierRepository) {}

  async execute(dto: CreateGiftTierDto): Promise<GiftTier> {
    return this.repository.create(dto);
  }
}
