import { StoreSettings } from "../../domain/entities/store-settings";
import {
  StoreSettingsRepository,
  UpdateStoreSettingsParams,
} from "../../domain/repositories/store-settings-repository.interface";
import { storeSettingsApiClient } from "../api/store-settings-api.client";

export class StoreSettingsRepositoryImpl implements StoreSettingsRepository {
  async get(): Promise<StoreSettings | null> {
    try {
      return await storeSettingsApiClient.get();
    } catch {
      return null;
    }
  }

  async create(params: UpdateStoreSettingsParams): Promise<StoreSettings> {
    return storeSettingsApiClient.create(params);
  }

  async update(params: UpdateStoreSettingsParams): Promise<StoreSettings> {
    return storeSettingsApiClient.update(params);
  }
}
