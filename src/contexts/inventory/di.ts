import { InventoryRepositoryImpl } from "./infrastructure/repositories/inventory-repository.impl";
import { GetBatchesUseCase } from "./application/use-cases/get-batches.usecase";
import { GetMovementsUseCase } from "./application/use-cases/get-movements.usecase";
import { AddStockEntryUseCase } from "./application/use-cases/add-stock-entry.usecase";
import { AddStockAdjustmentUseCase } from "./application/use-cases/add-stock-adjustment.usecase";

const inventoryRepository = new InventoryRepositoryImpl();

export const getBatchesUseCase = new GetBatchesUseCase(inventoryRepository);
export const getMovementsUseCase = new GetMovementsUseCase(inventoryRepository);
export const addStockEntryUseCase = new AddStockEntryUseCase(inventoryRepository);
export const addStockAdjustmentUseCase = new AddStockAdjustmentUseCase(inventoryRepository);
