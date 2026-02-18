import { GiftTierRepository } from "../../domain/repositories/gift-tier-repository.interface";

export class DeleteGiftTierUseCase {
  constructor(private readonly repository: GiftTierRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
