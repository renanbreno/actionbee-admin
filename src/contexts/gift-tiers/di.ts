import { GiftTierRepositoryImpl } from "./infrastructure/repositories/gift-tier-repository.impl";
import { GetGiftTiersUseCase } from "./application/use-cases/get-gift-tiers.use-case";
import { CreateGiftTierUseCase } from "./application/use-cases/create-gift-tier.use-case";
import { UpdateGiftTierUseCase } from "./application/use-cases/update-gift-tier.use-case";
import { ActivateGiftTierUseCase } from "./application/use-cases/activate-gift-tier.use-case";
import { DeactivateGiftTierUseCase } from "./application/use-cases/deactivate-gift-tier.use-case";
import { DeleteGiftTierUseCase } from "./application/use-cases/delete-gift-tier.use-case";

const giftTierRepository = new GiftTierRepositoryImpl();

export const getGiftTiersUseCase = new GetGiftTiersUseCase(giftTierRepository);
export const createGiftTierUseCase = new CreateGiftTierUseCase(giftTierRepository);
export const updateGiftTierUseCase = new UpdateGiftTierUseCase(giftTierRepository);
export const activateGiftTierUseCase = new ActivateGiftTierUseCase(giftTierRepository);
export const deactivateGiftTierUseCase = new DeactivateGiftTierUseCase(giftTierRepository);
export const deleteGiftTierUseCase = new DeleteGiftTierUseCase(giftTierRepository);
