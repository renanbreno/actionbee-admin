import { GiftInventoryRepositoryImpl } from "./infrastructure/repositories/gift-inventory-repository.impl";
import { GetGiftMovementsUseCase } from "./application/use-cases/get-gift-movements.usecase";
import { AddGiftStockEntryUseCase } from "./application/use-cases/add-gift-stock-entry.usecase";
import { AddGiftStockAdjustmentUseCase } from "./application/use-cases/add-gift-stock-adjustment.usecase";

const giftInventoryRepository = new GiftInventoryRepositoryImpl();

export const getGiftMovementsUseCase = new GetGiftMovementsUseCase(giftInventoryRepository);
export const addGiftStockEntryUseCase = new AddGiftStockEntryUseCase(giftInventoryRepository);
export const addGiftStockAdjustmentUseCase = new AddGiftStockAdjustmentUseCase(giftInventoryRepository);
