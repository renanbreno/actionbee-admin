import { PaginatedMovements } from "../../domain/entities/stock-movement";
import { InventoryRepository } from "../../domain/repositories/inventory-repository.interface";

export class GetMovementsUseCase {
  constructor(private readonly repository: InventoryRepository) {}

  async execute(productId: string, page: number, limit: number): Promise<PaginatedMovements> {
    return this.repository.getMovements(productId, page, limit);
  }
}
