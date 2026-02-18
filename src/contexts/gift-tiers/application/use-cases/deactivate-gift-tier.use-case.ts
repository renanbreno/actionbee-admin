import { GiftTierRepository } from "../../domain/repositories/gift-tier-repository.interface";

export class DeactivateGiftTierUseCase {
  constructor(private readonly repository: GiftTierRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.deactivate(id);
  }
}
