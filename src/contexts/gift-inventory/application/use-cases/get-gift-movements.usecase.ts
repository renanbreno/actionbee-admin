import { GiftInventoryRepository } from "../../domain/repositories/gift-inventory-repository.interface";
import { PaginatedGiftMovements } from "../../domain/entities/gift-stock-movement";

export class GetGiftMovementsUseCase {
  constructor(private readonly repository: GiftInventoryRepository) {}

  execute(giftTierId: string, page: number, limit: number): Promise<PaginatedGiftMovements> {
    return this.repository.getMovements(giftTierId, page, limit);
  }
}
