import { GiftInventoryRepository } from "../../domain/repositories/gift-inventory-repository.interface";
import { AddGiftStockAdjustmentDTO } from "../dto/add-gift-stock-adjustment.dto";

export class AddGiftStockAdjustmentUseCase {
  constructor(private readonly repository: GiftInventoryRepository) {}

  execute(giftTierId: string, dto: AddGiftStockAdjustmentDTO): Promise<void> {
    return this.repository.addStockAdjustment(giftTierId, dto);
  }
}
