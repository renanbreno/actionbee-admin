import { ProductBatch } from "../../domain/entities/product-batch";
import { InventoryRepository } from "../../domain/repositories/inventory-repository.interface";

export class GetBatchesUseCase {
  constructor(private readonly repository: InventoryRepository) {}

  async execute(productId: string, includeInactive = false): Promise<ProductBatch[]> {
    return this.repository.getBatches(productId, includeInactive);
  }
}
