import { GiftInventoryRepository } from "../../domain/repositories/gift-inventory-repository.interface";
import { AddGiftStockEntryDTO } from "../dto/add-gift-stock-entry.dto";

export class AddGiftStockEntryUseCase {
  constructor(private readonly repository: GiftInventoryRepository) {}

  execute(giftTierId: string, dto: AddGiftStockEntryDTO): Promise<void> {
    return this.repository.addStockEntry(giftTierId, dto);
  }
}
