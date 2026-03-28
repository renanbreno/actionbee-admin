import { InventoryRepository } from "../../domain/repositories/inventory-repository.interface";
import { AddStockAdjustmentDTO } from "../dto/add-stock-adjustment.dto";

export class AddStockAdjustmentUseCase {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  execute(productId: string, dto: AddStockAdjustmentDTO): Promise<void> {
    return this.inventoryRepository.addStockAdjustment(productId, dto);
  }
}
