import { PaginatedGiftMovements } from "../entities/gift-stock-movement";
import { AddGiftStockEntryDTO } from "../../application/dto/add-gift-stock-entry.dto";
import { AddGiftStockAdjustmentDTO } from "../../application/dto/add-gift-stock-adjustment.dto";

export interface GiftInventoryRepository {
  getMovements(giftTierId: string, page: number, limit: number): Promise<PaginatedGiftMovements>;
  addStockEntry(giftTierId: string, dto: AddGiftStockEntryDTO): Promise<void>;
  addStockAdjustment(giftTierId: string, dto: AddGiftStockAdjustmentDTO): Promise<void>;
}
