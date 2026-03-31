import { ProductBatch } from "../entities/product-batch";
import { PaginatedMovements } from "../entities/stock-movement";
import { AddStockEntryDTO } from "../../application/dto/add-stock-entry.dto";
import { AddStockAdjustmentDTO } from "../../application/dto/add-stock-adjustment.dto";

export interface InventoryRepository {
  getBatches(productId: string, includeInactive?: boolean): Promise<ProductBatch[]>;
  getMovements(productId: string, page: number, limit: number): Promise<PaginatedMovements>;
  addStockEntry(productId: string, dto: AddStockEntryDTO): Promise<ProductBatch>;
  addStockAdjustment(productId: string, dto: AddStockAdjustmentDTO): Promise<void>;
}
