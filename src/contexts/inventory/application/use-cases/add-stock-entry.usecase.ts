import { ProductBatch } from "../../domain/entities/product-batch";
import { InventoryRepository } from "../../domain/repositories/inventory-repository.interface";
import { AddStockEntryDTO } from "../dto/add-stock-entry.dto";

export class AddStockEntryUseCase {
  constructor(private readonly repository: InventoryRepository) {}

  async execute(productId: string, dto: AddStockEntryDTO): Promise<ProductBatch> {
    return this.repository.addStockEntry(productId, dto);
  }
}
