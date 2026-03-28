import { InventoryRepository } from "../../domain/repositories/inventory-repository.interface";
import { ProductBatch } from "../../domain/entities/product-batch";
import { PaginatedMovements } from "../../domain/entities/stock-movement";
import { AddStockEntryDTO } from "../../application/dto/add-stock-entry.dto";
import { AddStockAdjustmentDTO } from "../../application/dto/add-stock-adjustment.dto";
import { inventoryApiClient } from "../api/inventory-api.client";

export class InventoryRepositoryImpl implements InventoryRepository {
  getBatches(productId: string, includeInactive = false): Promise<ProductBatch[]> {
    return inventoryApiClient.getBatches(productId, includeInactive);
  }

  getMovements(productId: string, page: number, limit: number): Promise<PaginatedMovements> {
    return inventoryApiClient.getMovements(productId, page, limit);
  }

  addStockEntry(productId: string, dto: AddStockEntryDTO): Promise<ProductBatch> {
    return inventoryApiClient.addStockEntry(productId, dto);
  }

  addStockAdjustment(productId: string, dto: AddStockAdjustmentDTO): Promise<void> {
    return inventoryApiClient.addStockAdjustment(productId, dto);
  }
}
