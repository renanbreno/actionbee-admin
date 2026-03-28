import { GiftInventoryRepository } from "../../domain/repositories/gift-inventory-repository.interface";
import { PaginatedGiftMovements } from "../../domain/entities/gift-stock-movement";
import { AddGiftStockEntryDTO } from "../../application/dto/add-gift-stock-entry.dto";
import { AddGiftStockAdjustmentDTO } from "../../application/dto/add-gift-stock-adjustment.dto";
import { giftInventoryApiClient } from "../api/gift-inventory-api.client";

export class GiftInventoryRepositoryImpl implements GiftInventoryRepository {
  getMovements(giftTierId: string, page: number, limit: number): Promise<PaginatedGiftMovements> {
    return giftInventoryApiClient.getMovements(giftTierId, page, limit);
  }

  addStockEntry(giftTierId: string, dto: AddGiftStockEntryDTO): Promise<void> {
    return giftInventoryApiClient.addStockEntry(giftTierId, dto);
  }

  addStockAdjustment(giftTierId: string, dto: AddGiftStockAdjustmentDTO): Promise<void> {
    return giftInventoryApiClient.addStockAdjustment(giftTierId, dto);
  }
}
