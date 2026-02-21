import { StoreSettingsRepositoryImpl } from "./infrastructure/repositories/store-settings-repository.impl";
import { GetStoreSettingsUseCase } from "./application/use-cases/get-store-settings.use-case";
import { SaveStoreSettingsUseCase } from "./application/use-cases/save-store-settings.use-case";

const storeSettingsRepository = new StoreSettingsRepositoryImpl();

export const getStoreSettingsUseCase = new GetStoreSettingsUseCase(storeSettingsRepository);
export const saveStoreSettingsUseCase = new SaveStoreSettingsUseCase(storeSettingsRepository);
