import { StoreSettings } from "../../domain/entities/store-settings";
import { StoreSettingsRepository, UpdateStoreSettingsParams } from "../../domain/repositories/store-settings-repository.interface";

export class SaveStoreSettingsUseCase {
  constructor(private readonly repository: StoreSettingsRepository) {}

  async execute(params: UpdateStoreSettingsParams, exists: boolean): Promise<StoreSettings> {
    if (exists) {
      return this.repository.update(params);
    }
    return this.repository.create(params);
  }
}
